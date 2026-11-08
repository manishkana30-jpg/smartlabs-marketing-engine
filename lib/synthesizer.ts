import { buildChannelUtmMap, buildUtmUrl, slugify } from "./ai/utm";
import {
  CanonicalMarketingPayload,
  YoutubeContent,
  WhatsappContent,
  TelegramContent,
  PinterestContent,
  RedditContent,
  ThreadsContent,
  TwitterContent,
  LinkedinContent,
  InstagramContent,
  DevtoContent,
  DiscordContent,
} from "./ai/types";

export type TonePreset =
  | "growth-hacker"
  | "technical-founder"
  | "storyteller"
  | "high-energy";

export interface SynthesisOptions {
  seedTopic: string;
  targetLandingUrl: string;
  tone?: TonePreset;
  workspaceId?: string;
}

/**
 * Extracts key phrases, main concept, and action words from raw seed input.
 */
function analyzeTopic(seed: string) {
  const clean = seed.trim();
  const firstSentence = clean.split(/[.?!]/)[0] || clean;
  const words = clean.split(/\s+/);
  const keywords = words
    .filter((w) => w.length > 4 && !/^(about|which|their|there|would|could|should|these|those)/i.test(w))
    .slice(0, 8);

  return {
    raw: clean,
    headline: firstSentence.slice(0, 90),
    keywords: keywords.length > 0 ? keywords : ["growth", "automation", "tech", "scale"],
  };
}

/**
 * High-performance, zero-key algorithmic marketing synthesizer.
 * Crafts tailored, algorithm-optimized copy with exact UTM attribution across 11 platforms.
 */
export function synthesizeKeylessMarketingContent(
  options: SynthesisOptions
): CanonicalMarketingPayload {
  const { seedTopic, targetLandingUrl, tone = "growth-hacker" } = options;
  const analysis = analyzeTopic(seedTopic);
  const campaignSlug = slugify(seedTopic).slice(0, 40) || "marketing-engine";

  // Calculate platform UTM URLs
  const ytUtm = buildUtmUrl(targetLandingUrl, "YOUTUBE" as any, campaignSlug);
  const waUtm = buildUtmUrl(targetLandingUrl, "WHATSAPP" as any, campaignSlug);
  const tgUtm = buildUtmUrl(targetLandingUrl, "TELEGRAM" as any, campaignSlug);
  const pinUtm = buildUtmUrl(targetLandingUrl, "PINTEREST" as any, campaignSlug);
  const redUtm = buildUtmUrl(targetLandingUrl, "REDDIT" as any, campaignSlug);
  const thUtm = buildUtmUrl(targetLandingUrl, "THREADS" as any, campaignSlug);
  const twUtm = buildUtmUrl(targetLandingUrl, "TWITTER" as any, campaignSlug);
  const liUtm = buildUtmUrl(targetLandingUrl, "LINKEDIN" as any, campaignSlug);
  const igUtm = buildUtmUrl(targetLandingUrl, "INSTAGRAM" as any, campaignSlug);
  const devUtm = buildUtmUrl(targetLandingUrl, "DEVTO" as any, campaignSlug);
  const discUtm = buildUtmUrl(targetLandingUrl, "DISCORD" as any, campaignSlug);

  // Tone-specific hook templates
  const toneHeaders = {
    "growth-hacker": {
      yt: "How to 10x Your Distribution Using",
      xHook: "Most founders spend 95% of their time building and 5% marketing. That's why products die.",
      liHook: "The hardest part of SaaS isn't coding the backend.\nIt's consistent distribution without burning out.",
      redTitle: "Case study: How we automated multi-channel traffic with zero ad budget",
      waAction: "Unlock Growth Playbook",
    },
    "technical-founder": {
      yt: "Deep Dive Architecture:",
      xHook: "We open-sourced our distributed marketing engine architecture. Built with Next.js 15 & serverless DAG pipelines 🧵👇",
      liHook: "Why we abandoned bloated Zapier workflows and wrote a native Single-Source Content Engine with zero server idle cost.",
      redTitle: "Technical breakdown: Building a 24/7 serverless autonomous content engine",
      waAction: "Read Architecture",
    },
    "storyteller": {
      yt: "The Honest Story Behind Our New",
      xHook: "6 months ago, we almost shut down our project due to lack of visibility. Here is what changed everything 🧵",
      liHook: "In 2024, if you don't build a distribution engine while building your product, you're building a ghost ship.",
      redTitle: "What we learned after failing at marketing for 12 months (and how we fixed it)",
      waAction: "See What's New",
    },
    "high-energy": {
      yt: "HUGE UPDATE: Introducing",
      xHook: "🚀 IT'S FINALLY HERE! We just launched the ultimate autonomous traffic acquisition machine 🧵👇",
      liHook: "Today is a monumental milestone for our team. We are officially releasing our Autonomous Marketing Engine to the public!",
      redTitle: "We built an autonomous content engine that runs 24/7 in the cloud — live demo inside",
      waAction: "Claim Free Access",
    },
  }[tone];

  // 1. YouTube Payload
  const youtube: YoutubeContent = {
    title: `${toneHeaders.yt} ${analysis.headline}`.slice(0, 98),
    description: `👉 Official Link & Live Demo: ${ytUtm}\n\n${seedTopic}\n\n📌 Timestamps:\n0:00 - The Distribution Problem\n1:45 - Single-Source Synthesis\n4:12 - Autonomous Multi-Channel Dispatch\n8:30 - Live Demo & UTM Analytics\n\nScale your organic traffic 24/7 on autopilot.`,
    tags: [
      ...analysis.keywords.map((k) => k.toLowerCase()),
      "marketingengine",
      "saasgrowth",
      "automation",
      "nextjs",
    ].slice(0, 10),
  };

  // 2. WhatsApp Channel Broadcast
  const whatsapp: WhatsappContent = {
    messageText: `📢 *SMARTLABS RELEASE UPDATE*\n\n${seedTopic}\n\n*Key Highlights:*\n• ⚡ Single-source synthesis across 11 platforms\n• 🛡️ Zero idle server cost with serverless queues\n• 📊 Automated trackable UTM referral attribution\n\nTap below to see the interactive live platform:`,
    ctaButtonText: toneHeaders.waAction,
    ctaUrl: waUtm,
  };

  // 3. Telegram Channel Broadcast
  const telegram: TelegramContent = {
    htmlMessage: `⚡ <b>SmartLabs Broadcast: ${analysis.headline}</b>\n\n${seedTopic}\n\n<blockquote>Turn 1 product update into 11 channel-specific viral posts with trackable UTM attribution. Zero server maintenance.</blockquote>\n\n<code>Status: 24/7 Autonomous Cloud Active</code>`,
    buttonText: "Launch Engine Now →",
    buttonUrl: tgUtm,
  };

  // 4. Pinterest Pin
  const pinterest: PinterestContent = {
    title: `${analysis.headline} | SmartLabs Architecture`.slice(0, 100),
    description: `${seedTopic}. Discover how to automate multi-channel organic traffic acquisition with visual DAG workflows and single-source AI synthesis.`.slice(
      0,
      495
    ),
    destinationUrl: pinUtm,
  };

  // 5. Reddit Community Discussion
  const reddit: RedditContent = {
    title: `${toneHeaders.redTitle}: ${analysis.headline}`,
    markdownBody: `Hey r/saas,\n\nWe recently ran into a massive wall: as developers, we love shipping features, but keeping up with marketing across Twitter, LinkedIn, YouTube, and Dev.to is exhausting.\n\nSo we built an autonomous engine: **${seedTopic}**.\n\n### How it works:\n1. Input one single seed topic or release note.\n2. Formats and validates native copy for every platform.\n3. Embeds distinct UTM parameters to track high-converting referral channels.\n\nWould love your feedback on our architecture: [Check out the live engine here](${redUtm}).\n\nWhat does your current content distribution stack look like?`,
    targetSubreddit: "saas",
  };

  // 6. Meta Threads
  const threads: ThreadsContent = {
    text: `${analysis.headline}.\n\n${seedTopic.slice(0, 240)}...\n\nExplore the interactive workflow: ${thUtm}`.slice(
      0,
      498
    ),
  };

  // 7. X / Twitter 4-Tweet Thread
  const twitter: TwitterContent = {
    isThread: true,
    tweets: [
      `${toneHeaders.xHook}\n\nHere is how we turned one seed topic into a 24/7 organic traffic machine 🧵👇`,
      `1/3 The bottleneck: Creating custom copy for 10+ platforms by hand takes hours every day.\n\nWith SmartLabs Marketing Engine, you write once. The engine adapts tone, formatting, and media hooks automatically.`,
      `2/3 Every link carries clean UTM attribution:\n• Source: Twitter\n• Medium: Social Microblog\n• Campaign: ${campaignSlug}\n\nTrack every single conversion back to the exact tweet that drove it.`,
      `3/3 Try the visual DAG canvas and instant studio generator here: ${twUtm}`,
    ].map((t) => (t.length > 280 ? t.slice(0, 277) + "..." : t)),
  };

  // 8. LinkedIn Thought Leadership Post
  const linkedin: LinkedinContent = {
    postBody: `${toneHeaders.liHook}\n\n${seedTopic}\n\nHere are 3 fundamental shifts happening in modern marketing distribution:\n\n1. Single-Source Synthesis > Manual Multi-Posting\n2. Channel-Native Formatting (Respecting algorithms rather than blasting links)\n3. Deterministic UTM Attribution (Knowing exact acquisition channels)\n\nWe built SmartLabs Marketing Engine to make organic distribution completely autonomous for founders and growth teams.\n\nExplore how to scale your traffic engine: ${liUtm}`,
    hashtags: ["#ProductMarketing", "#GrowthEngineering", "#SaaS", "#B2BMarketing", "#AIAutomation"],
  };

  // 9. Instagram Feed Caption
  const instagram: InstagramContent = {
    caption: `Scale your SaaS distribution on autopilot 🚀.\n\n${seedTopic}\n\nTurn 1 update into 11 channel-ready posts with zero manual copy-pasting.\n\n👉 Tap the link in bio to try the interactive studio!`,
    firstCommentHashtags: `#saas #growthhacking #marketingautomation #fullstack #nextjs #buildinpublic #solofounder #growth`,
  };

  // 10. Dev.to Technical Article
  const devto: DevtoContent = {
    title: `Architecting a 24/7 Autonomous Marketing Engine: ${analysis.headline}`.slice(0, 118),
    markdownBody: `# Architecting a 24/7 Autonomous Marketing Engine\n\nIn modern software engineering, shipping code is only half the battle. Distribution is the true multiplier.\n\n> "${seedTopic}"\n\n## The Architecture\n- **Next.js 15 App Router:** Server Actions and Route Handlers for high-throughput webhook processing.\n- **Algorithmic & Vercel AI SDK Synthesizer:** Deterministic structured output engine.\n- **Upstash QStash:** 24/7 serverless queue and cron triggering with zero idle VM cost.\n- **AES-256 Vault:** Secure credential storage for all connected broadcast accounts.\n\n[Explore the live demo and documentation](${devUtm}).`,
    tags: ["webdev", "javascript", "productivity", "architecture"],
    canonicalUrl: targetLandingUrl,
  };

  // 11. Discord Announcement Webhook
  const discord: DiscordContent = {
    embedTitle: `📢 Announcement: ${analysis.headline}`.slice(0, 250),
    embedDescription: `${seedTopic}\n\nClick below to check out the live release and test the visual DAG workflow engine.`,
    embedColor: 0x5865f2,
    ctaUrl: discUtm,
  };

  return {
    campaignSummary: `Autonomous multi-channel marketing synthesis for "${analysis.headline}" using ${tone.replace("-", " ")} voice.`,
    youtube,
    whatsapp,
    telegram,
    pinterest,
    reddit,
    threads,
    twitter,
    linkedin,
    instagram,
    devto,
    discord,
  };
}

/**
 * Universal Synthesizer entry point:
 * Checks for user BYOK keys / AI models. If absent, executes the built-in keyless algorithmic engine with zero configuration!
 */
export async function runUniversalSynthesizer(options: SynthesisOptions): Promise<{
  payload: CanonicalMarketingPayload;
  modelUsed: string;
  isKeyless: boolean;
}> {
  // Check if an AI key is available
  const hasGemini = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GOOGLE_GENERATIVE_AI_API_KEY.length > 5);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5);

  if (!hasGemini && !hasOpenAI) {
    // Keyless execution: Instant, reliable, zero cost, works out of the box!
    const payload = synthesizeKeylessMarketingContent(options);
    return {
      payload,
      modelUsed: "SmartLabs Algorithmic Synthesizer v2.5 (Built-In Keyless)",
      isKeyless: true,
    };
  }

  // If user provided an API key in .env or BYOK, use the AI SDK synthesizer
  try {
    const { synthesizeMarketingContent } = await import("./ai/synthesizer");
    const result = await synthesizeMarketingContent({
      seedTopic: options.seedTopic,
      targetLandingUrl: options.targetLandingUrl,
      brandVoice: options.tone === "technical-founder" ? "technical" : options.tone === "high-energy" ? "high-energy" : "authoritative",
      targetPlatforms: [
        "YOUTUBE",
        "WHATSAPP",
        "TELEGRAM",
        "PINTEREST",
        "REDDIT",
        "THREADS",
        "TWITTER",
        "LINKEDIN",
        "INSTAGRAM",
        "DEVTO",
        "DISCORD",
      ] as any,
      workspaceId: options.workspaceId,
    });

    return {
      payload: result.payload,
      modelUsed: result.modelUsed,
      isKeyless: false,
    };
  } catch (err) {
    console.warn("AI SDK failed or quota exceeded, falling back seamlessly to Built-In Keyless Synthesizer:", err);
    const payload = synthesizeKeylessMarketingContent(options);
    return {
      payload,
      modelUsed: "SmartLabs Algorithmic Synthesizer (Zero-Key Fallback)",
      isKeyless: true,
    };
  }
}

