"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Database, HardDrive, FileJson, Cloud, Loader2, CheckCircle2 } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const sources = [
  { name: "LinkedIn Recruiter", icon: Briefcase, color: "text-[#0077b5]" },
  { name: "Workday ATS", icon: Cloud, color: "text-[#005cb9]" },
  { name: "PostgreSQL", icon: Database, color: "text-[#336791]" },
  { name: "MongoDB", icon: Database, color: "text-[#47A248]" },
  { name: "Google Drive", icon: HardDrive, color: "text-[#FFD04B]" },
  { name: "JSON API", icon: FileJson, color: "text-white/80" },
];

function ImportCard({ source, index }: { source: any, index: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = () => {
    if (status !== "idle") return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 2000 + Math.random() * 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassPanel
        hoverEffect
        onClick={handleClick}
        className="cursor-pointer p-6 h-full flex flex-col items-center justify-center gap-4 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 rounded-full scale-150 group-hover:scale-175 transition-transform duration-500 blur-md opacity-0 group-hover:opacity-100" />
          <source.icon className={`w-8 h-8 relative z-10 transition-colors ${status === "success" ? "text-cyan" : source.color}`} />
        </div>
        
        <div className="text-center">
          <h4 className="text-white font-medium text-sm mb-1">{source.name}</h4>
          <div className="h-4">
            {status === "idle" && (
              <span className="text-xs text-white/40 group-hover:text-electric-blue transition-colors">
                Connect Source
              </span>
            )}
            {status === "loading" && (
              <span className="text-xs text-white/60 flex items-center justify-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-electric-blue" /> Synchronizing...
              </span>
            )}
            {status === "success" && (
              <span className="text-xs text-cyan flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

export function ImportSection() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Universal Intelligence Ingestion
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            Connect existing systems to our semantic processing pipeline. 
            RecruitGPT automatically builds vector embeddings from any data source.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {sources.map((source, index) => (
            <ImportCard key={source.name} source={source} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
