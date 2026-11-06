import React, { Suspense } from "react";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";

async function WorkflowHeader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="text-xs font-mono text-indigo-400">Workflow ID: {id}</div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Autonomous Pipeline Editor
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Visual DAG: Scheduled Cron → Changelog Ingestion → Structured Vercel AI SDK Synthesis → 11 Channel Fan-Out.
        </p>
      </div>
    </div>
  );
}

export default function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="text-xs text-slate-400">Loading workflow details...</div>
        }
      >
        <WorkflowHeader params={params} />
      </Suspense>

      <WorkflowCanvas />
    </div>
  );
}
