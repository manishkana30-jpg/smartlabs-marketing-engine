import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Clock, Zap, Webhook } from "lucide-react";

export interface TriggerNodeData {
  type: "cron" | "manual" | "webhook";
  cronExpression?: string;
  timezone?: string;
  label?: string;
}

export function TriggerNode({ data }: { data: TriggerNodeData }) {
  const isCron = data.type === "cron";

  return (
    <div className="relative min-w-[240px] rounded-xl border border-indigo-500/40 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
          {isCron ? <Clock className="h-5 w-5" /> : data.type === "webhook" ? <Webhook className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Trigger Source
          </div>
          <div className="text-sm font-medium text-slate-100">
            {isCron ? "24/7 Cloud Cron" : data.type === "webhook" ? "Inbound Webhook" : "Manual Trigger"}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md bg-slate-950/60 p-2 text-xs font-mono text-slate-300">
        {isCron ? (
          <div className="flex justify-between items-center">
            <span>Schedule:</span>
            <span className="font-bold text-indigo-300">{data.cronExpression || "0 8 * * *"}</span>
          </div>
        ) : (
          <div>Instant Trigger On Demand</div>
        )}
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>TZ: {data.timezone || "UTC"}</span>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-500"
      />
    </div>
  );
}

