import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "SmartLabs Marketing Engine | Autonomous 24/7 Multi-Channel Syndication",
  description:
    "Autonomous Single-Source Content Engine and visual DAG workflow platform with Bring-Your-Own-Key architecture.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>SmartLabs Marketing Engine • Autonomous 24/7 Cloud Traffic Acquisition</div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Next.js 15 App Router</span>
              <span>•</span>
              <span>Vercel AI SDK</span>
              <span>•</span>
              <span>Upstash QStash</span>
              <span>•</span>
              <span>AES-256 Vault</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
