import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Rss, Globe, FileText } from "lucide-react";

export interface SeedNodeData {
  sourceType: "rss" | "url" | "manual";
  sourceUrl?: string;
  topic?: string;
  targetLandingUrl: string;
}

export function SeedNode({ data }: { data: SeedNodeData }) {
  return (
    <div className="relative min-w-[260px] max-w-[300px] rounded-xl border border-sky-500/40 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      {/* Input handle from Trigger */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-sky-500"
      />

      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
          {data.sourceType === "rss" ? (
            <Rss className="h-5 w-5" />
          ) : data.sourceType === "url" ? (
            <Globe className="h-5 w-5" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
            Content Seed
          </div>
          <div className="text-sm font-medium text-slate-100">
            {data.sourceType === "rss"
              ? "RSS Feed Monitor"
              : data.sourceType === "url"
              ? "Changelog Scraper"
              : "Manual Seed Topic"}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 rounded-md bg-slate-950/60 p-2.5 text-xs">
        <div className="truncate text-slate-300 font-medium">
          {data.topic || data.sourceUrl || "Daily Feature Announcement"}
        </div>
        <div className="truncate text-[11px] text-slate-400">
          Target: <span className="text-sky-300 underline">{data.targetLandingUrl || "https://smartlabs.ai"}</span>
        </div>
      </div>

      {/* Output handle to Synthesizer */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-sky-500"
      />
    </div>
  );
}

