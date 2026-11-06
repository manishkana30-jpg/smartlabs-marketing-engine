import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/security/vault";
import { AiProvider } from "@prisma/client";


export async function POST(req: NextRequest) {
  try {
    const { workspaceId = "default-workspace", provider, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider and apiKey are required" },
        { status: 400 }
      );
    }

    // Ensure default workspace exists
    const workspace = await prisma.workspace.upsert({
      where: { slug: workspaceId },
      create: {
        id: workspaceId,
        name: "Production Workspace",
        slug: workspaceId,
        websiteUrl: "https://smartlabs.ai",
      },
      update: {},
    });

    // Encrypt with AES-256-GCM Vault
    const encrypted = encryptSecret(apiKey);

    const record = await prisma.workspaceApiKey.upsert({
      where: {
        workspaceId_provider: {
          workspaceId: workspace.id,
          provider: provider as AiProvider,
        },
      },
      create: {
        workspaceId: workspace.id,
        provider: provider as AiProvider,
        encryptedKey: encrypted.ciphertext,
        iv: encrypted.iv,
        tag: encrypted.tag,
      },
      update: {
        encryptedKey: encrypted.ciphertext,
        iv: encrypted.iv,
        tag: encrypted.tag,
      },
    });

    return NextResponse.json({
      success: true,
      provider: record.provider,
      updatedAt: record.updatedAt,
    });
  } catch (error: any) {
    console.error("Failed to save BYOK key:", error);
    return NextResponse.json(
      { error: error.message || "Failed to encrypt and store API key" },
      { status: 500 }
    );
  }
}
