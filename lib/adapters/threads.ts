import { Platform } from "@prisma/client";
import { ChannelAdapter, DecryptedConnection, PublishResult } from "./types";
import { ThreadsContent } from "../ai/types";

export const threadsAdapter: ChannelAdapter<ThreadsContent> = {
  platform: Platform.THREADS,

  async publish(
    connection: DecryptedConnection,
    content: ThreadsContent
  ): Promise<PublishResult> {
    try {
      const accessToken = connection.accessToken;

      // 1. Create Media Container
      const createRes = await fetch("https://graph.threads.net/v1.0/me/threads", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          media_type: "TEXT",
          text: content.text.slice(0, 500),
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData.id) {
        return {
          success: false,
          error: createData.error?.message || "Failed to create Threads container",
          metadata: createData,
        };
      }

      const creationId = createData.id;

      // 2. Publish Container
      const publishRes = await fetch("https://graph.threads.net/v1.0/me/threads_publish", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: creationId,
        }),
      });

      const publishData = await publishRes.json();

      if (!publishRes.ok || !publishData.id) {
        return {
          success: false,
          error: publishData.error?.message || "Failed to publish Threads post container",
          metadata: publishData,
        };
      }

      const threadId = publishData.id;
      return {
        success: true,
        externalPostId: threadId,
        externalUrl: `https://www.threads.net/post/${threadId}`,
        metadata: publishData,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to publish to Threads",
      };
    }
  },
};
