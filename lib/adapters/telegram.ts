import { Platform } from "../types";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { TelegramContent } from "../ai/types";

export const telegramAdapter: ChannelAdapter<TelegramContent> = {
  platform: Platform.TELEGRAM,

  async publish(
    connection: DecryptedConnection,
    content: TelegramContent,
    mediaUrls?: string[]
  ): Promise<PublishResult> {
    try {
      const botToken = connection.accessToken;
      const chatId = connection.parsedMetadata.chatId || connection.parsedMetadata.channelId;

      if (!chatId) {
        return {
          success: false,
          error: "Telegram chatId (e.g. '@yourchannel' or numeric ID) is required in channel metadata.",
        };
      }

      const replyMarkup = {
        inline_keyboard: [
          [
            {
              text: content.buttonText,
              url: content.buttonUrl,
            },
          ],
        ],
      };

      const mediaUrl = mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : null;

      let endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
      let body: Record<string, unknown> = {
        chat_id: chatId,
        text: content.htmlMessage,
        parse_mode: "HTML",
        disable_web_page_preview: false,
        reply_markup: replyMarkup,
      };

      if (mediaUrl) {
        endpoint = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        body = {
          chat_id: chatId,
          photo: mediaUrl,
          caption: content.htmlMessage.slice(0, 1024),
          parse_mode: "HTML",
          reply_markup: replyMarkup,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.ok) {
        return {
          success: false,
          error: data.description || "Telegram API error",
          metadata: data,
        };
      }

      const messageId = data.result?.message_id;
      const cleanChat = String(chatId).replace(/^@/, "");
      const externalUrl = String(chatId).startsWith("@")
        ? `https://t.me/${cleanChat}/${messageId}`
        : `https://t.me/c/${cleanChat}/${messageId}`;

      return {
        success: true,
        externalPostId: String(messageId),
        externalUrl,
        metadata: data.result,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish to Telegram",
      };
    }
  },
};

