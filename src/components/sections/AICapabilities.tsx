"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { BrainCircuit, Search, Database, ShieldAlert, TrendingUp, Lightbulb } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const capabilities = [
  {
    title: "Semantic Search",
    description: "Search by meaning, not keywords. Understands implied skills and context.",
    icon: Search,
    color: "#0070f3"
  },
  {
    title: "LLM Reasoning",
    description: "Multi-agent architecture evaluates candidates exactly like a senior engineer would.",
    icon: BrainCircuit,
    color: "#b026ff"
  },
  {
    title: "Vector Database",
    description: "High-dimensional embeddings for instantaneous sub-millisecond candidate retrieval.",
    icon: Database,
    color: "#00f0ff"
  },
  {
    title: "Bias Detection",
    description: "Automated real-time auditing ensures diversity and equitable hiring practices.",
    icon: ShieldAlert,
    color: "#8a2be2"
  },
  {
    title: "Career Intelligence",
    description: "Predicts candidate trajectory and tenure based on historical pattern analysis.",
    icon: TrendingUp,
    color: "#0070f3"
  },
  {
    title: "Explainable AI",
    description: "Every decision is fully transparent with clear, human-readable justification.",
    icon: Lightbulb,
    color: "#b026ff"
  }
];

function CapabilityCard({ capability, index }: { capability: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
    
    // Tilt effect calculation
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / -20;
    ref.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (ref.current) {
      ref.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
    }
  };

  const background = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${capability.color}15, transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative h-full transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        <GlassPanel className="h-full p-8 border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
          {/* Spotlight Effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background }}
            />
          )}
          
          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
              <capability.icon className="w-6 h-6 text-white/80" style={{ color: isHovered ? capability.color : undefined }} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{capability.title}</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              {capability.description}
            </p>
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}

export function AICapabilities() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 text-white"
          >
            Core Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto"
          >
            The multi-agent neural infrastructure powering next-generation talent discovery.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={capability.title} capability={capability} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
