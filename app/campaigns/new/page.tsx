import React from "react";
import { SingleSourcePreviewEditor } from "@/components/campaigns/SingleSourcePreviewEditor";

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Single-Source Campaign Studio
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Input your seed topic or changelog once. Review and edit authentic live previews across all 11 platforms before autonomous dispatch.
        </p>
      </div>

      <SingleSourcePreviewEditor />
    </div>
  );
}

