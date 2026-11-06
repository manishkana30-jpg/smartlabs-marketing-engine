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
  Copy,
  Zap,
  RotateCcw,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Sliders,
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
import { TonePreset, synthesizeKeylessMarketingContent } from "@/lib/synthesizer";

const SAMPLE_TEMPLATES = [
  {
    name: "SaaS Product Launch",
    seed: "Launching SmartLabs Marketing Engine — an autonomous single-source content engine that turns 1 changelog into 11 channel-specific viral posts with trackable UTMs.",
    url: "https://smartlabs.ai/engine",
    tone: "high-energy" as TonePreset,
  },
  {
    name: "Weekly Tech Changelog",
    seed: "v2.5 Release: Added keyless algorithmic content synthesis, sub-100ms response time, SQLite zero-config local storage, and 11-channel automated UTM referral tags.",
    url: "https://smartlabs.ai/changelog/v2-5",
    tone: "technical-founder" as TonePreset,
  },
  {
    name: "Viral Growth Tip",
    seed: "Why 90% of solo founders fail at marketing: they spend 40 hours building features and 15 minutes tweeting. How single-source automated distribution solves customer acquisition.",
    url: "https://smartlabs.ai/growth-guide",
    tone: "growth-hacker" as TonePreset,
  },
];

export default function MarketingStudioPage() {
  const [seedTopic, setSeedTopic] = useState(SAMPLE_TEMPLATES[0].seed);
  const [targetLandingUrl, setTargetLandingUrl] = useState(SAMPLE_TEMPLATES[0].url);
  const [tone, setTone] = useState<TonePreset>("high-energy");
  const [activeTab, setActiveTab] = useState<Platform>(Platform.YOUTUBE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [synthesizerBadge, setSynthesizerBadge] = useState<string>(
    "Built-In Keyless Synthesizer (Instant, Zero API Key Required)"
  );

  // Initialize with algorithmic synthesis right out of the box
  const [payload, setPayload] = useState<CanonicalMarketingPayload>(() =>
    synthesizeKeylessMarketingContent({
      seedTopic: SAMPLE_TEMPLATES[0].seed,
      targetLandingUrl: SAMPLE_TEMPLATES[0].url,
      tone: "high-energy",
    })
  );

  const handleApplyTemplate = (tmpl: (typeof SAMPLE_TEMPLATES)[0]) => {
    setSeedTopic(tmpl.seed);
    setTargetLandingUrl(tmpl.url);
    setTone(tmpl.tone);

    const generated = synthesizeKeylessMarketingContent({
      seedTopic: tmpl.seed,
      targetLandingUrl: tmpl.url,
      tone: tmpl.tone,
    });
    setPayload(generated);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/campaigns/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seedTopic,
          targetLandingUrl,
          tone,
        }),
      });

      const data = await res.json();
      if (data.success && data.payload) {
        setPayload(data.payload);
        setSynthesizerBadge(
          data.isKeyless
            ? "Built-In Keyless Synthesizer (Zero Paid API Key Required)"
            : `AI SDK Active: ${data.modelUsed}`
        );
      } else {
        // Fallback locally
        const fallback = synthesizeKeylessMarketingContent({
          seedTopic,
          targetLandingUrl,
          tone,
        });
        setPayload(fallback);
      }
    } catch {
      const fallback = synthesizeKeylessMarketingContent({
        seedTopic,
        targetLandingUrl,
        tone,
      });
      setPayload(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPayload = (platformKey: string, content: any) => {
    const textToCopy =
      typeof content === "string"
        ? content
        : JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopiedChannel(platformKey);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-0.5 text-[11px] font-semibold text-emerald-300 mb-2">
            <Zap className="h-3 w-3 text-emerald-400" />
            {synthesizerBadge}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Single-Source Marketing Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Input ONE product update or seed topic. The engine automatically adapts copy, character limits, hashtags, and trackable UTM links across 11 platforms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
              isEditing
                ? "border-indigo-500 bg-indigo-950/60 text-indigo-300"
                : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            {isEditing ? "Exit Inline Editor" : "Inline Editor"}
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-sky-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-sky-600 transition-all"
          >
            {isGenerating ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Synthesizing All Channels...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-current" />
                Generate All 11 Platforms
              </>
            )}
          </button>
        </div>
      </div>

      {/* Input Section & One-Click Sample Templates */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-4">
        {/* Templates Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Quick Templates:
          </span>
          {SAMPLE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              onClick={() => handleApplyTemplate(tmpl)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-300 hover:border-indigo-500/60 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3 text-indigo-400" />
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Seed Topic / Product URL / Changelog</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {seedTopic.length} characters
              </span>
            </label>
            <textarea
              rows={3}
              value={seedTopic}
              onChange={(e) => setSeedTopic(e.target.value)}
              placeholder="e.g. Launching our new zero-cost autonomous marketing workflow engine..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Target Landing Page URL
              </label>
              <input
                type="url"
                value={targetLandingUrl}
                onChange={(e) => setTargetLandingUrl(e.target.value)}
                placeholder="https://mysite.com/product"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Tone Preset
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as TonePreset)}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="growth-hacker">Growth Hacker (Viral, High-Converting)</option>
                <option value="technical-founder">Technical Founder (Architecture, In-Depth)</option>
                <option value="storyteller">Casual Storyteller (Authentic, Journey)</option>
                <option value="high-energy">High-Energy Launch (Urgent, Bold)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Channel Live Previews & Inline Editor */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Navigation Tabs */}
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

        {/* Tab Preview Pane */}
        <div className="p-6">
          {/* Top Actions on Active Tab */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="capitalize">{activeTab.toLowerCase()} Channel Output</span>
              <span className="text-slate-500 font-mono text-[11px]">• Trackable UTM Link Embedded</span>
            </div>

            <button
              onClick={() =>
                handleCopyPayload(
                  activeTab,
                  payload[activeTab.toLowerCase() as keyof CanonicalMarketingPayload]
                )
              }
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              {copiedChannel === activeTab ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied Payload!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Payload
                </>
              )}
            </button>
          </div>

          {/* YOUTUBE */}
          {activeTab === Platform.YOUTUBE && payload.youtube && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Preview Card */}
              <div className="rounded-2xl border border-slate-800 bg-[#0f0f0f] p-4 text-white shadow-xl">
                <div className="relative aspect-video w-full rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
                  <div className="text-center">
                    <YoutubeIcon className="h-12 w-12 text-red-600 mx-auto" />
                    <span className="text-xs text-slate-400 mt-2 block">16:9 Video / Shorts Thumbnail</span>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-mono font-bold">
                    08:42
                  </span>
                </div>

                <div className="mt-3.5">
                  <h3 className="text-sm font-bold line-clamp-2 leading-snug">
                    {payload.youtube.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>SmartLabs HQ</span> • <span>28K views</span> • <span>Just now</span>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-[#272727] p-3 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
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

              {/* Inline Editor */}
              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Edit3 className="h-3.5 w-3.5 text-indigo-400" /> Edit YouTube Video Details
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Title: {payload.youtube.title.length}/100 chars
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Title</label>
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
                  <label className="text-[11px] font-medium text-slate-400">
                    Description (Line 1 contains the trackable UTM link)
                  </label>
                  <textarea
                    rows={7}
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

          {/* WHATSAPP */}
          {activeTab === Platform.WHATSAPP && payload.whatsapp && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#0b141a] p-5 shadow-xl max-w-md mx-auto w-full">
                <div className="flex items-center gap-3 border-b border-[#202c33] pb-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                    SL
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">SmartLabs Growth Broadcast</div>
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
                  <Edit3 className="h-3.5 w-3.5 text-emerald-400" /> Edit WhatsApp Message
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Message Text</label>
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
                  <div>
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
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-400">CTA Trackable URL</label>
                    <input
                      type="text"
                      value={payload.whatsapp.ctaUrl}
                      onChange={(e) =>
                        setPayload({
                          ...payload,
                          whatsapp: { ...payload.whatsapp!, ctaUrl: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TELEGRAM */}
          {activeTab === Platform.TELEGRAM && payload.telegram && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#17212b] p-5 shadow-xl max-w-md mx-auto w-full">
                <div className="flex items-center gap-2.5 border-b border-[#242f3d] pb-3 mb-4">
                  <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-white text-xs">
                    ✈️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">SmartLabs Channel</div>
                    <div className="text-[10px] text-sky-400">32,400 subscribers</div>
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
                  <Edit3 className="h-3.5 w-3.5 text-sky-400" /> Edit Telegram HTML Message
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">HTML Content</label>
                  <textarea
                    rows={6}
                    value={payload.telegram.htmlMessage}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        telegram: { ...payload.telegram!, htmlMessage: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TWITTER / X */}
          {activeTab === Platform.TWITTER && payload.twitter && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-black p-4 text-white shadow-xl max-w-md mx-auto w-full space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between">
                  <span>X Thread Sequence</span>
                  <span>{payload.twitter.tweets.length} Tweets</span>
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
                  <Edit3 className="h-3.5 w-3.5 text-slate-300" /> Edit Thread Sequence
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
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LINKEDIN */}
          {activeTab === Platform.LINKEDIN && payload.linkedin && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#1b1f23] p-4 text-white shadow-xl max-w-md mx-auto w-full">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                    in
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">SmartLabs Technologies</div>
                    <div className="text-[10px] text-slate-400">14,200 followers • Organic</div>
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
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-blue-400" /> Edit LinkedIn B2B Post
                </div>

                <textarea
                  rows={8}
                  value={payload.linkedin.postBody}
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      linkedin: { ...payload.linkedin!, postBody: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100"
                />
              </div>
            </div>
          )}

          {/* REDDIT */}
          {activeTab === Platform.REDDIT && payload.reddit && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-2xl border border-slate-800 bg-[#1a1a1b] p-4 text-white shadow-xl max-w-md mx-auto w-full">
                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                  <span className="font-bold text-orange-400">r/{payload.reddit.targetSubreddit}</span> • <span>Posted by u/SmartLabsDev</span>
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-3">{payload.reddit.title}</h3>
                <div className="rounded-xl bg-[#272729] p-3 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {payload.reddit.markdownBody}
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-orange-400" /> Edit Reddit Post
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Title</label>
                  <input
                    type="text"
                    value={payload.reddit.title}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        reddit: { ...payload.reddit!, title: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
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
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PINTEREST, THREADS, INSTAGRAM, DEVTO, DISCORD */}
          {(activeTab === Platform.PINTEREST ||
            activeTab === Platform.THREADS ||
            activeTab === Platform.INSTAGRAM ||
            activeTab === Platform.DEVTO ||
            activeTab === Platform.DISCORD) && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
              <h4 className="text-sm font-bold text-slate-200 capitalize mb-2">
                {activeTab.toLowerCase()} Channel Output
              </h4>
              <pre className="max-w-2xl rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
                {JSON.stringify(
                  payload[activeTab.toLowerCase() as keyof CanonicalMarketingPayload],
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
