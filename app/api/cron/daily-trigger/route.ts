import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Platform } from "@/lib/types";
import { synthesizeMarketingContent } from "@/lib/ai/synthesizer";
import { generateCampaignIdempotencyKey } from "@/lib/queue/idempotency";
import { enqueueChannelDispatch } from "@/lib/queue/qstash";


/**
 * 24/7 Cloud Daily Trigger
 * Securable via Authorization: Bearer <CRON_SECRET> or QStash / Vercel Cron.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secretHeader = req.headers.get("x-cron-secret");
    const expectedSecret = process.env.CRON_SECRET;

    const isAuthorized =
      !expectedSecret ||
      secretHeader === expectedSecret ||
      authHeader === `Bearer ${expectedSecret}`;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch all active workflows with their associated workspace and active channel connections
    const activeWorkflows = await prisma.workflow.findMany({
      where: { isActive: true },
      include: {
        workspace: {
          include: {
            connections: {
              where: { status: "ACTIVE" },
            },
          },
        },
      },
    });

    const executionResults = [];

    for (const workflow of activeWorkflows) {
      const workspace = workflow.workspace;
      const connections = workspace.connections;

      if (connections.length === 0) {
        executionResults.push({
          workflowId: workflow.id,
          status: "SKIPPED_NO_CONNECTED_CHANNELS",
        });
        continue;
      }

      // Extract target platforms from active connections
      const targetPlatforms = Array.from(
        new Set(connections.map((c) => c.platform))
      ) as Platform[];

      const websiteUrl = workspace.websiteUrl || "https://smartlabs.ai";
      const seedTopic =
        workflow.name || "Daily High-Converting Feature Update & Growth Insights";

      // 2. Deterministic Idempotency Key check
      const idempotencyKey = generateCampaignIdempotencyKey(
        workspace.id,
        seedTopic
      );

      const existingRun = await prisma.campaignRun.findUnique({
        where: { idempotencyKey },
      });

      if (existingRun && existingRun.status === "COMPLETED") {
        executionResults.push({
          workflowId: workflow.id,
          campaignRunId: existingRun.id,
          status: "ALREADY_COMPLETED_TODAY",
        });
        continue;
      }

      // 3. Single-Source LLM Content Synthesis
      let synthesisResult;
      try {
        synthesisResult = await synthesizeMarketingContent({
          seedTopic,
          targetLandingUrl: websiteUrl,
          brandVoice: "authoritative",
          targetPlatforms,
          workspaceId: workspace.id,
        });
      } catch (synthError: any) {
        console.error(
          `Synthesis failed for workflow ${workflow.id}:`,
          synthError
        );
        executionResults.push({
          workflowId: workflow.id,
          status: "SYNTHESIS_FAILED",
          error: synthError.message,
        });
        continue;
      }

      // 4. Create or update CampaignRun record
      const campaignRun = await prisma.campaignRun.upsert({
        where: { idempotencyKey },
        create: {
          workspaceId: workspace.id,
          workflowId: workflow.id,
          status: "PROCESSING",
          seedTopic,
          targetUrl: websiteUrl,
          canonicalPayload: JSON.stringify(synthesisResult.payload),
          idempotencyKey,
        },
        update: {
          status: "PROCESSING",
          canonicalPayload: JSON.stringify(synthesisResult.payload),
        },
      });

      // 5. Enqueue each channel job with a staggered delay to prevent rate limits
      let delaySeconds = 0;
      const enqueuedJobs = [];

      for (const connection of connections) {
        const job = {
          campaignRunId: campaignRun.id,
          channelConnectionId: connection.id,
          channel: connection.platform as Platform,
          workspaceId: workspace.id,
        };

        await enqueueChannelDispatch(job, delaySeconds);
        enqueuedJobs.push({
          platform: connection.platform,
          delaySeconds,
        });

        // Stagger channel dispatches by 10 seconds
        delaySeconds += 10;
      }

      executionResults.push({
        workflowId: workflow.id,
        campaignRunId: campaignRun.id,
        status: "QUEUED_CHANNELS",
        dispatchedChannels: enqueuedJobs,
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processedWorkflowsCount: activeWorkflows.length,
      executions: executionResults,
    });
  } catch (error: any) {
    console.error("Critical error in /api/cron/daily-trigger:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Support GET for external uptime monitors / pingers
export async function GET(req: NextRequest) {
  return POST(req);
}
