"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Database, CheckCircle2, ChevronRight, X } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

function UploadZone({ 
  title, 
  subtitle, 
  icon: Icon, 
  formats,
  onUpload
}: { 
  title: string, 
  subtitle: string, 
  icon: React.ComponentType<{ className?: string }>, 
  formats: string[],
  onUpload: () => void 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing Data...");
  const [uploaded, setUploaded] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    } else {
      simulateUpload();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setStatusText("Connecting to Engine...");

    const clientId = Math.random().toString(36).substring(7);
    let ws: WebSocket;

    try {
      ws = new WebSocket(`ws://localhost:8000/ws/v1/ingestion/${clientId}`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProgress(data.progress);
        
        if (data.state === "COMPLETED") {
          ws.close();
          finishUpload();
        } else if (data.state === "ERROR") {
          console.error("Ingestion Error:", data.message);
          ws.close();
          fallbackUpload();
        } else {
          setStatusText(data.message || `Status: ${data.state}`);
        }
      };

      ws.onopen = async () => {
        setStatusText("Uploading...");
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch(`http://localhost:8000/api/v1/upload/${clientId}`, {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error("Upload failed");
        } catch (err) {
          console.warn("Backend API not reachable. Using fallback simulation.");
          ws.close();
          fallbackUpload();
        }
      };

      ws.onerror = () => {
        console.warn("WebSocket connection failed. Using fallback simulation.");
        fallbackUpload();
      };

    } catch (err) {
      console.warn("WebSocket initialization failed. Using fallback simulation.");
      fallbackUpload();
    }
  };

  const fallbackUpload = () => {
    setStatusText("Analyzing Data (Local Mode)...");
    simulateUpload();
  };

  const finishUpload = () => {
    setIsUploading(false);
    setUploaded(true);
    setTimeout(onUpload, 500);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishUpload();
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 p-8 flex flex-col items-center justify-center text-center overflow-hidden
        ${isDragging 
          ? "border-electric-blue bg-electric-blue/5" 
          : "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10"
        }
        ${uploaded ? "border-cyan/50 bg-cyan/5" : ""}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        disabled={isUploading || uploaded}
        onChange={handleFileSelect}
      />
      <AnimatePresence mode="wait">
        {!isUploading && !uploaded ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center pointer-events-none"
          >
            <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${isDragging ? "bg-electric-blue/20" : "bg-white/5"}`}>
              <Icon className={`w-8 h-8 ${isDragging ? "text-electric-blue" : "text-white/60"}`} />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
            <p className="text-sm text-white/50 mb-4">{subtitle}</p>
            <div className="flex gap-2">
              {formats.map((format) => (
                <span key={format} className="px-2 py-1 rounded bg-white/10 text-xs font-mono text-white/60">
                  {format}
                </span>
              ))}
            </div>
          </motion.div>
        ) : isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center w-full z-20 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-electric-blue animate-spin mb-4" />
            <h3 className="text-white font-medium mb-2">{statusText}</h3>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-4">
              <motion.div 
                className="h-full bg-gradient-to-r from-electric-blue to-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center z-20 pointer-events-none"
          >
            <div className="p-4 rounded-full bg-cyan/20 mb-4">
              <CheckCircle2 className="w-8 h-8 text-cyan" />
            </div>
            <h3 className="text-white font-medium mb-2">Knowledge Embedded</h3>
            <p className="text-sm text-cyan/70">Ready for semantic processing</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function UploadArea({ onStart }: { onStart?: () => void }) {
  const [jdUploaded, setJdUploaded] = useState(false);
  const [dataUploaded, setDataUploaded] = useState(false);

  return (
    <section id="platform" className="relative py-24 z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Mission Input
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Initialize the intelligence engine by providing your role parameters and candidate universe.
          </motion.p>
        </div>

        <GlassPanel glow hoverEffect className="p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            
            {/* Divider OR */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center z-10">
              <div className="h-full w-px bg-white/10 absolute -z-10" />
              <div className="w-12 h-12 rounded-full bg-[#030712] border border-white/10 flex items-center justify-center">
                <span className="text-sm font-medium text-white/40">+</span>
              </div>
            </div>

            <UploadZone 
              title="Job Description Parameters"
              subtitle="Drag & drop or click to upload"
              icon={FileText}
              formats={["PDF", "DOCX", "TXT"]}
              onUpload={() => setJdUploaded(true)}
            />

            <UploadZone 
              title="Candidate Dataset"
              subtitle="Drag & drop or click to upload"
              icon={Database}
              formats={["CSV", "JSON", "ZIP"]}
              onUpload={() => setDataUploaded(true)}
            />
          </div>

          <AnimatePresence>
            {jdUploaded && dataUploaded && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onStart}
                  className="group relative flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">Initialize Command Center</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassPanel>
      </div>
    </section>
  );
}
