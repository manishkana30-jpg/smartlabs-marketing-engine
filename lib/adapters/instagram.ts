import { Platform } from "../types";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { InstagramContent } from "../ai/types";

export const instagramAdapter: ChannelAdapter<InstagramContent> = {
  platform: Platform.INSTAGRAM,

  async publish(
    connection: DecryptedConnection,
    content: InstagramContent,
    mediaUrls?: string[]
  ): Promise<PublishResult> {
    try {
      const accessToken = connection.accessToken;
      const igUserId = connection.parsedMetadata.instagramAccountId || connection.parsedMetadata.igUserId;

      if (!igUserId) {
        return {
          success: false,
          error: "instagramAccountId is required in channel metadata.",
        };
      }

      const imageUrl =
        mediaUrls && mediaUrls.length > 0
          ? mediaUrls[0]
          : connection.parsedMetadata.defaultImageUrl ||
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080";

      // 1. Create container
      const containerRes = await fetch(
        `https://graph.facebook.com/v21.0/${igUserId}/media`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: imageUrl,
            caption: content.caption,
            access_token: accessToken,
          }),
        }
      );

      const containerData = await containerRes.json();
      if (!containerRes.ok || !containerData.id) {
        return {
          success: false,
          error: containerData.error?.message || "Instagram media container creation failed",
          metadata: containerData,
        };
      }

      const creationId = containerData.id;

      // 2. Publish container
      const publishRes = await fetch(
        `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: creationId,
            access_token: accessToken,
          }),
        }
      );

      const publishData = await publishRes.json();
      if (!publishRes.ok || !publishData.id) {
        return {
          success: false,
          error: publishData.error?.message || "Instagram media publish failed",
          metadata: publishData,
        };
      }

      const mediaId = publishData.id;

      // 3. Post first comment with hashtags if provided
      if (content.firstCommentHashtags) {
        try {
          await fetch(`https://graph.facebook.com/v21.0/${mediaId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: content.firstCommentHashtags,
              access_token: accessToken,
            }),
          });
        } catch {
          // Non-critical comment failure
        }
      }

      return {
        success: true,
        externalPostId: mediaId,
        externalUrl: `https://www.instagram.com/p/${mediaId}/`,
        metadata: publishData,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish to Instagram",
      };
    }
  },
};

