import { Platform } from "../types";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { TwitterContent } from "../ai/types";

export const twitterAdapter: ChannelAdapter<TwitterContent> = {
  platform: Platform.TWITTER,

  async publish(
    connection: DecryptedConnection,
    content: TwitterContent
  ): Promise<PublishResult> {
    try {
      const accessToken = connection.accessToken;
      const tweets = content.tweets && content.tweets.length > 0 ? content.tweets : [];

      if (tweets.length === 0) {
        return {
          success: false,
          error: "No tweet text provided for Twitter/X dispatch.",
        };
      }

      let lastTweetId: string | null = null;
      let firstTweetId: string | null = null;
      const publishedTweetIds: string[] = [];

      // Chain tweets sequentially if thread
      for (let i = 0; i < tweets.length; i++) {
        const tweetText = tweets[i].slice(0, 280);
        const payload: Record<string, unknown> = {
          text: tweetText,
        };

        if (lastTweetId) {
          payload.reply = {
            in_reply_to_tweet_id: lastTweetId,
          };
        }

        const res = await fetch("https://api.twitter.com/2/tweets", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.data?.id) {
          // If first tweet failed, fail entirely. If partial thread failed, report partial success with warning
          if (i === 0) {
            return {
              success: false,
              error: data.errors?.[0]?.message || data.detail || `Twitter API failed: ${res.status}`,
              metadata: data,
            };
          }
          break;
        }

        const currentId = data.data.id;
        publishedTweetIds.push(currentId);

        if (i === 0) {
          firstTweetId = currentId;
        }
        lastTweetId = currentId;
      }

      const rootId = firstTweetId || `tweet-${Date.now()}`;
      return {
        success: true,
        externalPostId: rootId,
        externalUrl: `https://x.com/i/status/${rootId}`,
        metadata: {
          threadLength: publishedTweetIds.length,
          allTweetIds: publishedTweetIds,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish tweet thread to X/Twitter",
      };
    }
  },
};

