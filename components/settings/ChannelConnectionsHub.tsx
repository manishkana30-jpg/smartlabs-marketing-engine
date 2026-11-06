"use client";

import React, { useState } from "react";
import { Platform, AiProvider } from "@/lib/types";
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Send,
  Pin,
  Bookmark,
  AtSign,
  Code2,
  Save,
  Lock,
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

interface ChannelConfigItem {
  platform: Platform;
  title: string;
  category: "Social" | "Broadcast" | "Community" | "Developer";
  icon: React.ReactNode;
  tokenLabel: string;
  tokenPlaceholder: string;
  metadataFields?: { key: string; label: string; placeholder: string }[];
}

const CHANNELS: ChannelConfigItem[] = [
  {
    platform: Platform.YOUTUBE,
    title: "YouTube Shorts & Video",
    category: "Social",
    icon: <YoutubeIcon className="h-5 w-5 text-red-500" />,
    tokenLabel: "Google OAuth Access Token",
    tokenPlaceholder: "ya29.a0AfH6SM...",
    metadataFields: [{ key: "channelId", label: "YouTube Channel ID", placeholder: "UC_x5XG1OV2P6uZZ5FSM9Ttw" }],
  },
  {
    platform: Platform.WHATSAPP,
    title: "WhatsApp Channels & Broadcasts",
    category: "Broadcast",
    icon: <WhatsAppIcon className="h-5 w-5 text-emerald-400" />,
    tokenLabel: "WhatsApp Cloud API Permanent Token",
    tokenPlaceholder: "EAA...",
    metadataFields: [
      { key: "newsletterJid", label: "Newsletter JID / Channel ID", placeholder: "120363123456789@newsletter" },
      { key: "phoneNumberId", label: "Phone Number ID (Optional)", placeholder: "105678912345678" },
    ],
  },
  {
    platform: Platform.TELEGRAM,
    title: "Telegram Bot & Channels",
    category: "Broadcast",
    icon: <TelegramIcon className="h-5 w-5 text-sky-400" />,
    tokenLabel: "Telegram Bot API Token",
    tokenPlaceholder: "7123456789:AAH...",
    metadataFields: [{ key: "chatId", label: "Target Channel Username or Chat ID", placeholder: "@smartlabs_news" }],
  },
  {
    platform: Platform.PINTEREST,
    title: "Pinterest API v5",
    category: "Social",
    icon: <PinterestIcon className="h-5 w-5 text-rose-500" />,
    tokenLabel: "Pinterest Access Token",
    tokenPlaceholder: "pina_...",
    metadataFields: [{ key: "boardId", label: "Default Pin Board ID", placeholder: "1122334455667788" }],
  },
  {
    platform: Platform.REDDIT,
    title: "Reddit API v2 / OAuth",
    category: "Community",
    icon: <RedditIcon className="h-5 w-5 text-orange-500" />,
    tokenLabel: "Reddit Script OAuth Token",
    tokenPlaceholder: "Bearer token or client secret",
    metadataFields: [{ key: "defaultSubreddit", label: "Default Target Subreddit", placeholder: "saas" }],
  },
  {
    platform: Platform.THREADS,
    title: "Meta Threads API",
    category: "Social",
    icon: <ThreadsIcon className="h-5 w-5 text-pink-400" />,
    tokenLabel: "Threads User Access Token",
    tokenPlaceholder: "THQW...",
  },
  {
    platform: Platform.TWITTER,
    title: "X / Twitter API v2",
    category: "Social",
    icon: <TwitterIcon className="h-5 w-5 text-slate-200" />,
    tokenLabel: "Twitter OAuth 2.0 User Token",
    tokenPlaceholder: "AAGv...",
  },
  {
    platform: Platform.LINKEDIN,
    title: "LinkedIn Community Management API",
    category: "Social",
    icon: <LinkedinIcon className="h-5 w-5 text-blue-400" />,
    tokenLabel: "LinkedIn Member/Organization Access Token",
    tokenPlaceholder: "AQV...",
    metadataFields: [{ key: "organizationId", label: "LinkedIn Organization ID", placeholder: "12345678" }],
  },
  {
    platform: Platform.INSTAGRAM,
    title: "Instagram Graph API",
    category: "Social",
    icon: <InstagramIcon className="h-5 w-5 text-fuchsia-400" />,
    tokenLabel: "Facebook Graph User Access Token",
    tokenPlaceholder: "EAAB...",
    metadataFields: [{ key: "instagramAccountId", label: "Instagram Business Account ID", placeholder: "17841400..." }],
  },
  {
    platform: Platform.DEVTO,
    title: "Dev.to Organic Search Syndication",
    category: "Developer",
    icon: <Code2 className="h-5 w-5 text-cyan-400" />,
    tokenLabel: "Dev.to API Key",
    tokenPlaceholder: "api_key_...",
  },
  {
    platform: Platform.DISCORD,
    title: "Discord Webhook Announcements",
    category: "Community",
    icon: <DiscordIconCustom className="h-5 w-5 text-indigo-400" />,
    tokenLabel: "Discord Webhook URL",
    tokenPlaceholder: "https://discord.com/api/webhooks/...",
  },
];

export function ChannelConnectionsHub() {
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [byokStatus, setByokStatus] = useState<string | null>(null);

  const [activeChannelModal, setActiveChannelModal] = useState<ChannelConfigItem | null>(null);
  const [accountName, setAccountName] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [metadataInputs, setMetadataInputs] = useState<Record<string, string>>({});
  const [channelStatus, setChannelStatus] = useState<string | null>(null);

  const handleSaveByok = async (provider: AiProvider, key: string) => {
    if (!key) return;
    setByokStatus(`Encrypting & saving ${provider} key via AES-256-GCM...`);
    try {
      const res = await fetch("/api/settings/byok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: key }),
      });
      const data = await res.json();
      if (data.success) {
        setByokStatus(`${provider} Key Encrypted & Saved in Database Vault ✓`);
      } else {
        setByokStatus(`Error: ${data.error}`);
      }
    } catch {
      setByokStatus("Failed to save key");
    }
    setTimeout(() => setByokStatus(null), 3000);
  };

  const handleSaveChannel = async () => {
    if (!activeChannelModal || !accountName || !tokenInput) return;
    setChannelStatus("Encrypting tokens and saving connection...");
    try {
      const res = await fetch("/api/settings/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: activeChannelModal.platform,
          accountName,
          accessToken: tokenInput,
          metadata: metadataInputs,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChannelStatus("Channel Connected Successfully ✓");
        setTimeout(() => {
          setActiveChannelModal(null);
          setChannelStatus(null);
          setAccountName("");
          setTokenInput("");
          setMetadataInputs({});
        }, 1200);
      } else {
        setChannelStatus(`Failed: ${data.error}`);
      }
    } catch (err: any) {
      setChannelStatus("Connection failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* BYOK AI Model Vault Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Bring-Your-Own-Key (BYOK) AI Vault
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3 w-3" /> AES-256-GCM
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                All model provider keys are encrypted in PostgreSQL with individual IVs and authentication tags.
              </p>
            </div>
          </div>

          {byokStatus && (
            <span className="text-xs font-semibold text-emerald-400 animate-pulse">
              {byokStatus}
            </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Google Gemini 2.0 Flash</span>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Default / Free Tier
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Low-cost, high-speed multi-channel synthesis engine.
            </p>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              onClick={() => handleSaveByok(AiProvider.GOOGLE_AI, geminiKey)}
              className="w-full rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 py-1.5 text-xs font-semibold border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Gemini Key
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">OpenAI (GPT-4o)</span>
              <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                BYOK Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct routing for nuanced creative copy and storytelling.
            </p>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              onClick={() => handleSaveByok(AiProvider.OPENAI, openaiKey)}
              className="w-full rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 py-1.5 text-xs font-semibold border border-purple-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save OpenAI Key
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Anthropic (Claude 3.5 Sonnet)</span>
              <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                BYOK Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Industry standard for long-form technical Dev.to & LinkedIn copy.
            </p>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
            />
            <button
              onClick={() => handleSaveByok(AiProvider.ANTHROPIC, claudeKey)}
              className="w-full rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 py-1.5 text-xs font-semibold border border-sky-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Claude Key
            </button>
          </div>
        </div>
      </div>

      {/* 11 Channel Distribution Hub */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="border-b border-slate-800 pb-5">
          <h3 className="text-base font-bold text-slate-100">
            Channel Distribution Matrix (11 Active Traffic Networks)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Connect your company broadcast feeds, social profiles, and developer syndication endpoints with encrypted credential storage.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map((ch) => (
            <div
              key={ch.platform}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {ch.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{ch.title}</h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {ch.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Lock className="h-3 w-3 text-slate-500" /> AES-256 Vault
                </span>

                <button
                  onClick={() => {
                    setActiveChannelModal(ch);
                    setAccountName("");
                    setTokenInput("");
                    setMetadataInputs({});
                    setChannelStatus(null);
                  }}
                  className="rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-semibold transition-all"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Configuration Modal */}
      {activeChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                {activeChannelModal.icon}
                <h3 className="text-sm font-bold text-slate-100">
                  Configure {activeChannelModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveChannelModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {channelStatus && (
              <div className="rounded-lg bg-indigo-950/60 border border-indigo-500/30 p-2.5 text-xs text-indigo-300 font-medium">
                {channelStatus}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Account / Handle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. SmartLabsHQ"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  {activeChannelModal.tokenLabel}
                </label>
                <input
                  type="password"
                  placeholder={activeChannelModal.tokenPlaceholder}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {activeChannelModal.metadataFields?.map((field) => (
                <div key={field.key}>
                  <label className="font-semibold text-slate-300 block mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={metadataInputs[field.key] || ""}
                    onChange={(e) =>
                      setMetadataInputs({
                        ...metadataInputs,
                        [field.key]: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setActiveChannelModal(null)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChannel}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Encrypt & Connect Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
