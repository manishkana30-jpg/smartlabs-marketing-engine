import { Platform, ChannelConnection } from "@prisma/client";

export interface PublishResult {
  success: boolean;
  externalPostId?: string;
  externalUrl?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface DecryptedConnection extends Omit<ChannelConnection, "encryptedAccessToken" | "encryptedRefreshToken"> {
  accessToken: string;
  refreshToken?: string;
  parsedMetadata: Record<string, any>;
}

export interface ChannelAdapter<TContent> {
  platform: Platform;
  publish(
    connection: DecryptedConnection,
    content: TContent,
    mediaUrls?: string[]
  ): Promise<PublishResult>;
}
