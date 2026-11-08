import React from "react";
import { ChannelConnectionsHub } from "@/components/settings/ChannelConnectionsHub";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Channel Connections & Optional BYOK
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          SmartLabs runs 100% free with the built-in keyless synthesizer. You can optionally connect your own Gemini or OpenAI API keys and authorized social channel tokens below.
        </p>
      </div>

      <ChannelConnectionsHub />
    </div>
  );
}

