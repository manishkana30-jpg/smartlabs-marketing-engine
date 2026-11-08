import { NextRequest, NextResponse } from "next/server";
import { runUniversalSynthesizer } from "@/lib/synthesizer";
import { prisma } from "@/lib/prisma";
import { enqueueChannelDispatch } from "@/lib/queue/qstash";
import { Platform } from "@/lib/types";

/**
 * Inbound GitHub Webhook Handler
 * Triggers autonomous marketing syndication when a new GitHub release or tag is published.
 */
export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get("x-github-event");
    const payload = await req.json();

    // Support 'release' event (e.g. action: 'published')
    if (event === "release" && payload.action === "published") {
      const release = payload.release;
      const repository = payload.repository;

      const releaseTitle = release.name || release.tag_name || "New Release";
      const releaseBody = release.body || "Feature updates and performance improvements";
      const targetUrl = release.html_url || repository.html_url;

      const seedTopic = `GitHub Release ${releaseTitle} for ${repository.name}: ${releaseBody}`.slice(
        0,
        500
      );

      // Synthesize content for all 11 platforms
      const synthesis = await runUniversalSynthesizer({
        seedTopic,
        targetLandingUrl: targetUrl,
        tone: "technical-founder",
      });

      // Record campaign run in SQLite
      const workspaceId = "default-workspace";
      const workspace = await prisma.workspace.upsert({
        where: { slug: workspaceId },
        create: {
          id: workspaceId,
          name: "Default Workspace",
          slug: workspaceId,
          websiteUrl: targetUrl,
        },
        update: {},
      });

      const idempotencyKey = `github:${repository.full_name}:${release.id}`;

      const campaignRun = await prisma.campaignRun.upsert({
        where: { idempotencyKey },
        create: {
          workspaceId: workspace.id,
          status: "PROCESSING",
          seedTopic,
          targetUrl,
          canonicalPayload: JSON.stringify(synthesis.payload),
          idempotencyKey,
        },
        update: {
          canonicalPayload: JSON.stringify(synthesis.payload),
        },
      });

      // Dispatch to active connected channels
      const connections = await prisma.channelConnection.findMany({
        where: { workspaceId: workspace.id, status: "ACTIVE" },
      });

      let delaySeconds = 0;
      for (const conn of connections) {
        await enqueueChannelDispatch(
          {
            campaignRunId: campaignRun.id,
            channelConnectionId: conn.id,
            channel: conn.platform as Platform,
            workspaceId: workspace.id,
          },
          delaySeconds
        );
        delaySeconds += 10;
      }

      return NextResponse.json({
        success: true,
        event: "release.published",
        repository: repository.full_name,
        release: releaseTitle,
        campaignRunId: campaignRun.id,
        dispatchedChannelsCount: connections.length,
      });
    }

    // Ping event verification from GitHub webhook settings
    if (event === "ping") {
      return NextResponse.json({
        success: true,
        message: "GitHub webhook successfully connected to SmartLabs Marketing Engine!",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Ignored event '${event}'. Listening for 'release.published'`,
    });
  } catch (error: any) {
    console.error("GitHub webhook error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Webhook handling failed" },
      { status: 500 }
    );
  }
}
