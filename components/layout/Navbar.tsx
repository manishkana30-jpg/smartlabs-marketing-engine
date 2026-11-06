"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  GitFork,
  Radio,
  Sliders,
  TrendingUp,
} from "lucide-react";

function NavLinks() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Overview", icon: <TrendingUp className="h-4 w-4" /> },
    { href: "/workflows", label: "Visual DAG Studio", icon: <GitFork className="h-4 w-4" /> },
    { href: "/campaigns/new", label: "Single-Source Synthesizer", icon: <Sparkles className="h-4 w-4" /> },
    { href: "/settings/channels", label: "Channels & BYOK", icon: <Sliders className="h-4 w-4" /> },
  ];

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isActive
                ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-sky-400 p-0.5 shadow-lg group-hover:scale-105 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">
                SmartLabs
              </span>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[10px] font-mono font-bold text-indigo-300">
                ENGINE
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Autonomous 24/7 Single-Source Marketing
            </div>
          </div>
        </Link>

        {/* Suspense-wrapped Nav Links */}
        <Suspense
          fallback={
            <div className="flex items-center gap-2 text-xs text-slate-500">
              Loading...
            </div>
          }
        >
          <NavLinks />
        </Suspense>

        {/* Cloud Status Pill */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-[11px]">24/7 Cloud Daemon Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
