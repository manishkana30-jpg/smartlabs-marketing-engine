"use client";

import React, { useState, useEffect } from "react";
import { Platform, AiProvider } from "@/lib/types";
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Send,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Save,
  Lock,
  Globe,
  Webhook,
  Code2,
  ArrowUpRight,
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
  setupUrl: string;
  setupButtonLabel: string;
  setupInstructions: string[];
  webhookNotice?: {
    title: string;
    description: string;
    getWebhookUrl: (baseUrl: string) => string;
  };
  metadataFields?: { key: string; label: string; placeholder: string }[];
}

const CHANNELS: ChannelConfigItem[] = [
  {
    platform: Platform.TELEGRAM,
    title: "Telegram Bot & Channels",
    category: "Broadcast",
    icon: <TelegramIcon className="h-5 w-5 text-sky-400" />,
    tokenLabel: "Telegram Bot API Token",
    tokenPlaceholder: "7123456789:AAH...",
    setupUrl: "https://t.me/BotFather",
    setupButtonLabel: "Open @BotFather (Telegram) ↗",
    setupInstructions: [
      "Click the button above to open @BotFather in Telegram.",
      "Send the command '/newbot' in the chat.",
      "Give your bot a name and username, then copy the generated HTTP API Bot Token.",
      "In Telegram, open your Channel, go to Channel Settings → Administrators, and add your new bot as an Admin with 'Post Messages' permission.",
      "Enter the Bot Token and your Channel username (e.g. @dailytithi_alerts) below.",
    ],
    metadataFields: [
      { key: "chatId", label: "Target Channel Username or Chat ID", placeholder: "@dailytithi_official" },
    ],
  },
  {
    platform: Platform.DISCORD,
    title: "Discord Webhook Announcements",
    category: "Community",
    icon: <DiscordIconCustom className="h-5 w-5 text-indigo-400" />,
    tokenLabel: "Discord Webhook URL",
    tokenPlaceholder: "https://discord.com/api/webhooks/...",
    setupUrl: "https://discord.com/channels/@me",
    setupButtonLabel: "Open Discord in Browser ↗",
    setupInstructions: [
      "Open your Discord Server and right-click your announcement channel → 'Edit Channel'.",
      "Select 'Integrations' → 'Webhooks' → click 'New Webhook'.",
      "Name your webhook (e.g. 'Daily Tithi Announcements') and click 'Copy Webhook URL'.",
      "Paste the Webhook URL below to broadcast rich embed messages instantly.",
    ],
  },
  {
    platform: Platform.DEVTO,
    title: "Dev.to Organic Search Syndication",
    category: "Developer",
    icon: <Code2 className="h-5 w-5 text-cyan-400" />,
    tokenLabel: "Dev.to API Key",
    tokenPlaceholder: "api_key_...",
    setupUrl: "https://dev.to/settings/extensions",
    setupButtonLabel: "Open Dev.to API Settings ↗",
    setupInstructions: [
      "Open Dev.to Account Settings → Extensions tab.",
      "Scroll down to 'DEV Community API Keys', enter a description (e.g. 'SmartLabs'), and click 'Generate API Key'.",
      "Paste your API key below to syndicate articles with your website's canonical URL automatically.",
    ],
  },
  {
    platform: Platform.WHATSAPP,
    title: "WhatsApp Channels & Cloud API",
    category: "Broadcast",
    icon: <WhatsAppIcon className="h-5 w-5 text-emerald-400" />,
    tokenLabel: "WhatsApp Cloud API Permanent Token",
    tokenPlaceholder: "EAA...",
    setupUrl: "https://developers.facebook.com/apps/",
    setupButtonLabel: "Open Meta Developer Portal ↗",
    setupInstructions: [
      "Open Meta Developers and select your App with WhatsApp Cloud API configured.",
      "Go to WhatsApp → API Setup to generate a permanent System User Token.",
      "For WhatsApp Channels, paste your Channel JID (e.g. 120363...@newsletter).",
      "Enter your credentials below.",
    ],
    webhookNotice: {
      title: "SmartLabs Meta Webhook Callback URL",
      description: "Paste this callback URL into Meta App Dashboard under WhatsApp Webhooks if you want two-way event tracking:",
      getWebhookUrl: (baseUrl) => `${baseUrl}/api/webhooks/tithi`,
    },
    metadataFields: [
      { key: "newsletterJid", label: "Newsletter JID / Channel ID", placeholder: "120363123456789@newsletter" },
      { key: "phoneNumberId", label: "Phone Number ID (Optional)", placeholder: "105678912345678" },
    ],
  },
  {
    platform: Platform.YOUTUBE,
    title: "YouTube Shorts & Video",
    category: "Social",
    icon: <YoutubeIcon className="h-5 w-5 text-red-500" />,
    tokenLabel: "Google OAuth Access Token",
    tokenPlaceholder: "ya29.a0AfH6SM...",
    setupUrl: "https://console.cloud.google.com/apis/credentials",
    setupButtonLabel: "Open Google Cloud Console ↗",
    setupInstructions: [
      "Open Google Cloud Console and enable the 'YouTube Data API v3'.",
      "Create an OAuth 2.0 Client ID or generate a scoped User Access Token.",
      "Ensure scope includes 'https://www.googleapis.com/auth/youtube.upload'.",
      "Find your Channel ID in YouTube Studio → Customization → Basic Info.",
    ],
    metadataFields: [{ key: "channelId", label: "YouTube Channel ID", placeholder: "UC_x5XG1OV2P6uZZ5FSM9Ttw" }],
  },
  {
    platform: Platform.PINTEREST,
    title: "Pinterest API v5",
    category: "Social",
    icon: <PinterestIcon className="h-5 w-5 text-rose-500" />,
    tokenLabel: "Pinterest Access Token",
    tokenPlaceholder: "pina_...",
    setupUrl: "https://developers.pinterest.com/apps/",
    setupButtonLabel: "Open Pinterest Developers ↗",
    setupInstructions: [
      "Open Pinterest Developers and create a developer application.",
      "Generate an Access Token with 'pins:write' and 'boards:read' scopes.",
      "Find your Board ID from your Pinterest board URL (e.g. 1122334455667788).",
      "Paste the credentials below to publish visual pins with destination URLs.",
    ],
    metadataFields: [{ key: "boardId", label: "Default Pin Board ID", placeholder: "1122334455667788" }],
  },
  {
    platform: Platform.REDDIT,
    title: "Reddit API v2 / OAuth",
    category: "Community",
    icon: <RedditIcon className="h-5 w-5 text-orange-500" />,
    tokenLabel: "Reddit Script OAuth Token / Secret",
    tokenPlaceholder: "Bearer token or client secret",
    setupUrl: "https://www.reddit.com/prefs/apps",
    setupButtonLabel: "Open Reddit App Preferences ↗",
    setupInstructions: [
      "Go to Reddit App preferences and click 'create another app...'.",
      "Select 'script', set redirect URI to 'http://localhost:3000', and click create.",
      "Copy your client ID (under app name) and client secret.",
      "Enter your credentials and target subreddit (e.g. 'saas' or 'astrology') below.",
    ],
    metadataFields: [{ key: "defaultSubreddit", label: "Default Target Subreddit", placeholder: "saas" }],
  },
  {
    platform: Platform.THREADS,
    title: "Meta Threads API",
    category: "Social",
    icon: <ThreadsIcon className="h-5 w-5 text-pink-400" />,
    tokenLabel: "Threads User Access Token",
    tokenPlaceholder: "THQW...",
    setupUrl: "https://developers.facebook.com/docs/threads",
    setupButtonLabel: "Open Meta Threads API ↗",
    setupInstructions: [
      "Set up the Threads API in your Meta Developer dashboard.",
      "Generate a User Access Token with 'threads_basic' and 'threads_content_publish' scopes.",
      "Paste your token below.",
    ],
  },
  {
    platform: Platform.TWITTER,
    title: "X / Twitter API v2",
    category: "Social",
    icon: <TwitterIcon className="h-5 w-5 text-slate-200" />,
    tokenLabel: "Twitter OAuth 2.0 User Token",
    tokenPlaceholder: "AAGv...",
    setupUrl: "https://developer.x.com/en/portal/dashboard",
    setupButtonLabel: "Open X Developer Portal ↗",
    setupInstructions: [
      "Go to X Developer Portal and select your Project App.",
      "Under User Authentication Settings, enable OAuth 2.0 with 'Read and Write' permissions.",
      "Generate your User Access Token & Secret, then paste the Access Token below.",
    ],
  },
  {
    platform: Platform.LINKEDIN,
    title: "LinkedIn Community Management API",
    category: "Social",
    icon: <LinkedinIcon className="h-5 w-5 text-blue-400" />,
    tokenLabel: "LinkedIn Member/Organization Access Token",
    tokenPlaceholder: "AQV...",
    setupUrl: "https://www.linkedin.com/developers/apps",
    setupButtonLabel: "Open LinkedIn Developer Portal ↗",
    setupInstructions: [
      "Create an App in LinkedIn Developers and add the 'Share on LinkedIn' product.",
      "Generate an OAuth 2.0 token with 'w_member_social' or 'w_organization_social' scope.",
      "Paste the access token below to auto-publish thought leadership articles.",
    ],
    metadataFields: [{ key: "organizationId", label: "LinkedIn Organization ID", placeholder: "12345678" }],
  },
  {
    platform: Platform.INSTAGRAM,
    title: "Instagram Graph API",
    category: "Social",
    icon: <InstagramIcon className="h-5 w-5 text-fuchsia-400" />,
    tokenLabel: "Facebook Graph User Access Token",
    tokenPlaceholder: "EAAB...",
    setupUrl: "https://developers.facebook.com/apps/",
    setupButtonLabel: "Open Meta Instagram API ↗",
    setupInstructions: [
      "In Meta Developers, add 'Instagram Graph API' to your app.",
      "Ensure your Instagram Professional/Business account is linked to your Facebook Page.",
      "Generate a Page Access Token with 'instagram_content_publish' scope.",
      "Paste your Token and Instagram Business Account ID below.",
    ],
    metadataFields: [{ key: "instagramAccountId", label: "Instagram Business Account ID", placeholder: "17841400..." }],
  },
];

export function ChannelConnectionsHub() {
  const [baseUrl, setBaseUrl] = useState("https://smartlabs-marketing-engine.vercel.app");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // BYOK States
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [byokStatus, setByokStatus] = useState<string | null>(null);

  // Modal States
  const [activeChannelModal, setActiveChannelModal] = useState<ChannelConfigItem | null>(null);
  const [accountName, setAccountName] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [metadataInputs, setMetadataInputs] = useState<Record<string, string>>({});
  const [channelStatus, setChannelStatus] = useState<string | null>(null);

  // Webhook Test State
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenConfigureModal = (ch: ChannelConfigItem) => {
    setActiveChannelModal(ch);
    setAccountName("");
    setTokenInput("");
    setMetadataInputs({});
    setChannelStatus(null);
  };

  const handleTestTithiWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookTestResult(null);
    try {
      const res = await fetch("/api/webhooks/tithi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tithi: "Shukla Pratipada",
          paksha: "Shukla",
          date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
          sunrise: "06:40 AM",
          sunset: "05:32 PM",
          nakshatra: "Rohini",
          specialOccasion: "Chandra Darshan",
          panchak: "No Active Panchak",
          shubhMuhurat: "Abhijit: 11:45 AM - 12:30 PM",
          rahuKaal: "04:30 PM - 06:00 PM",
          auspiciousFor: "Auspicious day for Yatra, Home Buying, Vehicle Buying complete calendar on Daily Tithi:",
          landingUrl: "https://dailytithi.com",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWebhookTestResult(`✓ 200 OK — Webhook Verified! Formatted for ${data.tithi} (${data.date})`);
      } else {
        setWebhookTestResult(`Error: ${data.error || "Webhook rejected payload"}`);
      }
    } catch {
      setWebhookTestResult("Failed to reach webhook endpoint.");
    } finally {
      setIsTestingWebhook(false);
    }
  };

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
        setChannelStatus("Channel Connected & Encrypted Successfully ✓");
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
    } catch {
      setChannelStatus("Connection failed");
    }
  };

  const tithiWebhookUrl = `${baseUrl}/api/webhooks/tithi`;
  const universalWebhookUrl = `${baseUrl}/api/campaigns/synthesize`;
  const cronTriggerUrl = `${baseUrl}/api/cron/daily-trigger`;

  return (
    <div className="space-y-8">
      {/* INBOUND WEBHOOKS & WEBSITE LINKING (e.g. dailytithi.com) */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
              <Webhook className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-950/70 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 mb-1">
                <Globe className="h-3 w-3" /> Connect Your External Website
              </div>
              <h2 className="text-lg font-black tracking-tight text-white sm:text-xl">
                Inbound Webhook Endpoints & Automated Triggers
              </h2>
              <p className="text-xs text-slate-300">
                Link your website (<code className="text-indigo-300 font-bold font-mono">dailytithi.com</code> or your CMS/App) so events automatically synthesize and publish across all 11 platforms.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://dailytithi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              Open dailytithi.com ↗
            </a>
            <button
              onClick={handleTestTithiWebhook}
              disabled={isTestingWebhook}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 cursor-pointer shrink-0"
            >
              {isTestingWebhook ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Testing Webhook...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send Live Test Ping
                </>
              )}
            </button>
          </div>
        </div>

        {webhookTestResult && (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{webhookTestResult}</span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Daily Tithi Webhook */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">DailyTithi Inbound Webhook</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Configure your <code className="text-slate-300">dailytithi.com</code> cron or backend to send today's Tithi here.
              </p>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 font-mono text-[11px] text-indigo-300 break-all select-all">
                {tithiWebhookUrl}
              </div>
              <button
                onClick={() => handleCopy(tithiWebhookUrl, "tithi")}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                {copiedKey === "tithi" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied Webhook URL!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Webhook URL
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Universal Content Inbound Webhook */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Universal Inbound Webhook</span>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded">
                  REST API
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                POST any <code className="text-slate-300">seedTopic</code> and <code className="text-slate-300">targetLandingUrl</code> from any CMS or app.
              </p>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 font-mono text-[11px] text-indigo-300 break-all select-all">
                {universalWebhookUrl}
              </div>
              <button
                onClick={() => handleCopy(universalWebhookUrl, "universal")}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                {copiedKey === "universal" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied URL!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Webhook URL
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 24/7 Cloud Cron Endpoint */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">24/7 Daily Cloud Cron</span>
                <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/80 border border-sky-500/30 px-2 py-0.5 rounded">
                  Scheduled
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Triggerable by Vercel Cron, Upstash QStash, or GitHub Actions with Bearer auth.
              </p>
            </div>

            <div className="space-y-2">
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-2 font-mono text-[11px] text-indigo-300 break-all select-all">
                {cronTriggerUrl}
              </div>
              <button
                onClick={() => handleCopy(cronTriggerUrl, "cron")}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                {copiedKey === "cron" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied URL!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Cron URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 11 Channel Distribution Hub */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Channel Distribution Matrix (11 Active Traffic Networks)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Click <strong>"Open Portal ↗"</strong> to open that platform's developer page in a new tab, or click <strong>"Configure & Link"</strong> to save your credentials.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" /> Encrypted with AES-256-GCM
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map((ch) => (
            <div
              key={ch.platform}
              className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-all">
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

                <p className="text-[11px] text-slate-400 mt-3 line-clamp-2">
                  {ch.setupInstructions[0]}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={ch.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-indigo-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                  title={`Open ${ch.title} setup in a new tab`}
                >
                  <span>Open Portal</span>
                  <ExternalLink className="h-3 w-3 text-indigo-400" />
                </a>

                <button
                  onClick={() => handleOpenConfigureModal(ch)}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Configure & Link</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                Optional: SmartLabs runs free with built-in keyless synthesizer. Add your own keys if you wish to upgrade to paid LLMs.
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
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                Get Key ↗
              </a>
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
              className="w-full rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 py-1.5 text-xs font-semibold border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" /> Save Gemini Key
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">OpenAI (GPT-4o)</span>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold text-purple-400 hover:underline flex items-center gap-0.5"
              >
                Get Key ↗
              </a>
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
              className="w-full rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 py-1.5 text-xs font-semibold border border-purple-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" /> Save OpenAI Key
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Anthropic (Claude 3.5 Sonnet)</span>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold text-sky-400 hover:underline flex items-center gap-0.5"
              >
                Get Key ↗
              </a>
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
              className="w-full rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 py-1.5 text-xs font-semibold border border-sky-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" /> Save Claude Key
            </button>
          </div>
        </div>
      </div>

      {/* Channel Configuration & Linking Modal */}
      {activeChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                {activeChannelModal.icon}
                <h3 className="text-sm font-bold text-slate-100">
                  Configure & Link {activeChannelModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveChannelModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {channelStatus && (
              <div className="rounded-lg bg-indigo-950/60 border border-indigo-500/30 p-2.5 text-xs text-indigo-300 font-medium">
                {channelStatus}
              </div>
            )}

            {/* Step 1: Guaranteed Unblockable Native Link to Platform Setup Page */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                Step 1: Open Developer / Configuration Page
              </span>
              <a
                href={activeChannelModal.setupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 p-3.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                  {activeChannelModal.setupButtonLabel}
                </span>
                <span className="text-[11px] text-white/90 underline font-semibold">
                  Click here to open in new tab ↗
                </span>
              </a>
            </div>

            {/* Step 2: Clear Instructions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                Step 2: Follow Instructions on That Page
              </span>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-300 space-y-1.5">
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                  {activeChannelModal.setupInstructions.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Optional Webhook notice for platform */}
            {activeChannelModal.webhookNotice && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs space-y-2">
                <span className="font-bold text-emerald-300 block">
                  {activeChannelModal.webhookNotice.title}
                </span>
                <p className="text-[11px] text-slate-300">
                  {activeChannelModal.webhookNotice.description}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={activeChannelModal.webhookNotice.getWebhookUrl(baseUrl)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 font-mono text-[11px] text-emerald-200"
                  />
                  <button
                    onClick={() =>
                      handleCopy(
                        activeChannelModal.webhookNotice!.getWebhookUrl(baseUrl),
                        "modal-webhook"
                      )
                    }
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white shrink-0 cursor-pointer"
                  >
                    {copiedKey === "modal-webhook" ? "Copied!" : "Copy Webhook"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Enter Tokens */}
            <div className="space-y-3 text-xs pt-1 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Step 3: Save Your Credentials (Encrypted)
              </span>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Account Name / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. DailyTithi Production Channel"
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
                className="rounded-lg border border-slate-700 px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChannel}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                Encrypt & Connect Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
