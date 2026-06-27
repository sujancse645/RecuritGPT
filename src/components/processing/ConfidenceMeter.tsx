"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppState } from "@/app/page";

export function ConfidenceMeter({ appState }: { appState: AppState }) {
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    let target = 0;
    switch (appState) {
      case "MISSION_READY": target = 10; break;
      case "AI_INITIALIZING": target = 35; break;
      case "UNDERSTANDING_ROLE": target = 65; break;
      case "BUILDING_INTELLIGENCE": target = 85; break;
      case "GENERATING_RESULTS": target = 97; break;
    }

    const interval = setInterval(() => {
      setConfidence(prev => {
        if (prev < target) return prev + 1;
        if (appState === "GENERATING_RESULTS" && prev >= 97 && prev < 98.7) {
          return prev + 0.1;
        }
        return prev;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [appState]);

  return (
    <div className="absolute top-8 right-8 z-40 text-right">
      <div className="text-xs font-mono text-electric-blue uppercase tracking-widest mb-1">Hiring Intelligence</div>
      <div className="text-6xl font-bold text-white tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(0,112,243,0.5)]">
        {confidence.toFixed(1)}<span className="text-4xl text-white/50">%</span>
      </div>
    </div>
  );
}
