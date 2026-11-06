import { Platform } from "../types";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { PinterestContent } from "../ai/types";

export const pinterestAdapter: ChannelAdapter<PinterestContent> = {
  platform: Platform.PINTEREST,

  async publish(
    connection: DecryptedConnection,
    content: PinterestContent,
    mediaUrls?: string[]
  ): Promise<PublishResult> {
    try {
      const accessToken = connection.accessToken;
      const boardId = connection.parsedMetadata.boardId;

      if (!boardId) {
        return {
          success: false,
          error: "Pinterest boardId is required in channel metadata.",
        };
      }

      // Pinterest requires an image media source
      const imageUrl =
        mediaUrls && mediaUrls.length > 0
          ? mediaUrls[0]
          : connection.parsedMetadata.fallbackImageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800";

      const payload = {
        board_id: boardId,
        title: content.title.slice(0, 100),
        description: content.description.slice(0, 500),
        link: content.destinationUrl,
        media_source: {
          source_type: "image_url",
          url: imageUrl,
        },
      };

      const res = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.message || `Pinterest API error: ${res.status}`,
          metadata: data,
        };
      }

      const pinId = data.id || `pin-${Date.now()}`;
      return {
        success: true,
        externalPostId: pinId,
        externalUrl: `https://www.pinterest.com/pin/${pinId}/`,
        metadata: data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish Pin to Pinterest",
      };
    }
  },
};

