import { Platform, ChannelConnection } from "@prisma/client";
import { decryptSecret } from "../security/vault";
import { CanonicalMarketingPayload } from "../ai/types";
import { DecryptedConnection, PublishResult } from "./types";
import { youtubeAdapter } from "./youtube";
import { whatsappAdapter } from "./whatsapp";
import { telegramAdapter } from "./telegram";
import { pinterestAdapter } from "./pinterest";
import { redditAdapter } from "./reddit";
import { threadsAdapter } from "./threads";
import { twitterAdapter } from "./twitter";
import { linkedinAdapter } from "./linkedin";
import { instagramAdapter } from "./instagram";
import { devtoAdapter } from "./devto";
import { discordAdapter } from "./discord";

/**
 * Decrypts a stored database ChannelConnection using AES-256-GCM.
 */
export function decryptChannelConnection(
  connection: ChannelConnection
): DecryptedConnection {
  const accessToken = decryptSecret(
    connection.encryptedAccessToken,
    connection.iv,
    connection.tag
  );

  let refreshToken: string | undefined;
  if (connection.encryptedRefreshToken) {
    try {
      refreshToken = decryptSecret(
        connection.encryptedRefreshToken,
        connection.iv,
        connection.tag
      );
    } catch {
      // Non-critical if refresh token fails decryption
    }
  }

  let parsedMetadata: Record<string, any> = {};
  if (typeof connection.metadata === "string") {
    try {
      parsedMetadata = JSON.parse(connection.metadata);
    } catch {
      parsedMetadata = {};
    }
  } else if (connection.metadata && typeof connection.metadata === "object") {
    parsedMetadata = connection.metadata as Record<string, any>;
  }

  return {
    ...connection,
    accessToken,
    refreshToken,
    parsedMetadata,
  };
}

/**
 * Dispatches a synthesized canonical content payload to any of the 11 supported platforms.
 */
export async function dispatchToChannel(
  rawConnection: ChannelConnection,
  payload: CanonicalMarketingPayload,
  mediaUrls: string[] = []
): Promise<PublishResult> {
  const decrypted = decryptChannelConnection(rawConnection);
  const platform = rawConnection.platform;

  switch (platform) {
    case Platform.YOUTUBE: {
      if (!payload.youtube) {
        return { success: false, error: "No YouTube payload present in campaign." };
      }
      return youtubeAdapter.publish(decrypted, payload.youtube, mediaUrls);
    }
    case Platform.WHATSAPP: {
      if (!payload.whatsapp) {
        return { success: false, error: "No WhatsApp payload present in campaign." };
      }
      return whatsappAdapter.publish(decrypted, payload.whatsapp, mediaUrls);
    }
    case Platform.TELEGRAM: {
      if (!payload.telegram) {
        return { success: false, error: "No Telegram payload present in campaign." };
      }
      return telegramAdapter.publish(decrypted, payload.telegram, mediaUrls);
    }
    case Platform.PINTEREST: {
      if (!payload.pinterest) {
        return { success: false, error: "No Pinterest payload present in campaign." };
      }
      return pinterestAdapter.publish(decrypted, payload.pinterest, mediaUrls);
    }
    case Platform.REDDIT: {
      if (!payload.reddit) {
        return { success: false, error: "No Reddit payload present in campaign." };
      }
      return redditAdapter.publish(decrypted, payload.reddit);
    }
    case Platform.THREADS: {
      if (!payload.threads) {
        return { success: false, error: "No Threads payload present in campaign." };
      }
      return threadsAdapter.publish(decrypted, payload.threads);
    }
    case Platform.TWITTER: {
      if (!payload.twitter) {
        return { success: false, error: "No Twitter payload present in campaign." };
      }
      return twitterAdapter.publish(decrypted, payload.twitter);
    }
    case Platform.LINKEDIN: {
      if (!payload.linkedin) {
        return { success: false, error: "No LinkedIn payload present in campaign." };
      }
      return linkedinAdapter.publish(decrypted, payload.linkedin);
    }
    case Platform.INSTAGRAM: {
      if (!payload.instagram) {
        return { success: false, error: "No Instagram payload present in campaign." };
      }
      return instagramAdapter.publish(decrypted, payload.instagram, mediaUrls);
    }
    case Platform.DEVTO: {
      if (!payload.devto) {
        return { success: false, error: "No Dev.to payload present in campaign." };
      }
      return devtoAdapter.publish(decrypted, payload.devto);
    }
    case Platform.DISCORD: {
      if (!payload.discord) {
        return { success: false, error: "No Discord payload present in campaign." };
      }
      return discordAdapter.publish(decrypted, payload.discord);
    }
    default:
      return {
        success: false,
        error: `Unsupported platform: ${platform}`,
      };
  }
}
