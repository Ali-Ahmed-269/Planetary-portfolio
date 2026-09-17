"use client";

import { motion, Variants } from "framer-motion";

/* ─── Easing definitions ─────────────────────────────────────────────────── */
const EASE_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

/* ─── Skills & Tools Data ────────────────────────────────────────────────── */
interface SkillBar {
  name: string;
  percentage: number;
}

interface SkillCard {
  icon: string;
  name: string;
  category: string;
}

const SKILL_BARS: SkillBar[] = [
  { name: "Next.js / React", percentage: 85 },
  { name: "TypeScript", percentage: 78 },
  { name: "Tailwind CSS", percentage: 90 },
  { name: "Three.js / WebGL", percentage: 60 },
  { name: "Supabase", percentage: 70 },
  { name: "Framer Motion / GSAP", percentage: 75 },
];

const SKILL_CARDS: SkillCard[] = [
  { icon: "⚡", name: "Next.js", category: "Framework" },
  { icon: "🔷", name: "TypeScript", category: "Language" },
  { icon: "🎨", name: "Tailwind CSS", category: "Styling" },
  { icon: "🟠", name: "Svelte", category: "Framework" },
  { icon: "🗄️", name: "Supabase", category: "Backend" },
  { icon: "🎭", name: "Framer Motion", category: "Animation" },
  { icon: "🌐", name: "Three.js", category: "3D/WebGL" },
  { icon: "🔧", name: "Git", category: "Version Control" },
  { icon: "📦", name: "Vercel", category: "Deployment" },
];

interface SkillsSectionProps {
  id?: string;
}

export default function SkillsSection({ id = "skills" }: SkillsSectionProps) {
  return (
    <section
      id={id}
      className="relative min-h-screen bg-[#111111] py-24 flex flex-col justify-center overflow-hidden"
    >
      {/* Background glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249, 115, 22, 0.04), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 flex flex-col space-y-20 relative z-10">
        
        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center text-center space-y-4 pb-8 border-b border-white/5"
        >
          <div className="flex items-center space-x-2">
            <span className="text-orange font-bold font-display">/</span>
            <span className="text-text-muted text-sm font-mono tracking-widest uppercase font-semibold">
              Skills
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-display text-white tracking-tight leading-none">
            What I bring <span className="text-orange">to the table</span>
          </h2>

          <p className="text-text-muted text-base max-w-lg font-sans">
            Technologies and tools I work with to build modern web experiences
          </p>
        </motion.div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Skill Bars */}
          <div className="flex flex-col space-y-8">
            <h3 className="text-2xl font-bold text-white font-display">
              Technical Proficiency
            </h3>

            <div className="space-y-6">
              {SKILL_BARS.map((skill, index) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center font-sans">
                    <span className="text-white font-medium text-base">
                      {skill.name}
                    </span>
                    <span className="text-orange font-semibold text-base">
                      {skill.percentage}%
                    </span>
                  </div>

                  {/* Track Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    {/* Animated Fill Bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Skill Cards Grid */}
          <div className="flex flex-col space-y-8">
            <h3 className="text-2xl font-bold text-white font-display">
              Tools & Technologies
            </h3>

            <motion.div
              variants={gridVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-3 gap-3 sm:gap-4"
            >
              {SKILL_CARDS.map((card) => (
                <motion.div
                  key={card.name}
                  variants={cardVariants}
                  whileHover={{ scale: 1.03 }}
                  className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:border-orange hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] cursor-default flex flex-col items-center justify-center space-y-2"
                >
                  <span className="text-2xl sm:text-3xl select-none">{card.icon}</span>
                  <span className="text-white font-semibold text-xs sm:text-sm block">
                    {card.name}
                  </span>
                  <span className="text-text-muted text-[9px] sm:text-[10px] font-medium font-mono uppercase tracking-wider block">
                    {card.category}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
