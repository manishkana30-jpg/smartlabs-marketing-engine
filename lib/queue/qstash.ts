import { Client, Receiver } from "@upstash/qstash";
import { Platform } from "@prisma/client";

export interface ChannelDispatchJob {
  campaignRunId: string;
  channelConnectionId: string;
  channel: Platform;
  workspaceId: string;
  retryCount?: number;
}

const qstashToken = process.env.QSTASH_TOKEN;
const hasValidQStash =
  Boolean(qstashToken) &&
  !qstashToken?.includes("placeholder") &&
  qstashToken?.length! > 10;

export const qstashClient = hasValidQStash
  ? new Client({ token: qstashToken! })
  : null;

/**
 * Enqueues a single-channel dispatch job to QStash queue with built-in retries.
 * Falls back to direct HTTP trigger if QStash credentials are not yet configured.
 */
export async function enqueueChannelDispatch(
  job: ChannelDispatchJob,
  delaySeconds: number = 0
): Promise<{ enqueued: boolean; messageId?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const destinationUrl = `${appUrl}/api/queue/dispatch-channel`;

  if (qstashClient) {
    try {
      const response = await qstashClient.publishJSON({
        url: destinationUrl,
        body: job,
        delay: delaySeconds,
        retries: 3,
        headers: {
          "x-cron-secret": process.env.CRON_SECRET || "",
        },
      });

      return { enqueued: true, messageId: response.messageId };
    } catch (err) {
      console.error("QStash enqueue error, falling back to direct HTTP:", err);
    }
  }

  // Fallback for development environments without active QStash
  fetch(destinationUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cron-secret": process.env.CRON_SECRET || "",
    },
    body: JSON.stringify(job),
  }).catch((err) => {
    console.error("Local async dispatch failed:", err);
  });

  return { enqueued: true, messageId: `local-${Date.now()}` };
}

/**
 * Validates QStash incoming webhook signature if receiver keys are present.
 */
export async function verifyQStashSignature(
  signature: string | null,
  bodyText: string
): Promise<boolean> {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey || currentKey.includes("placeholder")) {
    return true; // Bypass in dev when keys are unconfigured
  }

  if (!signature) {
    return false;
  }

  try {
    const receiver = new Receiver({
      currentSigningKey: currentKey,
      nextSigningKey: nextKey || currentKey,
    });

    await receiver.verify({
      signature,
      body: bodyText,
    });

    return true;
  } catch (err) {
    console.warn("QStash signature verification failed:", err);
    return false;
  }
}
