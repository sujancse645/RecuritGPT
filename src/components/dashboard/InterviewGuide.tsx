"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Brain, ShieldAlert, Loader2 } from "lucide-react";

interface InterviewQuestion {
  id: string;
  question_text: string;
  expected_answer: string;
  focus_area: string;
  difficulty: string;
}

interface InterviewGuideProps {
  candidateId: string;
  candidateName: string;
  onClose: () => void;
}

export function InterviewGuide({ candidateId, candidateName, onClose }: InterviewGuideProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this job_id comes from context.
    const jobId = "00000000-0000-0000-0000-000000000000";
    
    const fetchGuide = async () => {
      try {
        // Trigger generation
        await fetch(`http://localhost:8000/api/v1/interviews/generate/${jobId}/${candidateId}`, { method: "POST" });
        
        // Simulate waiting for background task (WebSocket normally)
        setTimeout(async () => {
          const res = await fetch(`http://localhost:8000/api/v1/interviews/results/${jobId}/${candidateId}`);
          if (res.ok) {
            const data = await res.json();
            setQuestions(data.results);
          }
          setLoading(false);
        }, 2000);
      } catch (e) {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [candidateId]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-3xl max-h-[85vh] bg-[#030712] border border-white/10 shadow-2xl flex flex-col rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-electric-blue/20 rounded-lg">
                <Mic className="w-5 h-5 text-electric-blue" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Targeted Interview Guide</h2>
                <div className="text-xs text-white/50 tracking-wider">AI-Generated specifically for {candidateName}</div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto hidden-scrollbar p-6">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-electric-blue animate-spin" />
                <div className="text-sm text-white/50 font-mono animate-pulse">Generating personalized interview rubric based on candidate weaknesses...</div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center text-white/50">Failed to load interview guide.</div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <motion.div 
                    key={q.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {q.focus_area === "Gap Assessment" ? (
                          <ShieldAlert className="w-4 h-4 text-red-400" />
                        ) : (
                          <Brain className="w-4 h-4 text-electric-blue" />
                        )}
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ${
                          q.focus_area === "Gap Assessment" ? "bg-red-500/20 text-red-400" : "bg-electric-blue/20 text-electric-blue"
                        }`}>
                          {q.focus_area}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase text-white/40 border border-white/10 px-2 py-0.5 rounded-sm">
                        {q.difficulty}
                      </span>
                    </div>
                    
                    <h4 className="text-base font-semibold text-white mb-4 leading-relaxed">
                      "{q.question_text}"
                    </h4>
                    
                    <div className="bg-black/30 p-4 rounded-lg border-l-2 border-green-500/50">
                      <div className="text-[10px] uppercase text-green-400 font-bold mb-1 tracking-wider">Expected Answer Rubric</div>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {q.expected_answer}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
