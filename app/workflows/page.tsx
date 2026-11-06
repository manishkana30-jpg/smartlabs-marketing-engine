import React from "react";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Visual Workflow Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Construct and monitor autonomous marketing DAGs with cron triggers, content seeds, AI synthesis, and channel fan-outs.
          </p>
        </div>
      </div>

      <WorkflowCanvas />
    </div>
  );
}

