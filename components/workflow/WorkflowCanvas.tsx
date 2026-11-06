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
} from "@xyflow/react";
import { Platform } from "@/lib/types";
import {
  Play,
  Save,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  X,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  Zap,
} from "lucide-react";
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
      label: "Daily Cron Trigger (08:00 AM UTC)",
    },
  },
  {
    id: "seed-1",
    type: "seed",
    position: { x: 340, y: 350 },
    data: {
      sourceType: "url",
      topic: "SmartLabs Autonomous Content Engine v2.5",
      targetLandingUrl: "https://smartlabs.ai/engine",
    },
  },
  {
    id: "synth-1",
    type: "synthesizer",
    position: { x: 680, y: 330 },
    data: {
      model: "Built-In Keyless / Gemini 2.0 Flash",
      provider: "SMARTLABS_INTERNAL",
      brandVoice: "Growth Hacker",
      utmEnabled: true,
    },
  },
  // Branching Channel Nodes
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
    data: { platform: Platform.WHATSAPP, accountName: "Growth Broadcast", isEnabled: true, status: "READY" },
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
    data: { platform: Platform.PINTEREST, accountName: "SmartLabsPins", isEnabled: true, status: "READY" },
  },
  {
    id: "ch-reddit",
    type: "channel",
    position: { x: 1060, y: 360 },
    data: { platform: Platform.REDDIT, accountName: "u/SmartLabsFounder", isEnabled: true, status: "READY" },
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
    data: { platform: Platform.LINKEDIN, accountName: "smartlabs-tech", isEnabled: true, status: "READY" },
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
    data: { platform: Platform.DISCORD, accountName: "Announcements Webhook", isEnabled: true, status: "READY" },
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
  // Fan-out to all channels
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

  // Slide-Over Inspector State
  const [selectedNode, setSelectedNode] = useState<Node | null>(initialNodes[0]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const handleTestDispatch = () => {
    setIsSimulating(true);
    setSimulationComplete(false);

    // Apply glowing pulsing lines to all connectors
    setEdges((prev) =>
      prev.map((edge) => ({
        ...edge,
        className: "pulsing-edge",
      }))
    );

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

      setTimeout(() => {
        setEdges((prev) =>
          prev.map((edge) => ({
            ...edge,
            className: undefined,
          }))
        );
      }, 4000);
    }, 2200);
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
      setSaveStatus("Saved to Local SQLite ✓");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 600);
  };

  return (
    <div className="relative h-[820px] w-full rounded-2xl border border-slate-800 bg-[#080c14] overflow-hidden shadow-2xl">
      {/* Canvas Top Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/90 p-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Autonomous Growth Engine DAG
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-mono text-indigo-300">
                n8n/Make Style
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any node to open the Slide-Over Inspector. Click Run to pulse connectors.
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
                Executing Pipeline...
              </>
            ) : simulationComplete ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                11 Channels Dispatched!
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                Run Workflow
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
        onNodeClick={handleNodeClick}
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

      {/* Slide-Over Node Inspector */}
      {selectedNode && (
        <div className="absolute top-20 right-4 bottom-4 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl z-20 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                  Node Inspector
                </span>
                <h3 className="text-sm font-bold text-white capitalize">
                  {selectedNode.type} Node
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Run Status Pill */}
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Run Status:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> Ready / Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Last Execution:</span>
                <span className="text-slate-200 font-mono text-[11px]">Today at 08:00 UTC</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Execution Latency:</span>
                <span className="text-slate-200 font-mono text-[11px]">42ms</span>
              </div>
            </div>

            {/* Retry Policy */}
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-400" /> Retry Policy
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Upstash QStash 3x exponential backoff (10s, 30s, 90s). Dead-letter queue enabled.
              </p>
            </div>

            {/* Node Properties */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-300">Node Properties</div>
              <pre className="rounded-lg bg-slate-950 p-2.5 font-mono text-[10px] text-slate-300 overflow-x-auto border border-slate-800">
                {JSON.stringify(selectedNode.data, null, 2)}
              </pre>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500">
              SmartLabs Marketing Engine • Node ID: {selectedNode.id}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
