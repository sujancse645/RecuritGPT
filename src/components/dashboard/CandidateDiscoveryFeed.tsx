import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Cpu, ShieldCheck, Zap, Mic, FileSignature } from "lucide-react";
import { InterviewGuide } from "./InterviewGuide";
import { OfferGenerator } from "./OfferGenerator";

interface SemanticMatch {
  id: string;
  name: string;
  role: string;
  confidence: number;
  semantic_score: number;
  skill_coverage: number;
  exp_alignment: number;
  hiring_recommendation: string;
  strengths: string[];
  weaknesses: string[];
}

export function CandidateDiscoveryFeed() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [interviewCandidate, setInterviewCandidate] = useState<{id: string, name: string} | null>(null);
  const [offerCandidate, setOfferCandidate] = useState<{id: string, name: string} | null>(null);

  const [candidates, setCandidates] = useState<SemanticMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We use the exact Job UUID that the seed script populates
    const jobId = "00000000-0000-0000-0000-000000000000";
    
    const fetchCandidates = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/ranking/results/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          // Map backend format to UI format
          const mapped = data.results.map((c: any) => ({
            id: c.candidate_id,
            name: c.candidate_name,
            role: c.current_role,
            confidence: c.confidence_score,
            semantic_score: c.match_score,
            skill_coverage: c.match_score > 90 ? 95 : 85, // Mock UI feature from overall match
            exp_alignment: c.match_score > 90 ? 100 : 90, // Mock UI feature from overall match
            hiring_recommendation: c.hiring_recommendation,
            strengths: c.explainability?.strengths || [],
            weaknesses: c.explainability?.weaknesses || []
          }));
          setCandidates(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch live candidates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Top Semantic Matches</h2>
        <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-md">Ranked via FAISS + Structured Hybrid</span>
      </div>

      <div className="grid gap-4">
        {loading && <div className="text-white/50 text-sm animate-pulse">Fetching live semantic ranking from backend...</div>}
        {candidates.map((candidate, idx) => (
          <motion.div 
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 + (idx * 0.2) }} // Wait for SemanticSearchStatus demo to finish
            onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
            className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-electric-blue/20 flex items-center justify-center border border-electric-blue/50 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6 text-electric-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {candidate.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono tracking-wider ${
                      candidate.hiring_recommendation === 'Strong Hire' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      candidate.hiring_recommendation === 'Hire' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {candidate.hiring_recommendation}
                    </span>
                  </h3>
                  <p className="text-sm text-white/60">{candidate.role}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-electric-blue">{candidate.confidence}%</div>
                <div className="text-[10px] uppercase text-white/40 tracking-widest">Final Match Score</div>
              </div>
            </div>

            {/* Similarity Features Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
              <FeatureScore label="Semantic Vector" value={candidate.semantic_score} icon={<Cpu className="w-3 h-3" />} color="bg-purple-500" />
              <FeatureScore label="Skill Heatmap" value={candidate.skill_coverage} icon={<Zap className="w-3 h-3" />} color="bg-yellow-400" />
              <FeatureScore label="Experience Fit" value={candidate.exp_alignment} icon={<ShieldCheck className="w-3 h-3" />} color="bg-green-400" />
            </div>

            {/* Explainability Panel (Expandable) */}
            <AnimatePresence>
              {expandedId === candidate.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Key Strengths</h4>
                      <ul className="space-y-1">
                        {candidate.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Identified Gaps</h4>
                      <ul className="space-y-1">
                        {candidate.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setInterviewCandidate({ id: candidate.id, name: candidate.name });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue border border-electric-blue/30 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Mic className="w-4 h-4" />
                      Interview Guide
                    </button>
                    {(candidate.hiring_recommendation === "Strong Hire" || candidate.hiring_recommendation === "Hire") && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOfferCandidate({ id: candidate.id, name: candidate.name });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                      >
                        <FileSignature className="w-4 h-4" />
                        Extend Offer
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {interviewCandidate && (
        <InterviewGuide 
          candidateId={interviewCandidate.id}
          candidateName={interviewCandidate.name}
          onClose={() => setInterviewCandidate(null)}
        />
      )}

      {offerCandidate && (
        <OfferGenerator 
          candidateId={offerCandidate.id}
          candidateName={offerCandidate.name}
          onClose={() => setOfferCandidate(null)}
        />
      )}
    </div>
  );
}

function FeatureScore({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-black/20 rounded-lg p-2 flex flex-col gap-1">
      <div className="flex items-center gap-1 text-white/50 text-[10px] uppercase font-bold tracking-wider">
        {icon}
        {label}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-white">{value}%</span>
      </div>
      <div className="h-1 w-full bg-white/10 rounded-full mt-1">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
