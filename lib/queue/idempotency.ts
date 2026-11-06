import crypto from "crypto";
import { prisma } from "../prisma";
import { Platform } from "../types";

/**
 * Generates a unique, deterministic idempotency key for a campaign run per day.
 * Format: workspaceId:YYYY-MM-DD:hash(topic)
 */
export function generateCampaignIdempotencyKey(
  workspaceId: string,
  topic: string,
  date: Date = new Date()
): string {
  const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
  const topicHash = crypto
    .createHash("sha256")
    .update(topic.trim().toLowerCase())
    .digest("hex")
    .slice(0, 16);

  return `${workspaceId}:${dateStr}:${topicHash}`;
}

/**
 * Generates an idempotency key for an individual channel dispatch.
 */
export function generateChannelIdempotencyKey(
  campaignRunId: string,
  channel: Platform
): string {
  return `${campaignRunId}:${channel}`;
}

/**
 * Checks if a channel dispatch has already succeeded or is currently being executed.
 */
export async function isChannelAlreadyDispatched(
  campaignRunId: string,
  channel: Platform
): Promise<boolean> {
  const existingLog = await prisma.publishLog.findFirst({
    where: {
      campaignRunId,
      channel,
      status: "SUCCESS",
    },
  });

  return !!existingLog;
}

