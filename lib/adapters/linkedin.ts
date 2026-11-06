import { Platform } from "@prisma/client";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { LinkedinContent } from "../ai/types";

export const linkedinAdapter: ChannelAdapter<LinkedinContent> = {
  platform: Platform.LINKEDIN,

  async publish(
    connection: DecryptedConnection,
    content: LinkedinContent
  ): Promise<PublishResult> {
    try {
      const accessToken = connection.accessToken;
      const authorUrn =
        connection.parsedMetadata.authorUrn ||
        (connection.parsedMetadata.organizationId
          ? `urn:li:organization:${connection.parsedMetadata.organizationId}`
          : connection.parsedMetadata.personUrn);

      if (!authorUrn) {
        return {
          success: false,
          error: "LinkedIn authorUrn or organizationId is required in channel metadata.",
        };
      }

      const formattedHashtags = (content.hashtags || [])
        .map((t) => (t.startsWith("#") ? t : `#${t}`))
        .join(" ");

      const fullText = `${content.postBody}\n\n${formattedHashtags}`.trim();

      const payload = {
        author: authorUrn,
        commentary: fullText,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      };

      const res = await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202401",
        },
        body: JSON.stringify(payload),
      });

      const postId = res.headers.get("x-restli-id") || `li-${Date.now()}`;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `LinkedIn API error ${res.status}`,
          metadata: errorData,
        };
      }

      return {
        success: true,
        externalPostId: postId,
        externalUrl: `https://www.linkedin.com/feed/update/${postId}/`,
        metadata: { authorUrn },
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish to LinkedIn",
      };
    }
  },
};
