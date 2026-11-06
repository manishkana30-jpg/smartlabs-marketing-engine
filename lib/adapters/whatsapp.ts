import { Platform } from "../types";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { WhatsappContent } from "../ai/types";

export const whatsappAdapter: ChannelAdapter<WhatsappContent> = {
  platform: Platform.WHATSAPP,

  async publish(
    connection: DecryptedConnection,
    content: WhatsappContent,
    mediaUrls?: string[]
  ): Promise<PublishResult> {
    try {
      const { accessToken, parsedMetadata } = connection;
      const newsletterJid = parsedMetadata.newsletterJid || parsedMetadata.channelId;
      const phoneNumberId = parsedMetadata.phoneNumberId;

      // 1. WhatsApp Channel Broadcast (Newsletter API)
      if (newsletterJid) {
        const url = `https://graph.facebook.com/v21.0/${newsletterJid}/messages`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "newsletter",
            type: "text",
            text: {
              body: `${content.messageText}\n\n👉 [${content.ctaButtonText}](${content.ctaUrl})`,
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          return {
            success: false,
            error: data.error?.message || `WhatsApp Channel API failed: ${res.status}`,
            metadata: data,
          };
        }

        const messageId = data.messages?.[0]?.id || data.id || `wa-${Date.now()}`;
        return {
          success: true,
          externalPostId: messageId,
          externalUrl: `https://whatsapp.com/channel/${newsletterJid}`,
          metadata: data,
        };
      }

      // 2. WhatsApp Business Cloud API Broadcast (Template or Interactive CTA)
      if (phoneNumberId) {
        const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
        const recipient = parsedMetadata.targetRecipientPhone || "broadcast";

        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: recipient,
            type: "interactive",
            interactive: {
              type: "cta_url",
              body: { text: content.messageText },
              action: {
                name: "cta_url",
                parameters: {
                  display_text: content.ctaButtonText.slice(0, 20),
                  url: content.ctaUrl,
                },
              },
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          return {
            success: false,
            error: data.error?.message || `WhatsApp Cloud API failed: ${res.status}`,
            metadata: data,
          };
        }

        const messageId = data.messages?.[0]?.id || `wa-${Date.now()}`;
        return {
          success: true,
          externalPostId: messageId,
          externalUrl: `https://wa.me/${recipient}`,
          metadata: data,
        };
      }

      return {
        success: false,
        error: "Missing WhatsApp channel configuration: newsletterJid or phoneNumberId is required in metadata.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to dispatch WhatsApp broadcast",
      };
    }
  },
};

