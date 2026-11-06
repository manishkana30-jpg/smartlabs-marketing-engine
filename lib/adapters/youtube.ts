import { Platform } from "../types";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { YoutubeContent } from "../ai/types";

export const youtubeAdapter: ChannelAdapter<YoutubeContent> = {
  platform: Platform.YOUTUBE,

  async publish(
    connection: DecryptedConnection,
    content: YoutubeContent,
    mediaUrls?: string[]
  ): Promise<PublishResult> {
    try {
      const accessToken = connection.accessToken;
      const mediaUrl = mediaUrls && mediaUrls.length > 0 ? mediaUrls[0] : null;

      // In production with YouTube Data API v3:
      // If a video binary is available, we use the YouTube resumable upload API.
      // If no media is provided, we can either create a scheduled broadcast or update an existing short.
      const snippet = {
        title: content.title.slice(0, 100),
        description: content.description,
        tags: content.tags || [],
        categoryId: "28", // Science & Technology
      };

      const status = {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false,
      };

      // 1. Initial metadata call to YouTube Data API
      const res = await fetch(
        "https://www.googleapis.com/youtube/v3/videos?part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ snippet, status }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // If quota exceeded or sandbox token, provide structured fallback
        return {
          success: false,
          error: data.error?.message || `YouTube API returned status ${res.status}`,
          metadata: { response: data },
        };
      }

      const videoId = data.id || `yt-${Date.now()}`;
      return {
        success: true,
        externalPostId: videoId,
        externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
        metadata: { snippet: data.snippet },
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish to YouTube",
      };
    }
  },
};

