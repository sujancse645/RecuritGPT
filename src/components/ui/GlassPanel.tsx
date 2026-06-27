import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, children, hoverEffect = false, glow = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden",
          hoverEffect && "transition-all duration-300 hover:bg-white/10 hover:border-white/20",
          className
        )}
        whileHover={hoverEffect ? { y: -5 } : undefined}
        {...props}
      >
        {glow && (
          <div className="absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100" style={{
            background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)"
          }} />
        )}
        <div className="relative z-10">{children as React.ReactNode}</div>
      </motion.div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";
