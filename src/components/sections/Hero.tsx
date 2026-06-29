"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { Sparkles, ChevronRight, Cpu } from "lucide-react";

const badges = [
  "Semantic Search",
  "LLM Intelligence",
  "Explainable AI",
  "Bias-Free Hiring",
  "Vector Search",
  "Career Intelligence"
];

export function Hero({ onStart }: { onStart?: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden z-10">
      <div className="container mx-auto px-6 text-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-electric-blue/30 bg-electric-blue/10 text-electric-blue text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>RecruitGPT Core 2.0 Now Available</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">Recruit</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-cyan to-neon-purple animate-gradient-x">
            GPT
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-3xl text-white/80 font-medium mb-4"
        >
          Recruitment Intelligence Platform
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12"
        >
          Beyond Keywords. Beyond Resumes. Beyond ATS. <br className="hidden md:block" />
          <span className="text-white">AI that understands people—not just profiles.</span>
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-16 max-w-4xl mx-auto"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
              <AnimatedBadge>{badge}</AnimatedBadge>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button size="xl" className="group min-w-[240px]" onClick={onStart}>
            <Cpu className="w-5 h-5 mr-2 text-white" />
            <span className="tracking-wide">Start AI Hiring</span>
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </Button>
          
          <Button variant="ghost" size="lg" className="min-w-[200px]" onClick={() => document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' })}>
            View Architecture
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
