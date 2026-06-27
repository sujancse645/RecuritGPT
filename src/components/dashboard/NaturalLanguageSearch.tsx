"use client";
import { Search, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useState } from "react";

export function NaturalLanguageSearch() {
  const [query, setQuery] = useState("");

  return (
    <GlassPanel className="p-4 border-white/5 bg-[#030712]/40 backdrop-blur-md mb-6 relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-electric-blue" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask RecruitGPT to find specific traits..."
          className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30 font-medium"
        />
        <div className="p-2 bg-white/5 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
          <Search className="w-4 h-4 text-white/60" />
        </div>
      </div>
    </GlassPanel>
  );
}
