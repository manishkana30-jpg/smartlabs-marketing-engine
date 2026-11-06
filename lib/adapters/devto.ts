import { Platform } from "../types";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { DevtoContent } from "../ai/types";

export const devtoAdapter: ChannelAdapter<DevtoContent> = {
  platform: Platform.DEVTO,

  async publish(
    connection: DecryptedConnection,
    content: DevtoContent
  ): Promise<PublishResult> {
    try {
      const apiKey = connection.accessToken;

      const payload = {
        article: {
          title: content.title.slice(0, 120),
          body_markdown: content.markdownBody,
          tags: (content.tags || []).slice(0, 4).map((t) => t.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()),
          canonical_url: content.canonicalUrl,
          published: true,
        },
      };

      const res = await fetch("https://dev.to/api/articles", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          "User-Agent": "SmartLabsMarketingEngine/1.0.0",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        return {
          success: false,
          error: data.error || `Dev.to API error: ${res.status}`,
          metadata: data,
        };
      }

      return {
        success: true,
        externalPostId: String(data.id),
        externalUrl: data.url || `https://dev.to/article/${data.id}`,
        metadata: { slug: data.slug, path: data.path },
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish article to Dev.to",
      };
    }
  },
};

