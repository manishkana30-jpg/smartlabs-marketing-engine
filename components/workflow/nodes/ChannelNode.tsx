import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Platform } from "@/lib/types";
import {
  MessageSquare,
  Send,
  Pin,
  Bookmark,
  AtSign,
  Code2,
  CheckCircle2,
  Clock,
  AlertCircle,
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

export interface ChannelNodeData {
  platform: Platform;
  accountName?: string;
  isEnabled: boolean;
  status: "READY" | "DISPATCHED" | "FAILED" | "IDLE";
}

const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; icon: React.ReactNode; color: string; border: string; bg: string }
> = {
  YOUTUBE: {
    label: "YouTube Shorts & Video",
    icon: <YoutubeIcon className="h-4 w-4 text-red-500" />,
    color: "text-red-400",
    border: "border-red-500/40",
    bg: "bg-red-500/10",
  },
  WHATSAPP: {
    label: "WhatsApp Channel",
    icon: <WhatsAppIcon className="h-4 w-4 text-emerald-400" />,
    color: "text-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
  },
  TELEGRAM: {
    label: "Telegram Broadcast",
    icon: <TelegramIcon className="h-4 w-4 text-sky-400" />,
    color: "text-sky-400",
    border: "border-sky-500/40",
    bg: "bg-sky-500/10",
  },
  PINTEREST: {
    label: "Pinterest Pins",
    icon: <PinterestIcon className="h-4 w-4 text-rose-500" />,
    color: "text-rose-400",
    border: "border-rose-500/40",
    bg: "bg-rose-500/10",
  },
  REDDIT: {
    label: "Reddit Community",
    icon: <RedditIcon className="h-4 w-4 text-orange-500" />,
    color: "text-orange-400",
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
  },
  THREADS: {
    label: "Meta Threads",
    icon: <ThreadsIcon className="h-4 w-4 text-pink-400" />,
    color: "text-pink-400",
    border: "border-pink-500/40",
    bg: "bg-pink-500/10",
  },
  TWITTER: {
    label: "X / Twitter Threads",
    icon: <TwitterIcon className="h-4 w-4 text-slate-200" />,
    color: "text-slate-200",
    border: "border-slate-500/40",
    bg: "bg-slate-500/10",
  },
  LINKEDIN: {
    label: "LinkedIn Posts",
    icon: <LinkedinIcon className="h-4 w-4 text-blue-400" />,
    color: "text-blue-400",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
  },
  INSTAGRAM: {
    label: "Instagram Feed",
    icon: <InstagramIcon className="h-4 w-4 text-fuchsia-400" />,
    color: "text-fuchsia-400",
    border: "border-fuchsia-500/40",
    bg: "bg-fuchsia-500/10",
  },
  DEVTO: {
    label: "Dev.to Articles",
    icon: <Code2 className="h-4 w-4 text-cyan-400" />,
    color: "text-cyan-400",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
  },
  DISCORD: {
    label: "Discord Announcements",
    icon: <DiscordIconCustom className="h-4 w-4 text-indigo-400" />,
    color: "text-indigo-400",
    border: "border-indigo-500/40",
    bg: "bg-indigo-500/10",
  },
};

export function ChannelNode({ data }: { data: ChannelNodeData }) {
  const config = PLATFORM_CONFIG[data.platform] || {
    label: data.platform,
    icon: <Send className="h-4 w-4 text-slate-400" />,
    color: "text-slate-400",
    border: "border-slate-700",
    bg: "bg-slate-800",
  };

  return (
    <div
      className={`relative min-w-[220px] rounded-xl border ${config.border} bg-slate-900/90 p-3 shadow-lg backdrop-blur-md transition-all hover:scale-[1.02]`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-400"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${config.bg}`}>
            {config.icon}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100">{config.label}</div>
            <div className="text-[10px] text-slate-400">
              {data.accountName ? `@${data.accountName}` : "Connected"}
            </div>
          </div>
        </div>

        <span
          className={`h-2.5 w-2.5 rounded-full ${
            data.isEnabled ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-slate-600"
          }`}
          title={data.isEnabled ? "Active" : "Disabled"}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
        <div className="flex items-center gap-1 text-slate-400">
          {data.status === "DISPATCHED" ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Published
            </span>
          ) : data.status === "FAILED" ? (
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <AlertCircle className="h-3 w-3" /> Failed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3 text-slate-500" /> Ready
            </span>
          )}
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
          UTM ACTIVE
        </span>
      </div>
    </div>
  );
}
