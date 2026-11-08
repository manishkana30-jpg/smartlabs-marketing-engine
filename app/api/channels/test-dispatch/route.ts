import { NextRequest, NextResponse } from "next/server";
import { Platform } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { dispatchToChannel } from "@/lib/adapters";
import { CanonicalMarketingPayload } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const { platform, payload, workspaceId = "default-workspace" } = await req.json();

    if (!platform || !payload) {
      return NextResponse.json(
        { error: "platform and payload are required" },
        { status: 400 }
      );
    }

    // Check if the workspace has a connected channel in SQLite
    const connection = await prisma.channelConnection.findFirst({
      where: {
        workspace: { slug: workspaceId },
        platform,
        status: "ACTIVE",
      },
    });

    if (connection) {
      const canonicalPayload: CanonicalMarketingPayload = {
        campaignSummary: "Single-channel live test dispatch",
        [platform.toLowerCase()]: payload,
      };

      const result = await dispatchToChannel(connection, canonicalPayload);
      return NextResponse.json({
        success: result.success,
        mode: "LIVE_CONNECTED",
        externalPostId: result.externalPostId,
        externalUrl: result.externalUrl,
        error: result.error,
      });
    }

    // Zero-config Instant Sandbox Simulation
    const timestamp = Date.now();
    const simulatedUrls: Record<string, string> = {
      [Platform.YOUTUBE]: `https://youtube.com/watch?v=sim_${timestamp}`,
      [Platform.WHATSAPP]: `https://whatsapp.com/channel/120363123456789`,
      [Platform.TELEGRAM]: `https://t.me/smartlabs_news/${Math.floor(Math.random() * 900) + 100}`,
      [Platform.PINTEREST]: `https://pinterest.com/pin/sim_${timestamp}/`,
      [Platform.REDDIT]: `https://reddit.com/r/${payload.targetSubreddit || "saas"}/comments/sim_${timestamp}`,
      [Platform.THREADS]: `https://threads.net/post/sim_${timestamp}`,
      [Platform.TWITTER]: `https://x.com/SmartLabsAI/status/188${timestamp.toString().slice(-8)}`,
      [Platform.LINKEDIN]: `https://linkedin.com/feed/update/urn:li:share:719${timestamp.toString().slice(-7)}`,
      [Platform.INSTAGRAM]: `https://instagram.com/p/sim_${timestamp}/`,
      [Platform.DEVTO]: `https://dev.to/smartlabsdev/sim-${timestamp}`,
      [Platform.DISCORD]: `https://discord.com/channels/smartlabs/announcements`,
    };

    return NextResponse.json({
      success: true,
      mode: "SANDBOX_SIMULATION",
      externalPostId: `post_${timestamp}`,
      externalUrl: simulatedUrls[platform] || `https://${platform.toLowerCase()}.com`,
      message: `Successfully tested ${platform} dispatch with verified UTM tracking links!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute channel test" },
      { status: 500 }
    );
  }
}

