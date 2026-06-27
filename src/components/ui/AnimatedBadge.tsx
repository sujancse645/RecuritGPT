"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBadgeProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  active?: boolean;
}

export function AnimatedBadge({ children, className, active = false, ...props }: AnimatedBadgeProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.05 }}
      className={cn(
        "relative group inline-flex items-center justify-center px-4 py-2 rounded-full cursor-pointer transition-all duration-300",
        "bg-white/5 border border-white/10 backdrop-blur-md",
        "hover:bg-white/10 hover:border-electric-blue/50",
        active && "bg-electric-blue/10 border-electric-blue/50 text-white",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-electric-blue via-neon-purple to-cyan blur-sm opacity-50" />
      </div>
      <span className="relative z-10 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
        {children}
      </span>
    </motion.div>
  );
}
