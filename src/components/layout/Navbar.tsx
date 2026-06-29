"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Technology", href: "#technology" },
  { name: "AI Engine", href: "#ai-engine" },
  { name: "Features", href: "#features" },
  { name: "Architecture", href: "#architecture" },
];

export function Navbar({ onSignIn }: { onSignIn?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#030712]/70 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple p-[1px]">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center w-full h-full bg-[#030712] rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wide text-white">
              Recruit<span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-cyan">GPT</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-electric-blue transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </nav>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center gap-4"
          >
            <button onClick={onSignIn} className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Sign In
            </button>
            <Button variant="primary" size="sm" className="group" onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })}>
              Live Demo
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white/80 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-white/80 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-[1px] bg-white/10 my-2" />
              <div className="flex flex-col gap-4">
                <button onClick={() => { setMobileMenuOpen(false); onSignIn?.(); }} className="text-lg font-medium text-white/80 hover:text-white text-left">
                  Sign In
                </button>
                <Button variant="primary" className="w-full justify-center" onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Live Demo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
