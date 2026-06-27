"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

function Counter({ from, to, duration, suffix = "", prefix = "" }: { from: number, to: number, duration: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(from);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // Easing function for smoother stop
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeOutQuart * (to - from) + from));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  // Formatting large numbers
  const formattedCount = new Intl.NumberFormat('en-US').format(count);

  return (
    <span ref={ref}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}

const stats = [
  { label: "Resumes Processed", value: 1200000, suffix: "+", duration: 2.5 },
  { label: "Semantic Accuracy", value: 98, suffix: ".7%", duration: 2 },
  { label: "Hiring Time Reduced", value: 85, suffix: "%", duration: 2.2 },
  { label: "Active Recruiters", value: 12000, suffix: "+", duration: 2.4 },
];

export function Statistics() {
  return (
    <section className="py-20 relative z-10 border-y border-white/5 bg-gradient-to-b from-[#030712] to-white/[0.02]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col gap-2"
            >
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                <Counter from={0} to={stat.value} duration={stat.duration} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base font-medium text-electric-blue uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
