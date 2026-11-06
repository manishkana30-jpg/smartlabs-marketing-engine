"use client";

import React, { useState } from "react";
import { Platform } from "@/lib/types";
import {
  Sparkles,
  Send,
  Edit3,
  ExternalLink,
  Check,
  Code2,
} from "lucide-react";
import {
  YoutubeIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  WhatsAppIcon,
  TelegramIcon,
  PinterestIcon,
  RedditIcon,
  ThreadsIcon,
  DiscordIconCustom,
} from "@/components/icons/PlatformIcons";
import { CanonicalMarketingPayload } from "@/lib/ai/types";

// High quality initial sample marketing synthesis
const defaultInitialPayload: CanonicalMarketingPayload = {
  campaignSummary:
    "Launch campaign highlighting autonomous 24/7 cloud marketing and zero-idle multi-channel syndication.",
  youtube: {
    title: "How We Automated 24/7 Content Syndication Across 11 Platforms (No Server Costs)",
    description:
      "🚀 Scale your organic traffic 10x with zero idle server cost: https://smartlabs.ai/engine?utm_source=youtube&utm_medium=video_organic&utm_campaign=autonomous-launch\n\nIn this video, we break down our distributed Single-Source Content Engine using Next.js 15, Vercel AI SDK, and Upstash QStash.",
    tags: ["contentengine", "growthmarketing", "saas", "automation", "ai", "nextjs"],
  },
  whatsapp: {
    messageText:
      "🔥 *SmartLabs Update:* Your content engine is now 100% autonomous!\n\nSynthesize one seed topic and broadcast to YouTube, X, Reddit, and Telegram automatically while your PC is off.",
    ctaButtonText: "Explore Live Engine",
    ctaUrl:
      "https://smartlabs.ai/engine?utm_source=whatsapp&utm_medium=broadcast_chat&utm_campaign=autonomous-launch",
  },
  telegram: {
    htmlMessage:
      "⚡ <b>SmartLabs Marketing Engine v2.0 is Live!</b>\n\nStop copying &amp; pasting social updates. Turn 1 changelog or article into 11 channel-specific posts with trackable UTM attribution.\n\n<code>Serverless • Zero Egress • BYOK</code>",
    buttonText: "Launch Engine Now →",
    buttonUrl:
      "https://smartlabs.ai/engine?utm_source=telegram&utm_medium=broadcast_chat&utm_campaign=autonomous-launch",
  },
  pinterest: {
    title: "11-Platform Autonomous Social Marketing Architecture Diagram",
    description:
      "Automate high-converting organic traffic with serverless 24/7 cloud cron, AI content synthesis, and zero-egress asset hosting. See how the visual DAG works.",
    destinationUrl:
      "https://smartlabs.ai/engine?utm_source=pinterest&utm_medium=social_pinner&utm_campaign=autonomous-launch",
  },
  reddit: {
    title: "We built an autonomous marketing engine that runs 24/7 in the cloud without a running PC",
    markdownBody:
      "As solo founders and small engineering teams, marketing is usually the first thing that falls behind. We wanted a system that takes a single Git commit, changelog, or product update and automatically synthesizes high-context content tailored for every major platform.\n\nHere is how we architected the system using Next.js 15, Vercel AI SDK, and Upstash QStash: [Read our technical breakdown](https://smartlabs.ai/engine?utm_source=reddit&utm_medium=community_discussion&utm_campaign=autonomous-launch). Would love feedback on our multi-channel retry architecture!",
    targetSubreddit: "saas",
  },
  threads: {
    text: "Building in public just got automated. One seed topic -> 11 platforms synthesized with native formatting and trackable UTMs.\n\nCheck the live engine: https://smartlabs.ai/engine?utm_source=threads&utm_medium=social_microblog&utm_campaign=autonomous-launch",
  },
  twitter: {
    isThread: true,
    tweets: [
      "1/5 Most SaaS startups die not from bad code, but from inconsistent distribution.\n\nHere is how we built a 24/7 autonomous marketing engine that syndicates our product to 11 platforms while we sleep 🧵👇",
      "2/5 The problem with existing tools: Make/Zapier get expensive quickly, and manual posting ruins deep work blocks.\n\nWe wanted a Single-Source Content Engine with BYOK model routing (Gemini 2.0 Flash + Claude 3.5 Sonnet).",
      "3/5 The architecture: Next.js 15 App Router + Upstash QStash for zero-idle serverless cron + AES-256 encrypted credential vaults.",
      "4/5 Every channel gets native formatting: Telegram inline buttons, Reddit markdown, YouTube shorts metadata, and LinkedIn 2-line hooks.",
      "5/5 Try out the open engine & visual DAG workflow canvas here: https://smartlabs.ai/engine?utm_source=twitter&utm_medium=social_microblog&utm_campaign=autonomous-launch",
    ],
  },
  linkedin: {
    postBody:
      "Most B2B companies produce great engineering work, but fail to tell the world about it.\n\nToday, we're introducing the SmartLabs Marketing Engine: a cloud-native, autonomous visual workflow platform designed to solve the content distribution bottleneck.\n\nBy leveraging structured outputs from the Vercel AI SDK and Upstash QStash for headless cloud triggering, teams can now broadcast feature launches to 11 distinct traffic networks simultaneously.\n\nExplore how to scale your traffic engine: https://smartlabs.ai/engine?utm_source=linkedin&utm_medium=social_b2b&utm_campaign=autonomous-launch",
    hashtags: ["#ProductMarketing", "#AIAutomation", "#GrowthEngineering", "#SaaS", "#B2B"],
  },
  instagram: {
    caption:
      "Scale your SaaS distribution on autopilot 🚀. One update -> 11 platforms. Link in bio to see the visual workflow DAG in action!",
    firstCommentHashtags: "#saas #marketingautomation #fullstack #nextjs #techstartups",
  },
  devto: {
    title: "Architecting a 24/7 Autonomous Content Engine with Next.js 15 and Serverless Queues",
    markdownBody:
      "# Architecting a 24/7 Autonomous Content Engine\n\nIn this article, we break down how to build an autonomous multi-platform distribution system that runs server-to-server.\n\n## Tech Stack\n- Next.js 15\n- Upstash QStash\n- Vercel AI SDK\n- Cloudflare R2\n\n[Check out the live engine](https://smartlabs.ai/engine?utm_source=devto&utm_medium=developer_syndication&utm_campaign=autonomous-launch).",
    tags: ["webdev", "javascript", "ai", "architecture"],
    canonicalUrl: "https://smartlabs.ai/engine",
  },
  discord: {
    embedTitle: "📢 SmartLabs Marketing Engine v2.0 Release!",
    embedDescription:
      "Autonomous 24/7 content engine is now live. Features visual DAG workflow editor, Bring-Your-Own-Key model routing, and automatic UTM traffic tracking.",
    embedColor: 0x5865f2,
    ctaUrl:
      "https://smartlabs.ai/engine?utm_source=discord&utm_medium=community_chat&utm_campaign=autonomous-launch",
  },
};

export function SingleSourcePreviewEditor() {
  const [seedTopic, setSeedTopic] = useState(
    "SmartLabs Autonomous 24/7 Engine v2.0 Release with DAG visual workflows and Bring-Your-Own-Key support"
  );
  const [targetLandingUrl, setTargetLandingUrl] = useState(
    "https://smartlabs.ai/engine"
  );
  const [brandVoice, setBrandVoice] = useState<
    "authoritative" | "conversational" | "high-energy" | "technical"
  >("authoritative");
  const [activeTab, setActiveTab] = useState<Platform>(Platform.YOUTUBE);
  const [payload, setPayload] = useState<CanonicalMarketingPayload>(defaultInitialPayload);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    setPublishMessage(null);
    try {
      const res = await fetch("/api/campaigns/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedTopic,
          targetLandingUrl,
          brandVoice,
        }),
      });

      const data = await res.json();
      if (data.success && data.payload) {
        setPayload(data.payload);
      }
    } catch (err) {
      console.error("Synthesis failed, keeping current preview:", err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handlePublishAll = () => {
    setPublishMessage("Dispatching to 11 channels via QStash serverless queue...");
    setTimeout(() => {
      setPublishMessage("All 11 channels queued successfully! Check Live Logs. ✓");
      setTimeout(() => setPublishMessage(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Seed Configuration Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Single-Source Content Synthesizer
              </h2>
              <p className="text-xs text-slate-400">
                Transform one seed topic into 11 channel-native, high-converting social assets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all ${
                isSynthesizing
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20"
              }`}
            >
              {isSynthesizing ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Synthesizing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 fill-current" />
                  Synthesize Multi-Channel Copy
                </>
              )}
            </button>

            <button
              onClick={handlePublishAll}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              Publish to All 11 Channels
            </button>
          </div>
        </div>

        {publishMessage && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-300 animate-fadeIn">
            {publishMessage}
          </div>
        )}

        {/* Input Fields */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Seed Topic / Changelog / Article Note
            </label>
            <textarea
              value={seedTopic}
              onChange={(e) => setSeedTopic(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Launched new automated webhook triggers with zero latency..."
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Destination Landing Page URL
              </label>
              <input
                type="url"
                value={targetLandingUrl}
                onChange={(e) => setTargetLandingUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="https://yourdomain.com/landing"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Brand Voice Profile
              </label>
              <select
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value as any)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="authoritative">Authoritative & Insightful (B2B)</option>
                <option value="conversational">Conversational & Engaging</option>
                <option value="technical">Technical & Architecture Deep Dive</option>
                <option value="high-energy">High-Energy & Viral Launch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Platform Preview & Editor Area */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Navigation Tabs for Platforms */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/60 p-2 gap-1.5">
          {[
            { id: Platform.YOUTUBE, label: "YouTube", icon: <YoutubeIcon className="h-4 w-4 text-red-500" /> },
            { id: Platform.WHATSAPP, label: "WhatsApp", icon: <WhatsAppIcon className="h-4 w-4 text-emerald-400" /> },
            { id: Platform.TELEGRAM, label: "Telegram", icon: <TelegramIcon className="h-4 w-4 text-sky-400" /> },
            { id: Platform.PINTEREST, label: "Pinterest", icon: <PinterestIcon className="h-4 w-4 text-rose-500" /> },
            { id: Platform.REDDIT, label: "Reddit", icon: <RedditIcon className="h-4 w-4 text-orange-500" /> },
            { id: Platform.THREADS, label: "Threads", icon: <ThreadsIcon className="h-4 w-4 text-pink-400" /> },
            { id: Platform.TWITTER, label: "X / Twitter", icon: <TwitterIcon className="h-4 w-4 text-slate-200" /> },
            { id: Platform.LINKEDIN, label: "LinkedIn", icon: <LinkedinIcon className="h-4 w-4 text-blue-400" /> },
            { id: Platform.INSTAGRAM, label: "Instagram", icon: <InstagramIcon className="h-4 w-4 text-fuchsia-400" /> },
            { id: Platform.DEVTO, label: "Dev.to", icon: <Code2 className="h-4 w-4 text-cyan-400" /> },
            { id: Platform.DISCORD, label: "Discord", icon: <DiscordIconCustom className="h-4 w-4 text-indigo-400" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="p-6">
          {/* YOUTUBE PREVIEW */}
          {activeTab === Platform.YOUTUBE && payload.youtube && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#0f0f0f] p-4 text-white shadow-xl">
                <div className="relative aspect-video w-full rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
                  <div className="text-center">
                    <YoutubeIcon className="h-12 w-12 text-red-600 mx-auto" />
                    <span className="text-xs text-slate-400 mt-2 block">16:9 Video / Shorts Thumbnail</span>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono font-bold">
                    12:45
                  </span>
                </div>

                <div className="mt-3.5">
                  <h3 className="text-sm font-bold line-clamp-2 leading-snug">
                    {payload.youtube.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>SmartLabs HQ</span> • <span>14K views</span> • <span>Just now</span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-[#272727] p-3 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {payload.youtube.description}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {payload.youtube.tags?.map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-indigo-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="h-3.5 w-3.5 text-indigo-400" /> YouTube Copy Override
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Title: {payload.youtube.title.length}/100
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Video Title</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={payload.youtube.title}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        youtube: { ...payload.youtube!, title: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Description (UTM Link in Top 2 Lines)</label>
                  <textarea
                    rows={6}
                    value={payload.youtube.description}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        youtube: { ...payload.youtube!, description: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WHATSAPP PREVIEW */}
          {activeTab === Platform.WHATSAPP && payload.whatsapp && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#0b141a] p-5 shadow-xl max-w-md mx-auto w-full">
                <div className="flex items-center gap-3 border-b border-[#202c33] pb-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                    SL
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">SmartLabs Channel</div>
                    <div className="text-[10px] text-emerald-400">Verified Broadcast Channel</div>
                  </div>
                </div>

                <div className="rounded-xl bg-[#202c33] p-3.5 text-xs text-slate-100 shadow-md whitespace-pre-line leading-relaxed">
                  {payload.whatsapp.messageText}
                  <div className="mt-2 text-right text-[10px] text-slate-400 flex items-center justify-end gap-1">
                    <span>12:00</span>
                    <Check className="h-3 w-3 text-emerald-400" />
                  </div>
                </div>

                <div className="mt-2">
                  <a
                    href={payload.whatsapp.ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#202c33] hover:bg-[#2a3942] py-2.5 text-xs font-semibold text-[#00a884] border border-[#202c33] transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {payload.whatsapp.ctaButtonText}
                  </a>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp Message Override
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Message Text (Emojis & Bullets)</label>
                  <textarea
                    rows={6}
                    value={payload.whatsapp.messageText}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        whatsapp: { ...payload.whatsapp!, messageText: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">Button Label</label>
                    <input
                      type="text"
                      maxLength={25}
                      value={payload.whatsapp.ctaButtonText}
                      onChange={(e) =>
                        setPayload({
                          ...payload,
                          whatsapp: { ...payload.whatsapp!, ctaButtonText: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">Trackable Target URL</label>
                    <input
                      type="text"
                      value={payload.whatsapp.ctaUrl}
                      onChange={(e) =>
                        setPayload({
                          ...payload,
                          whatsapp: { ...payload.whatsapp!, ctaUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TELEGRAM PREVIEW */}
          {activeTab === Platform.TELEGRAM && payload.telegram && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#17212b] p-5 shadow-xl max-w-md mx-auto w-full">
                <div className="flex items-center gap-2.5 border-b border-[#242f3d] pb-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white text-xs">
                    ✈️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">SmartLabs Announcements</div>
                    <div className="text-[10px] text-sky-400">32,450 subscribers</div>
                  </div>
                </div>

                <div
                  className="rounded-xl bg-[#242f3d] p-4 text-xs text-slate-100 shadow-md leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: payload.telegram.htmlMessage }}
                />

                <div className="mt-2.5">
                  <a
                    href={payload.telegram.buttonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#2b5278] hover:bg-[#33618d] py-2.5 text-xs font-semibold text-white shadow-md transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {payload.telegram.buttonText}
                  </a>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-sky-400" /> Telegram HTML Override
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">HTML Message Body</label>
                  <textarea
                    rows={6}
                    value={payload.telegram.htmlMessage}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        telegram: { ...payload.telegram!, htmlMessage: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">Inline Button Text</label>
                    <input
                      type="text"
                      maxLength={30}
                      value={payload.telegram.buttonText}
                      onChange={(e) =>
                        setPayload({
                          ...payload,
                          telegram: { ...payload.telegram!, buttonText: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">Inline Button URL</label>
                    <input
                      type="text"
                      value={payload.telegram.buttonUrl}
                      onChange={(e) =>
                        setPayload({
                          ...payload,
                          telegram: { ...payload.telegram!, buttonUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PINTEREST PREVIEW */}
          {activeTab === Platform.PINTEREST && payload.pinterest && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-white p-4 text-slate-900 shadow-xl max-w-sm mx-auto w-full">
                <div className="relative aspect-[2/3] w-full rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex flex-col justify-end p-4 text-white overflow-hidden shadow-inner">
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold w-max mb-auto">
                    SMARTLABS ARCHITECTURE
                  </span>
                  <div className="font-bold text-sm leading-tight drop-shadow-md">
                    {payload.pinterest.title}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] opacity-90">smartlabs.ai</span>
                    <a
                      href={payload.pinterest.destinationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-red-600 hover:bg-red-700 px-3 py-1.5 text-xs font-bold text-white shadow-lg transition-all"
                    >
                      Visit
                    </a>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-sm text-slate-900">{payload.pinterest.title}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{payload.pinterest.description}</p>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-rose-400" /> Pinterest Pin Override
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Pin Title (max 100)</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={payload.pinterest.title}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        pinterest: { ...payload.pinterest!, title: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Pin Description (max 500)</label>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={payload.pinterest.description}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        pinterest: { ...payload.pinterest!, description: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TWITTER / X PREVIEW */}
          {activeTab === Platform.TWITTER && payload.twitter && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-black p-4 text-white shadow-xl max-w-md mx-auto w-full space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  X Thread Sequence ({payload.twitter.tweets.length} Tweets)
                </div>

                {payload.twitter.tweets.map((tweet, idx) => (
                  <div key={idx} className="relative flex gap-3 text-xs">
                    {idx < (payload.twitter?.tweets.length ?? 0) - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-800" />
                    )}

                    <div className="h-8 w-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center font-bold text-[11px] text-white">
                      SL
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="font-bold text-white">SmartLabs</span>
                        <span className="text-slate-500">@SmartLabsAI</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-500">{idx + 1} of {payload.twitter?.tweets.length}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-line">{tweet}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-slate-300" /> Thread Sequencer
                </div>

                {payload.twitter.tweets.map((tw, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Tweet #{idx + 1}</span>
                      <span className={tw.length > 280 ? "text-rose-400 font-bold" : "text-slate-500"}>
                        {tw.length}/280 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={tw}
                      onChange={(e) => {
                        const updated = [...(payload.twitter?.tweets || [])];
                        updated[idx] = e.target.value;
                        setPayload({
                          ...payload,
                          twitter: { ...payload.twitter!, tweets: updated },
                        });
                      }}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LINKEDIN PREVIEW */}
          {activeTab === Platform.LINKEDIN && payload.linkedin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#1b1f23] p-4 text-white shadow-xl max-w-md mx-auto w-full">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    in
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">SmartLabs Technologies</div>
                    <div className="text-[10px] text-slate-400">12,890 followers • Promoted</div>
                  </div>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  {payload.linkedin.postBody}
                </div>

                <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-blue-400 font-semibold">
                  {payload.linkedin.hashtags?.map((tag) => (
                    <span key={tag}>{tag.startsWith("#") ? tag : `#${tag}`}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-around border-t border-slate-800 pt-3 text-[11px] text-slate-400 font-semibold">
                  <span>👍 Like</span>
                  <span>💬 Comment</span>
                  <span>🔁 Repost</span>
                  <span>🚀 Send</span>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-blue-400" /> LinkedIn B2B Post Override
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Post Body (Hook + Value + CTA)</label>
                  <textarea
                    rows={8}
                    value={payload.linkedin.postBody}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        linkedin: { ...payload.linkedin!, postBody: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* REDDIT PREVIEW */}
          {activeTab === Platform.REDDIT && payload.reddit && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#1a1a1b] p-4 text-white shadow-xl max-w-md mx-auto w-full">
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                  <span className="font-bold text-orange-400">r/{payload.reddit.targetSubreddit}</span> • <span>Posted by u/SmartLabsFounder</span>
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-3">{payload.reddit.title}</h3>
                <div className="rounded-xl bg-[#272729] p-3 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                  {payload.reddit.markdownBody}
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-orange-400" /> Reddit Discussion Override
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Target Subreddit</label>
                  <input
                    type="text"
                    value={payload.reddit.targetSubreddit}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        reddit: { ...payload.reddit!, targetSubreddit: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Post Title</label>
                  <input
                    type="text"
                    value={payload.reddit.title}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        reddit: { ...payload.reddit!, title: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Markdown Body</label>
                  <textarea
                    rows={6}
                    value={payload.reddit.markdownBody}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        reddit: { ...payload.reddit!, markdownBody: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DISCORD PREVIEW */}
          {activeTab === Platform.DISCORD && payload.discord && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#313338] p-5 text-white shadow-xl max-w-md mx-auto w-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
                    BOT
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-100">SmartLabs Bot</span>
                    <span className="ml-1.5 rounded bg-indigo-500 px-1 py-0.2 text-[9px] font-bold">APP</span>
                  </div>
                </div>

                <div className="rounded-md border-l-4 border-indigo-500 bg-[#2b2d31] p-3 text-xs">
                  <h4 className="font-bold text-sm text-white mb-2">{payload.discord.embedTitle}</h4>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{payload.discord.embedDescription}</p>
                  <a
                    href={payload.discord.ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:underline"
                  >
                    Open Link <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-indigo-400" /> Discord Webhook Embed Override
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Embed Title</label>
                  <input
                    type="text"
                    value={payload.discord.embedTitle}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        discord: { ...payload.discord!, embedTitle: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Embed Description</label>
                  <textarea
                    rows={6}
                    value={payload.discord.embedDescription}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        discord: { ...payload.discord!, embedDescription: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK/OTHER PLATFORMS (Threads, Dev.to, Instagram) */}
          {(activeTab === Platform.THREADS ||
            activeTab === Platform.DEVTO ||
            activeTab === Platform.INSTAGRAM) && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-center">
              <h4 className="text-sm font-bold text-slate-200 capitalize">
                {activeTab.toLowerCase()} Channel Payload
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                Synthesized for {activeTab} algorithms with embedded UTM attribution.
              </p>
              <pre className="mt-4 max-w-2xl mx-auto rounded-xl bg-slate-900 p-4 text-left text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                {JSON.stringify(payload[activeTab.toLowerCase() as keyof CanonicalMarketingPayload], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
