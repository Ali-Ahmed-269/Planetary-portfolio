"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import ParticleBackground from "./ParticleBackground";
import SaturnPlanet from "./SaturnPlanet";

/* ─── Type definitions ───────────────────────────────────────────────────── */
interface StatItem {
  icon: string;
  value: string;
  label: string;
}

interface TechBadge {
  name: string;
  icon: string;
}

/* ─── Mock Data ──────────────────────────────────────────────────────────── */
const STATS: StatItem[] = [
  { icon: "🚀", value: "8+", label: "Projects Completed" },
  { icon: "👥", value: "2+", label: "Years Learning" },
  { icon: "🏆", value: "1", label: "Goal: Keep Improving" },
];

const TECH_BADGES: TechBadge[] = [
  { name: "Next.js", icon: "🌐" },
  { name: "Svelte", icon: "🔥" },
  { name: "TypeScript", icon: "📘" },
  { name: "Supabase", icon: "⚡" },
  { name: "Tailwind CSS", icon: "🎨" },
];

/* ─── Framer Motion Variants ─────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const leftItemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.8 + custom * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

export default function HeroSection() {
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector("#about");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* ── 1. PARTICLE BACKGROUND (z-0) ── */}
      <ParticleBackground />

      {/* ── 2. UNIFIED ATMOSPHERIC OVERLAY (z-[2]) ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 55% 50%, rgba(249, 115, 22, 0.05) 0%, rgba(10, 10, 10, 0.25) 50%, rgba(10, 10, 10, 0.6) 100%)",
        }}
      />

      {/* ── 3. SATURN PLANET ILLUSTRATION (z-[4]) ── */}
      <SaturnPlanet />

      {/* ── 3. MAIN CONTENT (z-[10]) ── */}
      <div className="relative z-[10] flex flex-col justify-center min-h-screen px-6 sm:px-12 py-20 max-w-full lg:max-w-[55%]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col space-y-6 md:space-y-8 text-left items-start"
        >
          {/* Label with blinking cursor */}
          <motion.div variants={leftItemVariants} className="flex items-center space-x-1">
            <span className="text-orange text-xs md:text-sm font-mono tracking-[0.2em] uppercase font-semibold">
              Frontend Developer
            </span>
            <span
              className="text-orange text-xs md:text-sm font-mono transition-opacity duration-100 font-bold"
              style={{ opacity: cursorVisible ? 1 : 0 }}
            >
              |
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={leftItemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-display leading-[1.15] md:leading-[1.1]"
          >
            I build interfaces <br />
            that feel <span className="text-orange italic font-serif font-light">alive.</span>
          </motion.h1>

          {/* Subtext description */}
          <motion.p
            variants={leftItemVariants}
            className="text-text-muted text-base md:text-lg max-w-xl leading-relaxed font-sans"
          >
            Crafting modern, fast and beautiful web experiences with Next.js,
            Svelte and modern web technologies.
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={leftItemVariants} className="flex flex-wrap gap-4 pt-2">
            <motion.a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3.5 bg-orange hover:bg-orange-dark text-white rounded-full font-medium text-sm transition-colors duration-200 shadow-lg shadow-orange/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View My Work &rarr;
            </motion.a>
            <motion.a
              href="#"
              className="px-8 py-3.5 bg-transparent border border-white/20 hover:border-white hover:bg-white hover:text-bg-primary text-white rounded-full font-medium text-sm transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download CV &darr;
            </motion.a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={leftItemVariants}
            className="pt-6 md:pt-10 border-t border-white/5 grid grid-cols-3 gap-4 w-full"
          >
            {STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col space-y-1.5 ${
                  idx > 0 ? "border-l border-white/5 pl-4 sm:pl-6" : ""
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg md:text-xl">{stat.icon}</span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-display">
                    {stat.value}
                  </span>
                </div>
                <span className="text-text-muted text-xs md:text-sm font-light">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── 5. TECH BADGES (z-[10]) ── */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[10] hidden md:flex flex-col gap-3">
        {TECH_BADGES.map((badge, idx) => (
          <motion.div
            key={badge.name}
            custom={idx}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center space-x-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#111111]/85 backdrop-blur-md border border-white/10 shadow-lg select-none whitespace-nowrap"
            whileHover={{
              scale: 1.05,
              borderColor: "rgba(249, 115, 22, 0.4)",
              boxShadow: "0 4px 20px rgba(249, 115, 22, 0.15)",
            }}
          >
            <span className="text-sm">{badge.icon}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-white font-sans tracking-wide">
              {badge.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── 6. FLOATING QUOTE CARD (z-[10]) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-24 right-[120px] max-w-[200px] px-4 py-3.5 rounded-xl bg-[#111111]/90 backdrop-blur-md border border-white/10 shadow-xl z-[10] hidden md:block"
        whileHover={{ y: -3 }}
      >
        <span className="absolute -top-3 left-3 text-3xl text-orange font-serif select-none">
          “
        </span>
        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed italic pt-1 font-sans">
          Code is not just logic, it&apos;s creativity turned into real experiences.
        </p>
        <div className="text-[9px] sm:text-[10px] font-semibold text-orange tracking-widest uppercase mt-2 font-sans">
          — Ali Ahmed Khan
        </div>
      </motion.div>

      {/* ── 7. SCROLL INDICATOR (z-[10]) ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex justify-center">
        <a
          href="#about"
          onClick={handleScrollClick}
          className="flex flex-col items-center space-y-1.5 group select-none text-text-muted hover:text-white transition-colors duration-200"
        >
          <span className="text-xs font-mono tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xs font-bold"
          >
            &darr;
          </motion.span>
        </a>
      </div>
    </section>
  );
}
