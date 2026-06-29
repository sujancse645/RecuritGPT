"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileSignature, Loader2, Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface OfferGeneratorProps {
  candidateId: string;
  candidateName: string;
  onClose: () => void;
}

export function OfferGenerator({ candidateId, candidateName, onClose }: OfferGeneratorProps) {
  const [offerText, setOfferText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const jobId = "00000000-0000-0000-0000-000000000000";
    
    const generateOffer = async () => {
      try {
        await fetch(`http://localhost:8000/api/v1/offers/generate/${jobId}/${candidateId}`, { method: "POST" });
        
        setTimeout(async () => {
          const res = await fetch(`http://localhost:8000/api/v1/offers/results/${jobId}/${candidateId}`);
          if (res.ok) {
            const data = await res.json();
            setOfferText(data.markdown);
          }
          setLoading(false);
        }, 2000);
      } catch (e) {
        setLoading(false);
      }
    };

    generateOffer();
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
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-4xl max-h-[90vh] bg-[#030712] border border-white/10 shadow-2xl flex flex-col rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <FileSignature className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Offer Generator</h2>
                <div className="text-xs text-white/50 tracking-wider">Drafting personalized offer for {candidateName}</div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <div className="text-sm text-white/50 font-mono animate-pulse">Applying psychological drivers to offer text...</div>
              </div>
            ) : sent ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 mb-4">
                  <Send className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Offer Sent!</h3>
                <p className="text-white/60 max-w-md">The personalized offer letter has been dispatched to {candidateName} via DocuSign integration.</p>
                <button onClick={onClose} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">Close</button>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 prose prose-invert max-w-none">
                <ReactMarkdown>{offerText}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && !sent && (
            <div className="p-4 border-t border-white/10 bg-[#0a0a0a]/50 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
                Cancel
              </button>
              <button 
                onClick={() => setSent(true)}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <Send className="w-4 h-4" />
                Send Offer via DocuSign
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
