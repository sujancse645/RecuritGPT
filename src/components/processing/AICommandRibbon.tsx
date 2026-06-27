"use client";
import { motion } from "framer-motion";
import { AppState } from "@/app/page";

export function AICommandRibbon({ appState }: { appState: AppState }) {
  return (
    <div className="absolute top-0 inset-x-0 h-12 border-b border-white/10 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center gap-8 text-xs font-mono tracking-widest text-white/50 z-50">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
        LLM CORE: ONLINE
      </div>
      <div className="hidden md:block w-px h-4 bg-white/10" />
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" />
        VECTOR SEARCH: ONLINE
      </div>
      <div className="hidden md:block w-px h-4 bg-white/10" />
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
        REASONING AGENT: ACTIVE
      </div>
      <div className="hidden md:block w-px h-4 bg-white/10" />
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        BIAS AUDITOR: ACTIVE
      </div>
    </div>
  );
}
