import { Platform } from "@prisma/client";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { RedditContent } from "../ai/types";

export const redditAdapter: ChannelAdapter<RedditContent> = {
  platform: Platform.REDDIT,

  async publish(
    connection: DecryptedConnection,
    content: RedditContent
  ): Promise<PublishResult> {
    try {
      const accessToken = connection.accessToken;
      const targetSubreddit =
        content.targetSubreddit.replace(/^r\//, "") ||
        connection.parsedMetadata.defaultSubreddit ||
        "saas";

      const formData = new URLSearchParams();
      formData.append("sr", targetSubreddit);
      formData.append("kind", "self");
      formData.append("title", content.title);
      formData.append("text", content.markdownBody);
      formData.append("api_type", "json");

      const res = await fetch("https://oauth.reddit.com/api/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "SmartLabsMarketingEngine/1.0.0 (by /u/SmartLabsMarketing)",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await res.json();

      if (!res.ok || data.json?.errors?.length > 0) {
        const errorMsg =
          data.json?.errors?.[0]?.[1] ||
          data.message ||
          `Reddit submission failed with status ${res.status}`;
        return {
          success: false,
          error: errorMsg,
          metadata: data,
        };
      }

      const postUrl = data.json?.data?.url || `https://reddit.com/r/${targetSubreddit}`;
      const postId = data.json?.data?.id || `reddit-${Date.now()}`;

      return {
        success: true,
        externalPostId: postId,
        externalUrl: postUrl,
        metadata: data.json?.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to submit post to Reddit",
      };
    }
  },
};
