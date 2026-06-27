"use client";
import { useEffect, useState } from "react";
import { CandidateIntelligence } from "@/lib/data/types";
import { candidateProvider } from "@/lib/data/ApiCandidateProvider";
import { CandidateCard } from "./CandidateCard";
import { AnimatePresence } from "framer-motion";
import { ExplainabilityPanel } from "./ExplainabilityPanel";

export function CandidateGrid() {
  const [candidates, setCandidates] = useState<CandidateIntelligence[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateIntelligence | null>(null);

  useEffect(() => {
    candidateProvider.getCandidates().then(setCandidates);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        {candidates.map(candidate => (
          <CandidateCard 
            key={candidate.id} 
            candidate={candidate} 
            onExplainClick={setSelectedCandidate} 
          />
        ))}
        {candidates.length === 0 && (
          <div className="text-center mt-20">
            <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-white/50 uppercase tracking-widest font-mono">Fetching Intelligence...</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <ExplainabilityPanel 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
