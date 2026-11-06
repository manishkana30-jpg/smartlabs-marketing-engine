import { NextRequest, NextResponse } from "next/server";
import { runUniversalSynthesizer, TonePreset } from "@/lib/synthesizer";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      seedTopic,
      targetLandingUrl,
      tone = "growth-hacker",
      workspaceId = "default-workspace",
    } = body;

    if (!seedTopic || !targetLandingUrl) {
      return NextResponse.json(
        { error: "seedTopic and targetLandingUrl are required" },
        { status: 400 }
      );
    }

    // Execute universal synthesizer (keyless by default, upgrades to LLM if keys are present)
    const result = await runUniversalSynthesizer({
      seedTopic,
      targetLandingUrl,
      tone: tone as TonePreset,
      workspaceId,
    });

    // Optionally record campaign run in SQLite database
    try {
      const workspace = await prisma.workspace.upsert({
        where: { slug: workspaceId },
        create: {
          id: workspaceId,
          name: "Default Workspace",
          slug: workspaceId,
          websiteUrl: targetLandingUrl,
        },
        update: {},
      });

      const idempotencyKey = `${workspace.id}:${Date.now()}:${Math.random().toString(36).substring(7)}`;

      await prisma.campaignRun.create({
        data: {
          workspaceId: workspace.id,
          status: "COMPLETED",
          seedTopic,
          targetUrl: targetLandingUrl,
          canonicalPayload: JSON.stringify(result.payload),
          idempotencyKey,
        },
      });
    } catch (dbErr) {
      // Non-blocking if database is unseeded
      console.warn("Notice: SQLite campaign run log skipped:", dbErr);
    }

    return NextResponse.json({
      success: true,
      payload: result.payload,
      modelUsed: result.modelUsed,
      isKeyless: result.isKeyless,
    });
  } catch (error: any) {
    console.error("Synthesis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to synthesize marketing content",
      },
      { status: 500 }
    );
  }
}
