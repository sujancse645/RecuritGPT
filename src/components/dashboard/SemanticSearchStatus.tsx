"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, Zap, CheckCircle, Loader2 } from "lucide-react";

export function SemanticSearchStatus() {
  const [status, setStatus] = useState<"idle" | "embedding" | "searching" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Ready for Semantic Search");

  useEffect(() => {
    // In a real implementation, this would connect to the WebSocket.
    // Simulating the WebSocket events for the demo based on the backend events:
    // EventType.EmbeddingStarted, EventType.SemanticSearchStarted, etc.
    const runDemo = async () => {
      setStatus("embedding");
      setMessage("Generating candidate embeddings (SentenceTransformers)...");
      setProgress(10);
      await new Promise(r => setTimeout(r, 1000));
      setProgress(30);
      await new Promise(r => setTimeout(r, 1000));
      setProgress(70);
      setMessage("Indexing into FAISS Vector Database...");
      await new Promise(r => setTimeout(r, 1500));
      
      setStatus("searching");
      setProgress(10);
      setMessage("Preparing Semantic Query...");
      await new Promise(r => setTimeout(r, 1000));
      setProgress(40);
      setMessage("Searching Vector Database...");
      await new Promise(r => setTimeout(r, 1000));
      setProgress(70);
      setMessage("Computing Similarity Features...");
      await new Promise(r => setTimeout(r, 1000));
      
      setStatus("complete");
      setProgress(100);
      setMessage("Retrieved top semantic matches.");
    };

    runDemo();
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-electric-blue" />
        <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Vector Engine Status</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">{message}</span>
          <span className="font-mono text-electric-blue">{progress}%</span>
        </div>
        
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-electric-blue"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
          <StatusBadge active={status === "embedding"} completed={status === "searching" || status === "complete"} label="Embeddings" icon={<Database className="w-3 h-3" />} />
          <StatusBadge active={status === "searching"} completed={status === "complete"} label="FAISS Search" icon={<Search className="w-3 h-3" />} />
          <StatusBadge active={status === "complete"} completed={status === "complete"} label="Hybrid Ranking" icon={<Zap className="w-3 h-3" />} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ active, completed, label, icon }: { active: boolean, completed: boolean, label: string, icon: React.ReactNode }) {
  let bg = "bg-white/5 text-white/30";
  if (completed) bg = "bg-green-500/20 text-green-400 border border-green-500/30";
  else if (active) bg = "bg-electric-blue/20 text-electric-blue border border-electric-blue/30 animate-pulse";
  
  return (
    <div className={`flex items-center gap-1.5 text-[10px] uppercase font-bold px-2 py-1 rounded-full ${bg} transition-colors`}>
      {completed ? <CheckCircle className="w-3 h-3" /> : active ? <Loader2 className="w-3 h-3 animate-spin" /> : icon}
      {label}
    </div>
  );
}
