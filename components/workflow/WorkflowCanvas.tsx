"use client";

import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
} from "@xyflow/react";
import { Platform } from "@prisma/client";
import { Play, Save, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { TriggerNode } from "./nodes/TriggerNode";
import { SeedNode } from "./nodes/SeedNode";
import { SynthesizerNode } from "./nodes/SynthesizerNode";
import { ChannelNode } from "./nodes/ChannelNode";

const nodeTypes = {
  trigger: TriggerNode,
  seed: SeedNode,
  synthesizer: SynthesizerNode,
  channel: ChannelNode,
};

const initialNodes: Node[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 40, y: 350 },
    data: {
      type: "cron",
      cronExpression: "0 8 * * *",
      timezone: "UTC",
    },
  },
  {
    id: "seed-1",
    type: "seed",
    position: { x: 340, y: 350 },
    data: {
      sourceType: "url",
      topic: "SmartLabs Autonomous 24/7 Engine v2.0 Release",
      targetLandingUrl: "https://smartlabs.ai/engine",
    },
  },
  {
    id: "synth-1",
    type: "synthesizer",
    position: { x: 680, y: 330 },
    data: {
      model: "gemini-2.0-flash",
      provider: "GOOGLE_AI",
      brandVoice: "authoritative",
      utmEnabled: true,
    },
  },
  // Fan-out Channels
  {
    id: "ch-youtube",
    type: "channel",
    position: { x: 1060, y: 40 },
    data: { platform: Platform.YOUTUBE, accountName: "SmartLabsHQ", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-whatsapp",
    type: "channel",
    position: { x: 1060, y: 120 },
    data: { platform: Platform.WHATSAPP, accountName: "smartlabs-channel", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-telegram",
    type: "channel",
    position: { x: 1060, y: 200 },
    data: { platform: Platform.TELEGRAM, accountName: "smartlabs_news", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-pinterest",
    type: "channel",
    position: { x: 1060, y: 280 },
    data: { platform: Platform.PINTEREST, accountName: "SmartLabsMarketing", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-reddit",
    type: "channel",
    position: { x: 1060, y: 360 },
    data: { platform: Platform.REDDIT, accountName: "u/SmartLabsEngine", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-threads",
    type: "channel",
    position: { x: 1060, y: 440 },
    data: { platform: Platform.THREADS, accountName: "smartlabs.ai", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-twitter",
    type: "channel",
    position: { x: 1060, y: 520 },
    data: { platform: Platform.TWITTER, accountName: "SmartLabsAI", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-linkedin",
    type: "channel",
    position: { x: 1060, y: 600 },
    data: { platform: Platform.LINKEDIN, accountName: "smartlabs-technologies", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-instagram",
    type: "channel",
    position: { x: 1060, y: 680 },
    data: { platform: Platform.INSTAGRAM, accountName: "smartlabs.official", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-devto",
    type: "channel",
    position: { x: 1060, y: 760 },
    data: { platform: Platform.DEVTO, accountName: "smartlabsdev", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-discord",
    type: "channel",
    position: { x: 1060, y: 840 },
    data: { platform: Platform.DISCORD, accountName: "Announcements Hook", isEnabled: true, status: "READY" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-trig-seed",
    source: "trigger-1",
    target: "seed-1",
    animated: true,
    style: { stroke: "#6366f1", strokeWidth: 2 },
  },
  {
    id: "e-seed-synth",
    source: "seed-1",
    target: "synth-1",
    animated: true,
    style: { stroke: "#38bdf8", strokeWidth: 2 },
  },
  // Synthesizer to Channels
  { id: "e-synth-yt", source: "synth-1", target: "ch-youtube", animated: true },
  { id: "e-synth-wa", source: "synth-1", target: "ch-whatsapp", animated: true },
  { id: "e-synth-tg", source: "synth-1", target: "ch-telegram", animated: true },
  { id: "e-synth-pin", source: "synth-1", target: "ch-pinterest", animated: true },
  { id: "e-synth-red", source: "synth-1", target: "ch-reddit", animated: true },
  { id: "e-synth-th", source: "synth-1", target: "ch-threads", animated: true },
  { id: "e-synth-tw", source: "synth-1", target: "ch-twitter", animated: true },
  { id: "e-synth-li", source: "synth-1", target: "ch-linkedin", animated: true },
  { id: "e-synth-ig", source: "synth-1", target: "ch-instagram", animated: true },
  { id: "e-synth-dev", source: "synth-1", target: "ch-devto", animated: true },
  { id: "e-synth-disc", source: "synth-1", target: "ch-discord", animated: true },
];

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Trigger interactive dispatch simulation
  const handleTestDispatch = () => {
    setIsSimulating(true);
    setSimulationComplete(false);

    // Apply glowing pulsing class to all edges
    setEdges((prev) =>
      prev.map((edge) => ({
        ...edge,
        className: "pulsing-edge",
      }))
    );

    // Simulate synthesis and sequential channel completion
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.type === "channel") {
            return {
              ...node,
              data: {
                ...node.data,
                status: "DISPATCHED",
              },
            };
          }
          return node;
        })
      );
      setIsSimulating(false);
      setSimulationComplete(true);

      // Reset pulsing after 4 seconds
      setTimeout(() => {
        setEdges((prev) =>
          prev.map((edge) => ({
            ...edge,
            className: undefined,
          }))
        );
      }, 4000);
    }, 2500);
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSimulationComplete(false);
    setIsSimulating(false);
  };

  const handleSave = () => {
    setSaveStatus("Saving workflow...");
    setTimeout(() => {
      setSaveStatus("Saved to Cloud Database ✓");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="relative h-[820px] w-full rounded-2xl border border-slate-800 bg-[#080c14] overflow-hidden shadow-2xl">
      {/* Canvas Top Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/80 p-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">
              Autonomous Growth Engine DAG
            </h2>
            <p className="text-xs text-slate-400">
              Visual pipeline: 24/7 Cloud Cron → Changelog Seed → Gemini Synthesizer → 11 Channels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs font-medium text-emerald-400 animate-pulse">
              {saveStatus}
            </span>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
            title="Reset Canvas"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-900/60 transition-all"
          >
            <Save className="h-3.5 w-3.5" /> Save DAG
          </button>

          <button
            onClick={handleTestDispatch}
            disabled={isSimulating}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition-all ${
              isSimulating
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 shadow-indigo-500/20"
            }`}
          >
            {isSimulating ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Synthesizing & Dispatching...
              </>
            ) : simulationComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                11 Channels Dispatched!
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Simulate Cloud Dispatch
              </>
            )}
          </button>
        </div>
      </div>

      {/* React Flow Core */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300" />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "trigger") return "#6366f1";
            if (n.type === "seed") return "#38bdf8";
            if (n.type === "synthesizer") return "#a855f7";
            return "#10b981";
          }}
          className="!bg-slate-950/90 !border-slate-800"
        />
      </ReactFlow>
    </div>
  );
}
