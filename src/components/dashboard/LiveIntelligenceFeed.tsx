"use client";
import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

const events = [
  "Hidden gem discovered: Marcus Chen (Kubernetes expertise).",
  "Career graph updated for 24 candidates.",
  "Bias audit completed. 0% demographic bias detected.",
  "Semantic match scores recalculated.",
  "Explainability reasons generated for top 10.",
];

export function LiveIntelligenceFeed() {
  const [feed, setFeed] = useState<string[]>([events[0]]);

  useEffect(() => {
    let i = 1;
    const interval = setInterval(() => {
      setFeed(prev => {
        const next = [events[i], ...prev];
        return next.slice(0, 4); // Keep last 4
      });
      i = (i + 1) % events.length;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassPanel className="p-5 border-white/5 bg-[#030712]/40 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-cyan" />
        <span className="text-xs text-white/40 uppercase tracking-wider font-mono">Live Intelligence</span>
      </div>
      <div className="space-y-3 relative overflow-hidden h-32">
        <AnimatePresence>
          {feed.map((msg, i) => (
            <motion.div 
              key={`${msg}-${i}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-white/70 font-mono py-2 border-b border-white/5 last:border-0"
            >
              {msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}
