import { z } from "zod";

export const YoutubeContentSchema = z.object({
  title: z
    .string()
    .max(100, "YouTube title must be 100 characters or less")
    .describe("Catchy, high-CTR YouTube title optimized for search and shorts"),
  description: z
    .string()
    .describe(
      "YouTube description with the UTM destination link placed explicitly in the first 2 lines"
    ),
  tags: z
    .array(z.string())
    .max(15)
    .describe("5-15 relevant SEO and algorithm tags"),
});

export const WhatsappContentSchema = z.object({
  messageText: z
    .string()
    .describe("Engaging broadcast update with emojis and bullet points for WhatsApp channels"),
  ctaButtonText: z
    .string()
    .max(25, "Button text must be 25 chars or less")
    .describe("Urgent, high-converting call to action button label (e.g., 'Claim Free Access')"),
  ctaUrl: z
    .string()
    .url()
    .describe("Destination landing page with WhatsApp-specific UTM tracking"),
});

export const TelegramContentSchema = z.object({
  htmlMessage: z
    .string()
    .describe(
      "Telegram message body formatted with supported HTML tags (<b>, <i>, <a>, <code>, <blockquote>)"
    ),
  buttonText: z
    .string()
    .max(30)
    .describe("Action-driven inline keyboard button label"),
  buttonUrl: z
    .string()
    .url()
    .describe("Destination landing page with Telegram-specific UTM tracking"),
});

export const PinterestContentSchema = z.object({
  title: z
    .string()
    .max(100, "Pinterest title must be 100 characters or less")
    .describe("Search-optimized, aesthetic Pin title"),
  description: z
    .string()
    .max(500, "Pinterest description must be 500 characters or less")
    .describe("Keyword-dense Pin description highlighting benefits and evergreen solution"),
  destinationUrl: z
    .string()
    .url()
    .describe("Direct Pin click-through URL with Pinterest UTM tracking"),
});

export const RedditContentSchema = z.object({
  title: z
    .string()
    .max(300)
    .describe("Authentic, value-first non-promotional Reddit headline"),
  markdownBody: z
    .string()
    .describe(
      "Detailed, high-value Reddit discussion body formatted in markdown with a natural backlink"
    ),
  targetSubreddit: z
    .string()
    .describe("Suggested niche subreddit without 'r/' prefix (e.g. 'saas', 'webdev', 'marketing')"),
});

export const ThreadsContentSchema = z.object({
  text: z
    .string()
    .max(500, "Threads post must be 500 characters or less")
    .describe("Conversational, punchy micro-post optimized for Meta Threads algorithmic feed with UTM link"),
});

export const TwitterContentSchema = z.object({
  isThread: z
    .boolean()
    .describe("Whether the output is a multi-tweet thread or a single high-impact standalone tweet"),
  tweets: z
    .array(
      z.string().max(280, "Each tweet must be 280 characters or fewer")
    )
    .min(1)
    .max(7)
    .describe(
      "Array of sequential tweets. The first tweet hooks attention, while the final tweet delivers the conversion CTA with the UTM link."
    ),
});

export const LinkedinContentSchema = z.object({
  postBody: z
    .string()
    .describe(
      "Thought leadership post with a strong 2-line hook before the 'see more' cutoff, spacing, and conversion CTA"
    ),
  hashtags: z
    .array(z.string())
    .max(5)
    .describe("3 to 5 targeted B2B hashtags"),
});

export const InstagramContentSchema = z.object({
  caption: z
    .string()
    .describe("Visual storytelling caption with clear prompt to tap link-in-bio or save post"),
  firstCommentHashtags: z
    .string()
    .describe("Comma or space-separated hashtags meant for the first comment to keep caption clean"),
});

export const DevtoContentSchema = z.object({
  title: z
    .string()
    .max(120)
    .describe("Technical tutorial, architecture, or deep-dive article title"),
  markdownBody: z
    .string()
    .describe(
      "Full markdown article with code snippets, architecture breakdown, and contextual backlinks"
    ),
  tags: z
    .array(z.string())
    .max(4)
    .describe("Up to 4 dev.to tags (e.g. 'javascript', 'webdev', 'ai', 'productivity')"),
  canonicalUrl: z
    .string()
    .url()
    .describe("Canonical URL pointing back to original company domain for SEO preservation"),
});

export const DiscordContentSchema = z.object({
  embedTitle: z
    .string()
    .max(256)
    .describe("Title for the Discord webhook rich embed"),
  embedDescription: z
    .string()
    .max(2048)
    .describe("Markdown-formatted announcement for Discord community channels"),
  embedColor: z
    .number()
    .int()
    .describe("Hex color code as integer (e.g. 0x5865F2 for Discord Blurple, 0x10B981 for Emerald)"),
  ctaUrl: z
    .string()
    .url()
    .describe("Direct click-through link for the embed button"),
});

/**
 * Master canonical payload schema containing all platform outputs.
 */
export const CanonicalMarketingPayloadSchema = z.object({
  campaignSummary: z
    .string()
    .describe("Executive summary of this campaign run and core angle"),
  youtube: YoutubeContentSchema.optional(),
  whatsapp: WhatsappContentSchema.optional(),
  telegram: TelegramContentSchema.optional(),
  pinterest: PinterestContentSchema.optional(),
  reddit: RedditContentSchema.optional(),
  threads: ThreadsContentSchema.optional(),
  twitter: TwitterContentSchema.optional(),
  linkedin: LinkedinContentSchema.optional(),
  instagram: InstagramContentSchema.optional(),
  devto: DevtoContentSchema.optional(),
  discord: DiscordContentSchema.optional(),
});

export type CanonicalMarketingPayload = z.infer<typeof CanonicalMarketingPayloadSchema>;
export type YoutubeContent = z.infer<typeof YoutubeContentSchema>;
export type WhatsappContent = z.infer<typeof WhatsappContentSchema>;
export type TelegramContent = z.infer<typeof TelegramContentSchema>;
export type PinterestContent = z.infer<typeof PinterestContentSchema>;
export type RedditContent = z.infer<typeof RedditContentSchema>;
export type ThreadsContent = z.infer<typeof ThreadsContentSchema>;
export type TwitterContent = z.infer<typeof TwitterContentSchema>;
export type LinkedinContent = z.infer<typeof LinkedinContentSchema>;
export type InstagramContent = z.infer<typeof InstagramContentSchema>;
export type DevtoContent = z.infer<typeof DevtoContentSchema>;
export type DiscordContent = z.infer<typeof DiscordContentSchema>;

