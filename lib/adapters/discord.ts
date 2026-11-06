import { Platform } from "@prisma/client";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { DiscordContent } from "../ai/types";

export const discordAdapter: ChannelAdapter<DiscordContent> = {
  platform: Platform.DISCORD,

  async publish(
    connection: DecryptedConnection,
    content: DiscordContent
  ): Promise<PublishResult> {
    try {
      const webhookUrl =
        connection.parsedMetadata.webhookUrl || connection.accessToken;

      if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
        return {
          success: false,
          error: "Valid Discord webhookUrl is required in channel connection metadata.",
        };
      }

      const payload = {
        embeds: [
          {
            title: content.embedTitle.slice(0, 256),
            description: content.embedDescription.slice(0, 2048),
            url: content.ctaUrl,
            color: content.embedColor || 0x5865f2,
            timestamp: new Date().toISOString(),
            footer: {
              text: "SmartLabs Marketing Engine • Autonomous Traffic Syndication",
            },
          },
        ],
      };

      const res = await fetch(`${webhookUrl}?wait=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `Discord webhook returned ${res.status}: ${errorText}`,
        };
      }

      const data = await res.json().catch(() => ({}));
      const messageId = data.id || `discord-${Date.now()}`;

      return {
        success: true,
        externalPostId: messageId,
        externalUrl: webhookUrl.replace(/\/webhooks\/.+/, "/channels"),
        metadata: data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to dispatch message to Discord webhook",
      };
    }
  },
};
