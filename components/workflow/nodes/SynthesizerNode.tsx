import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Sparkles, Bot, Link2 } from "lucide-react";

export interface SynthesizerNodeData {
  model: string;
  provider: string;
  brandVoice: string;
  utmEnabled: boolean;
}

export function SynthesizerNode({ data }: { data: SynthesizerNodeData }) {
  return (
    <div className="relative min-w-[280px] rounded-xl border border-purple-500/40 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      {/* Input handle from Seed */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-purple-500"
      />

      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            AI Synthesis Engine
          </div>
          <div className="text-sm font-medium text-slate-100">
            Single-Source Generator
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2 rounded-md bg-slate-950/60 p-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Bot className="h-3.5 w-3.5 text-purple-400" /> Model:
          </span>
          <span className="font-semibold text-purple-300">
            {data.model || "gemini-2.0-flash"}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Voice Tone:</span>
          <span className="capitalize text-slate-200 font-medium">
            {data.brandVoice || "Authoritative"}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Link2 className="h-3 w-3" /> Auto-UTM Engine
          </span>
          <span className="text-emerald-400 font-mono">11 Channels Active</span>
        </div>
      </div>

      {/* Output handle distributing to Channels */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-purple-500"
      />
    </div>
  );
}

