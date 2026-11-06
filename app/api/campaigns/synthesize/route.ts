import { NextRequest, NextResponse } from "next/server";
import { synthesizeMarketingContent } from "@/lib/ai/synthesizer";
import { Platform } from "@prisma/client";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      seedTopic,
      targetLandingUrl,
      brandVoice = "authoritative",
      targetPlatforms = [
        Platform.YOUTUBE,
        Platform.WHATSAPP,
        Platform.TELEGRAM,
        Platform.PINTEREST,
        Platform.REDDIT,
        Platform.THREADS,
        Platform.TWITTER,
        Platform.LINKEDIN,
        Platform.INSTAGRAM,
        Platform.DEVTO,
        Platform.DISCORD,
      ],
      workspaceId,
    } = body;

    if (!seedTopic || !targetLandingUrl) {
      return NextResponse.json(
        { error: "seedTopic and targetLandingUrl are required" },
        { status: 400 }
      );
    }

    const result = await synthesizeMarketingContent({
      seedTopic,
      targetLandingUrl,
      brandVoice,
      targetPlatforms,
      workspaceId,
    });

    return NextResponse.json({
      success: true,
      payload: result.payload,
      utmUrls: result.utmUrls,
      modelUsed: result.modelUsed,
      providerUsed: result.providerUsed,
    });
  } catch (error: any) {
    console.error("Synthesis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to synthesize content",
      },
      { status: 500 }
    );
  }
}
