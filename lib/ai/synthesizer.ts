import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { Platform, AiProvider } from "../types";
import { prisma } from "../prisma";
import { decryptSecret } from "../security/vault";
import { buildChannelUtmMap } from "./utm";
import {
  CanonicalMarketingPayload,
  CanonicalMarketingPayloadSchema,
} from "./types";

export interface SynthesisRequest {
  seedTopic: string;
  targetLandingUrl: string;
  brandVoice?: "authoritative" | "conversational" | "high-energy" | "technical" | "concise" | "storytelling";
  targetPlatforms: Platform[];
  workspaceId?: string;
  preferredProvider?: AiProvider;
  customInstructions?: string;
}

export interface SynthesisResult {
  payload: CanonicalMarketingPayload;
  utmUrls: Record<Platform, string>;
  modelUsed: string;
  providerUsed: AiProvider;
}

/**
 * Resolves the appropriate AI model based on Workspace BYOK settings or server environment defaults.
 */
async function resolveAiModel(
  workspaceId?: string,
  preferredProvider: AiProvider = AiProvider.GOOGLE_AI
) {
  let apiKey: string | undefined;

  // 1. Check Workspace BYOK in Database
  if (workspaceId) {
    try {
      const storedKey = await prisma.workspaceApiKey.findUnique({
        where: {
          workspaceId_provider: {
            workspaceId,
            provider: preferredProvider,
          },
        },
      });

      if (storedKey) {
        apiKey = decryptSecret(storedKey.encryptedKey, storedKey.iv, storedKey.tag);
      }
    } catch (dbError) {
      console.warn("Could not query workspace BYOK key, falling back to server env:", dbError);
    }
  }

  // 2. Fallback to Environment Variables
  if (!apiKey) {
    switch (preferredProvider) {
      case AiProvider.OPENAI:
        apiKey = process.env.OPENAI_API_KEY;
        break;
      case AiProvider.ANTHROPIC:
        apiKey = process.env.ANTHROPIC_API_KEY;
        break;
      case AiProvider.GOOGLE_AI:
      default:
        apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        break;
    }
  }

  // 3. Fallback cascade if preferred provider key is missing
  if (!apiKey) {
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      preferredProvider = AiProvider.GOOGLE_AI;
      apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    } else if (process.env.OPENAI_API_KEY) {
      preferredProvider = AiProvider.OPENAI;
      apiKey = process.env.OPENAI_API_KEY;
    } else if (process.env.ANTHROPIC_API_KEY) {
      preferredProvider = AiProvider.ANTHROPIC;
      apiKey = process.env.ANTHROPIC_API_KEY;
    } else {
      throw new Error(
        "NO_AI_API_KEY: Please configure an AI API Key in Workspace BYOK Settings or set GOOGLE_GENERATIVE_AI_API_KEY / OPENAI_API_KEY in .env."
      );
    }
  }

  // 4. Instantiate provider client
  switch (preferredProvider) {
    case AiProvider.OPENAI: {
      const openai = createOpenAI({ apiKey });
      return {
        model: openai("gpt-4o"),
        modelName: "gpt-4o",
        provider: AiProvider.OPENAI,
      };
    }
    case AiProvider.ANTHROPIC: {
      const anthropic = createAnthropic({ apiKey });
      return {
        model: anthropic("claude-3-5-sonnet-20241022"),
        modelName: "claude-3-5-sonnet-20241022",
        provider: AiProvider.ANTHROPIC,
      };
    }
    case AiProvider.GOOGLE_AI:
    default: {
      const google = createGoogleGenerativeAI({ apiKey });
      return {
        model: google("gemini-2.0-flash"),
        modelName: "gemini-2.0-flash",
        provider: AiProvider.GOOGLE_AI,
      };
    }
  }
}

/**
 * Executes the Single-Source Canonical LLM Synthesis pipeline.
 * Takes a seed topic, derives platform-specific UTM links, and synthesizes tailored marketing copy for all selected channels.
 */
export async function synthesizeMarketingContent(
  request: SynthesisRequest
): Promise<SynthesisResult> {
  const {
    seedTopic,
    targetLandingUrl,
    brandVoice = "authoritative",
    targetPlatforms,
    workspaceId,
    preferredProvider = AiProvider.GOOGLE_AI,
    customInstructions,
  } = request;

  // 1. Generate guaranteed trackable UTM URLs for each channel
  const utmUrls = buildChannelUtmMap(targetLandingUrl, targetPlatforms, seedTopic);

  // 2. Resolve AI model (BYOK or default)
  const { model, modelName, provider } = await resolveAiModel(workspaceId, preferredProvider);

  // 3. Construct platform guidance & prompt
  const utmGuidance = targetPlatforms
    .map((p) => `- ${p}: Target URL with trackable UTM: ${utmUrls[p]}`)
    .join("\n");

  const prompt = `
You are an elite Growth Hacker, Conversion Copywriter, and Viral Content Strategist.
Your goal is to synthesize the following seed topic into native, high-converting content for each requested marketing platform.

Seed Topic / Source Input:
"""
${seedTopic}
"""

Base Landing Page: ${targetLandingUrl}
Brand Voice Profile: ${brandVoice.toUpperCase()}
${customInstructions ? `Custom Instructions: ${customInstructions}` : ""}

REQUIRED PLATFORM UTM TRACKING URLS (YOU MUST USE THESE EXACT URLS IN EACH RESPECTIVE PLATFORM COPY):
${utmGuidance}

PLATFORM INSTRUCTIONS:
1. YouTube: High-CTR title (<=100 chars), rich description with the exact YouTube UTM link in the FIRST TWO LINES, and 5-15 tags.
2. WhatsApp: Engaging broadcast update with emojis and bullet points, urgency CTA button text, and the WhatsApp UTM link.
3. Telegram: HTML formatted message (<b>, <i>, <a>, <code>), inline button label, and Telegram UTM link.
4. Pinterest: Visual search title (<=100 chars), benefit-dense description (<=500 chars), and Pinterest destination UTM link.
5. Reddit: Authentic, value-first non-promotional post with markdown body and contextual natural backlink. Recommend a niche target subreddit.
6. Threads: Snappy, conversation-starting post (<=500 chars) with Threads UTM link.
7. Twitter/X: Multi-tweet sequence (1-5 tweets, each <=280 chars). Hook in Tweet 1, value delivery, and UTM conversion CTA in the final tweet.
8. LinkedIn: Thought-leadership post with 2-line hook before "see more" fold, actionable insights, and 3-5 B2B hashtags.
9. Instagram: High-engagement caption with call to check link-in-bio, plus separate hashtag list for first comment.
10. Dev.to: Technical breakdown/case-study in markdown, technical tags, and canonicalUrl pointing to ${targetLandingUrl}.
11. Discord: Rich webhook embed with title, description markdown, hex color integer, and clickable CTA URL.

Only generate content for the requested platforms: ${targetPlatforms.join(", ")}.
`;

  // 4. Generate structured object via Vercel AI SDK
  const { object } = await generateObject({
    model,
    schema: CanonicalMarketingPayloadSchema,
    prompt,
    system:
      "You are SmartLabs Marketing Engine's autonomous content synthesizer. Always produce high-converting, human-grade marketing content tailored to platform algorithms and human psychology. Never sound robotic or generic.",
  });

  // 5. Post-process to guarantee UTM URLs are strictly populated
  const payload = { ...object };

  if (payload.whatsapp && !payload.whatsapp.ctaUrl) {
    payload.whatsapp.ctaUrl = utmUrls.WHATSAPP || targetLandingUrl;
  }
  if (payload.telegram && !payload.telegram.buttonUrl) {
    payload.telegram.buttonUrl = utmUrls.TELEGRAM || targetLandingUrl;
  }
  if (payload.pinterest && !payload.pinterest.destinationUrl) {
    payload.pinterest.destinationUrl = utmUrls.PINTEREST || targetLandingUrl;
  }
  if (payload.devto && !payload.devto.canonicalUrl) {
    payload.devto.canonicalUrl = targetLandingUrl;
  }
  if (payload.discord && !payload.discord.ctaUrl) {
    payload.discord.ctaUrl = utmUrls.DISCORD || targetLandingUrl;
  }

  return {
    payload,
    utmUrls,
    modelUsed: modelName,
    providerUsed: provider,
  };
}

