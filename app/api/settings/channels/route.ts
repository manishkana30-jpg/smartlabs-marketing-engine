import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/security/vault";
import { Platform, ConnectionStatus } from "@prisma/client";


export async function GET(req: NextRequest) {
  try {
    const workspaceSlug = "default-workspace";
    const connections = await prisma.channelConnection.findMany({
      where: {
        workspace: { slug: workspaceSlug },
      },
      select: {
        id: true,
        platform: true,
        accountName: true,
        metadata: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, connections });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch channel connections" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      workspaceId = "default-workspace",
      platform,
      accountName,
      accessToken,
      refreshToken,
      metadata = {},
    } = await req.json();

    if (!platform || !accountName || !accessToken) {
      return NextResponse.json(
        { error: "platform, accountName, and accessToken are required" },
        { status: 400 }
      );
    }

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

    // Encrypt token via AES-256-GCM Vault
    const encryptedToken = encryptSecret(accessToken);
    const encryptedRefresh = refreshToken ? encryptSecret(refreshToken) : null;

    const connection = await prisma.channelConnection.upsert({
      where: {
        workspaceId_platform_accountName: {
          workspaceId: workspace.id,
          platform: platform as Platform,
          accountName,
        },
      },
      create: {
        workspaceId: workspace.id,
        platform: platform as Platform,
        accountName,
        encryptedAccessToken: encryptedToken.ciphertext,
        encryptedRefreshToken: encryptedRefresh ? encryptedRefresh.ciphertext : null,
        iv: encryptedToken.iv,
        tag: encryptedToken.tag,
        metadata,
        status: ConnectionStatus.ACTIVE,
      },
      update: {
        encryptedAccessToken: encryptedToken.ciphertext,
        encryptedRefreshToken: encryptedRefresh ? encryptedRefresh.ciphertext : null,
        iv: encryptedToken.iv,
        tag: encryptedToken.tag,
        metadata,
        status: ConnectionStatus.ACTIVE,
      },
    });

    return NextResponse.json({
      success: true,
      id: connection.id,
      platform: connection.platform,
      accountName: connection.accountName,
      status: connection.status,
    });
  } catch (error: any) {
    console.error("Failed to connect channel:", error);
    return NextResponse.json(
      { error: error.message || "Failed to connect channel" },
      { status: 500 }
    );
  }
}
