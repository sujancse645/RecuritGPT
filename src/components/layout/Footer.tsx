import React from "react";
import { Brain, Code, FileText, Shield, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#030712] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-electric-blue/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-electric-blue" />
              <span className="text-xl font-bold text-white">
                Recruit<span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-cyan">GPT</span>
              </span>
            </div>
            <p className="text-white/60 max-w-sm">
              The Enterprise AI Recruitment Operating System. Beyond Keywords. Beyond Resumes. Beyond ATS.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Code className="w-4 h-4" /> GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Powered by RecruitGPT AI.
          </p>
          <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm">
            Powered by <span className="text-white font-medium">RecruitGPT Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
