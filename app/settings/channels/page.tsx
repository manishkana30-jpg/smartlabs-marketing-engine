import React from "react";
import { ChannelConnectionsHub } from "@/components/settings/ChannelConnectionsHub";

export default function ChannelsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Channel Credentials & BYOK Vault
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Bring your own LLM API keys and configure authorized broadcast credentials for all 11 traffic acquisition platforms.
        </p>
      </div>

      <ChannelConnectionsHub />
    </div>
  );
}

