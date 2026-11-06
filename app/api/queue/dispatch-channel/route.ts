import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dispatchToChannel } from "@/lib/adapters";
import { ChannelDispatchJob, verifyQStashSignature } from "@/lib/queue/qstash";
import { isChannelAlreadyDispatched } from "@/lib/queue/idempotency";
import { CanonicalMarketingPayload } from "@/lib/ai/types";


export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("upstash-signature");
    const cronSecretHeader = req.headers.get("x-cron-secret");
    const expectedSecret = process.env.CRON_SECRET;

    // Verify caller authenticity (either QStash signature or secret header)
    const isSecretAuthorized = expectedSecret && cronSecretHeader === expectedSecret;
    const isQStashValid = await verifyQStashSignature(signature, rawBody);

    if (!isSecretAuthorized && !isQStashValid && expectedSecret) {
      return NextResponse.json({ error: "Unauthorized dispatch request" }, { status: 401 });
    }

    const job: ChannelDispatchJob = JSON.parse(rawBody);
    const { campaignRunId, channelConnectionId, channel } = job;

    if (!campaignRunId || !channelConnectionId || !channel) {
      return NextResponse.json(
        { error: "Missing required job parameters" },
        { status: 400 }
      );
    }

    // 1. Idempotency Check: Prevent duplicate publishing if already succeeded
    const alreadyDispatched = await isChannelAlreadyDispatched(campaignRunId, channel);
    if (alreadyDispatched) {
      return NextResponse.json({
        success: true,
        status: "SKIPPED_ALREADY_SUCCESSFUL",
        message: `Channel ${channel} was already published for campaign ${campaignRunId}`,
      });
    }

    // 2. Fetch CampaignRun and ChannelConnection
    const [campaignRun, channelConnection] = await Promise.all([
      prisma.campaignRun.findUnique({
        where: { id: campaignRunId },
      }),
      prisma.channelConnection.findUnique({
        where: { id: channelConnectionId },
      }),
    ]);

    if (!campaignRun) {
      return NextResponse.json(
        { error: `CampaignRun ${campaignRunId} not found` },
        { status: 404 }
      );
    }

    if (!channelConnection) {
      return NextResponse.json(
        { error: `ChannelConnection ${channelConnectionId} not found` },
        { status: 404 }
      );
    }

    // 3. Create or record initial PublishLog attempt
    let publishLog = await prisma.publishLog.findFirst({
      where: { campaignRunId, channel },
    });

    if (!publishLog) {
      publishLog = await prisma.publishLog.create({
        data: {
          campaignRunId,
          channel,
          status: "RETRYING",
          attempts: 1,
        },
      });
    } else {
      publishLog = await prisma.publishLog.update({
        where: { id: publishLog.id },
        data: {
          attempts: { increment: 1 },
          status: "RETRYING",
        },
      });
    }

    // 4. Execute channel-specific publishing adapter
    const payload = (
      typeof campaignRun.canonicalPayload === "string"
        ? JSON.parse(campaignRun.canonicalPayload)
        : campaignRun.canonicalPayload
    ) as CanonicalMarketingPayload;

    let mediaUrls: string[] = [];
    if (typeof campaignRun.mediaUrls === "string") {
      try {
        mediaUrls = JSON.parse(campaignRun.mediaUrls);
      } catch {
        mediaUrls = [];
      }
    } else if (Array.isArray(campaignRun.mediaUrls)) {
      mediaUrls = campaignRun.mediaUrls;
    }

    const result = await dispatchToChannel(channelConnection, payload, mediaUrls);

    // 5. Update PublishLog with results
    if (result.success) {
      await prisma.publishLog.update({
        where: { id: publishLog.id },
        data: {
          status: "SUCCESS",
          externalPostId: result.externalPostId,
          externalUrl: result.externalUrl,
          errorResponse: null,
          executedAt: new Date(),
        },
      });

      // Check if all channels for this campaign run are now completed
      const totalLogs = await prisma.publishLog.findMany({
        where: { campaignRunId },
      });

      const allSuccess = totalLogs.every((l) => l.status === "SUCCESS");
      if (allSuccess) {
        await prisma.campaignRun.update({
          where: { id: campaignRunId },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
          },
        });
      }

      return NextResponse.json({
        success: true,
        channel,
        externalPostId: result.externalPostId,
        externalUrl: result.externalUrl,
      });
    } else {
      await prisma.publishLog.update({
        where: { id: publishLog.id },
        data: {
          status: "FAILED",
          errorResponse: result.error || "Unknown dispatch failure",
          executedAt: new Date(),
        },
      });

      await prisma.campaignRun.update({
        where: { id: campaignRunId },
        data: {
          status: "PARTIALLY_FAILED",
        },
      });

      // If under max attempts, return 500 to trigger QStash exponential backoff retry
      const maxRetries = 3;
      if (publishLog.attempts < maxRetries) {
        return NextResponse.json(
          {
            success: false,
            error: result.error,
            attempt: publishLog.attempts,
            willRetry: true,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: false,
        error: result.error,
        attempt: publishLog.attempts,
        willRetry: false,
      });
    }
  } catch (error: any) {
    console.error("Critical error in /api/queue/dispatch-channel:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
