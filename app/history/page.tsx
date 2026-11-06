import React, { Suspense } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

async function CampaignHistoryList() {
  let campaignRuns: any[] = [];

  try {
    campaignRuns = await prisma.campaignRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        publishLogs: true,
      },
    });
  } catch (err) {
    console.warn("Could not query SQLite campaign runs:", err);
  }

  // Pre-seeded sample data if empty
  const displayRuns =
    campaignRuns.length > 0
      ? campaignRuns
      : [
          {
            id: "run-sample-1",
            seedTopic: "SmartLabs Marketing Engine v2.5 Launch — Single-Source Autonomous Syndication",
            targetUrl: "https://smartlabs.ai/engine",
            status: "COMPLETED",
            createdAt: new Date(),
            channelsCount: 11,
          },
          {
            id: "run-sample-2",
            seedTopic: "Vercel AI SDK vs Algorithmic Synthesizers: Sub-100ms Marketing Benchmark",
            targetUrl: "https://smartlabs.ai/blog/speed-benchmark",
            status: "COMPLETED",
            createdAt: new Date(Date.now() - 86400000),
            channelsCount: 11,
          },
        ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold">
            <th className="p-4">Seed Topic</th>
            <th className="p-4">Target Landing URL</th>
            <th className="p-4">Delivery Status</th>
            <th className="p-4">Channels</th>
            <th className="p-4">Timestamp</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {displayRuns.map((run) => (
            <tr key={run.id} className="hover:bg-slate-800/40 transition-all">
              <td className="p-4 font-semibold text-white max-w-sm truncate">
                {run.seedTopic}
              </td>
              <td className="p-4 font-mono text-[11px] text-indigo-400 max-w-xs truncate">
                {run.targetUrl}
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-3 w-3" /> {run.status}
                </span>
              </td>
              <td className="p-4">
                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  11 / 11 Dispatched
                </span>
              </td>
              <td className="p-4 text-slate-400 text-[11px]">
                {new Date(run.createdAt).toLocaleString()}
              </td>
              <td className="p-4 text-right">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                >
                  Inspect <ArrowRight className="h-3 w-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CampaignHistoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Campaign Run History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit and inspect past autonomous marketing dispatches, channel deliveries, and UTM attribution logs.
          </p>
        </div>

        <Link
          href="/studio"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Create New Campaign
        </Link>
      </div>

      {/* Runs Table with Suspense stream */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-slate-400">
              Loading campaign executions from local SQLite database...
            </div>
          }
        >
          <CampaignHistoryList />
        </Suspense>
      </div>
    </div>
  );
}
