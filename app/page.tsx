import React from "react";
import Link from "next/link";
import {
  Sparkles,
  GitFork,
  Radio,
  Sliders,
  TrendingUp,
  Clock,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
  ArrowRight,
  Send,
  Layers,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Radio className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
            24/7 Server-to-Server Autonomous Content Machine
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Synthesize once. Dispatch to all <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400">11 traffic networks</span> automatically.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            SmartLabs Marketing Engine runs 24/7 in the cloud even when your PC is powered off. It converts changelogs and articles into platform-native videos, threads, posts, and articles with trackable UTM attribution.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/campaigns/new"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              New Single-Source Campaign
            </Link>

            <Link
              href="/workflows"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <GitFork className="h-4 w-4 text-sky-400" />
              Open Visual DAG Studio
            </Link>

            <Link
              href="/settings/channels"
              className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-all"
            >
              <Sliders className="h-4 w-4 text-slate-400" />
              BYOK & Channels
            </Link>
          </div>
        </div>

        {/* Ambient Gradient Blur Background */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute right-40 -bottom-20 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active Distribution Channels</span>
            <Layers className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">11 Networks</div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> YouTube, X, Reddit, WhatsApp, Telegram, etc.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Cloud Queue Status</span>
            <Zap className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">Upstash QStash</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Serverless cron with 3x retry backoff
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Idle Server Cost</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">$0.00 / Month</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Zero idle containers or standby VMs
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Security Architecture</span>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">AES-256-GCM</div>
          <div className="mt-1 text-[11px] text-emerald-400">
            Encrypted OAuth & Token Vault
          </div>
        </div>
      </div>

      {/* Recent Campaign Runs Table & Live Pipeline Status */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Autonomous Campaign Executions
            </h2>
            <p className="text-xs text-slate-400">
              Recent serverless dispatches with channel-level delivery status
            </p>
          </div>
          <Link
            href="/campaigns/new"
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Create New <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Campaign Topic</th>
                <th className="pb-3">Target Landing Page</th>
                <th className="pb-3">Channels</th>
                <th className="pb-3">Execution Mode</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 font-semibold text-white">
                  Autonomous Marketing Engine v2.0 Launch
                </td>
                <td className="py-3 text-indigo-400 font-mono text-[11px]">
                  https://smartlabs.ai/engine?utm_source=...
                </td>
                <td className="py-3">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    11 / 11 Dispatched
                  </span>
                </td>
                <td className="py-3 text-slate-400">Cloud Cron (08:00 UTC)</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                </td>
                <td className="py-3 text-slate-400">Today at 08:00 UTC</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 font-semibold text-white">
                  Vercel AI SDK + Gemini 2.0 Flash Benchmark Case Study
                </td>
                <td className="py-3 text-indigo-400 font-mono text-[11px]">
                  https://smartlabs.ai/blog/gemini-speed
                </td>
                <td className="py-3">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                    Dev.to, Reddit, X, LinkedIn
                  </span>
                </td>
                <td className="py-3 text-slate-400">Single-Source Studio</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                </td>
                <td className="py-3 text-slate-400">Yesterday at 14:22 UTC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
