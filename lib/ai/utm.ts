import { Platform } from "../types";

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

/**
 * Standardized medium mapping by platform to guarantee high-converting attribution in Google Analytics / PostHog / Mixpanel.
 */
export const PLATFORM_DEFAULT_MEDIUM: Record<Platform, string> = {
  YOUTUBE: "video_organic",
  WHATSAPP: "broadcast_chat",
  TELEGRAM: "broadcast_chat",
  PINTEREST: "social_pinner",
  REDDIT: "community_discussion",
  THREADS: "social_microblog",
  TWITTER: "social_microblog",
  LINKEDIN: "social_b2b",
  INSTAGRAM: "social_bio",
  DEVTO: "developer_syndication",
  DISCORD: "community_chat",
};

/**
 * Normalizes any text/topic into a clean URL-friendly campaign slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

/**
 * Builds a UTM-tagged tracking URL for a specific distribution channel.
 * Gracefully preserves existing URL queries and hash fragments.
 */
export function buildUtmUrl(
  baseUrl: string,
  platform: Platform,
  campaignTopic: string,
  contentSnippet?: string
): string {
  try {
    const parsed = new URL(baseUrl);
    const campaignSlug = slugify(campaignTopic) || "daily-marketing-blast";
    const medium = PLATFORM_DEFAULT_MEDIUM[platform] || "social_organic";
    const source = platform.toLowerCase();

    parsed.searchParams.set("utm_source", source);
    parsed.searchParams.set("utm_medium", medium);
    parsed.searchParams.set("utm_campaign", campaignSlug);

    if (contentSnippet) {
      const contentSlug = slugify(contentSnippet).slice(0, 30);
      if (contentSlug) {
        parsed.searchParams.set("utm_content", contentSlug);
      }
    }

    return parsed.toString();
  } catch {
    // If baseUrl is invalid or relative, prepend https:// or return as is with query string
    const fallbackBase = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    try {
      const parsed = new URL(fallbackBase);
      const campaignSlug = slugify(campaignTopic) || "daily-marketing-blast";
      parsed.searchParams.set("utm_source", platform.toLowerCase());
      parsed.searchParams.set("utm_medium", PLATFORM_DEFAULT_MEDIUM[platform] || "social_organic");
      parsed.searchParams.set("utm_campaign", campaignSlug);
      return parsed.toString();
    } catch {
      return baseUrl;
    }
  }
}

/**
 * Generates all UTM URLs for an array of platforms simultaneously.
 */
export function buildChannelUtmMap(
  baseUrl: string,
  platforms: Platform[],
  campaignTopic: string
): Record<Platform, string> {
  const result = {} as Record<Platform, string>;
  for (const p of platforms) {
    result[p] = buildUtmUrl(baseUrl, p, campaignTopic);
  }
  return result;
}

