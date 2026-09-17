"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

/* ─── Easing definitions ─────────────────────────────────────────────────── */
const EASE_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
const EASE_SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const headerVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/* ─── Project Data ───────────────────────────────────────────────────────── */
type TagColor = "blue" | "green" | "orange" | "purple" | "pink" | "yellow";

interface Project {
  id: string;
  number: string;
  name: string;
  image: string;
  tech: string[];
  tagColor: TagColor;
  github: string;
}

const PROJECTS: Project[] = [
  {
    id: "bun-x-astro",
    number: "01",
    name: "BUN X Astro",
    image: "/images/bun-x-astro.png",
    tech: ["Astro", "Bun", "TypeScript"],
    tagColor: "blue",
    github: "https://github.com/dev-net-abdullah/bunxastro-site-builder",
  },
  {
    id: "file-compressor",
    number: "02",
    name: "File Compressor",
    image: "/images/file-compressor-project.png",
    tech: ["Next.js", "TypeScript"],
    tagColor: "green",
    github: "https://github.com/Ali-Ahmed-269",
  },
  {
    id: "isma-ims-portal",
    number: "03",
    name: "ISMA IMS Portal",
    image: "/images/isma-ims-portal.png",
    tech: ["Next.js", "Supabase"],
    tagColor: "orange",
    github: "https://github.com/qasim-mehar/ISMA-IMS-svelte-Client",
  },
  {
    id: "pms-project",
    number: "04",
    name: "PMS Project",
    image: "/images/PMS- project.png",
    tech: ["Next.js", "Supabase", "Vercel"],
    tagColor: "purple",
    github: "https://github.com/Ali-Ahmed-269",
  },
  {
    id: "tulip-project",
    number: "05",
    name: "Tulip Guest Rooms",
    image: "/images/tulip-project.png",
    tech: ["Next.js", "Supabase"],
    tagColor: "pink",
    github: "https://github.com/Ali-Ahmed-269/TULIP-Guest-Rooms",
  },
  {
    id: "wordle-clone",
    number: "06",
    name: "Wordle Clone",
    image: "/images/wordle-project.png",
    tech: ["Next.js", "Tailwind CSS"],
    tagColor: "yellow",
    github: "https://github.com/Ali-Ahmed-269",
  },
];

/* ─── GitHub Icon ────────────────────────────────────────────────────────── */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* Helper to generate tag styles based on tagColor */
function getTagStyles(color: TagColor) {
  switch (color) {
    case "blue":
      return {
        color: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.08)",
        borderColor: "rgba(96,165,250,0.15)",
      };
    case "green":
      return {
        color: "#34d399",
        backgroundColor: "rgba(52,211,153,0.08)",
        borderColor: "rgba(52,211,153,0.15)",
      };
    case "orange":
      return {
        color: "#f97316",
        backgroundColor: "rgba(249,115,22,0.08)",
        borderColor: "rgba(249,115,22,0.15)",
      };
    case "purple":
      return {
        color: "#a78bfa",
        backgroundColor: "rgba(167,139,250,0.08)",
        borderColor: "rgba(167,139,250,0.15)",
      };
    case "pink":
      return {
        color: "#f472b6",
        backgroundColor: "rgba(244,114,182,0.08)",
        borderColor: "rgba(244,114,182,0.15)",
      };
    case "yellow":
      return {
        color: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.08)",
        borderColor: "rgba(251,191,36,0.15)",
      };
  }
}

export default function ProjectsSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [headerLinkHovered, setHeaderLinkHovered] = useState(false);

  return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-bg-primary py-24"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Background glow accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 70% 80%, rgba(249,115,22,0.04), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 flex flex-col space-y-16">
        
        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8"
        >
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-orange font-bold font-display">/</span>
              <span className="text-text-muted text-sm font-mono tracking-widest uppercase font-semibold">
                Selected Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display text-white tracking-tight leading-none">
              Projects that <span className="text-orange">speak for themselves</span>
            </h2>
          </div>

          <motion.a
            href="#"
            onMouseEnter={() => setHeaderLinkHovered(true)}
            onMouseLeave={() => setHeaderLinkHovered(false)}
            className="text-orange text-sm font-semibold tracking-wide font-sans flex items-center gap-1 self-start md:self-auto transition-colors duration-200"
            style={{ textDecoration: "none" }}
            whileHover={{ scale: 1.02 }}
          >
            View All Projects
            <motion.span
              animate={{ x: headerLinkHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              &rarr;
            </motion.span>
          </motion.a>
        </motion.div>

        {/* ── PROJECTS GRID ── */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {PROJECTS.map((project) => {
            const isHovered = hoveredCard === project.id;
            const tagStyles = getTagStyles(project.tagColor);
            const hasGithub = project.github.length > 0;

            return (
              <motion.article
                key={project.id}
                variants={cardVariants}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{
                  y: -6,
                  borderColor: "rgba(249, 115, 22, 0.4)",
                  boxShadow: "0 12px 30px rgba(249, 115, 22, 0.12)",
                }}
                transition={{ duration: 0.35, ease: EASE_SPRING }}
                className="group relative flex flex-col bg-[#111111] border border-white/10 rounded-2xl overflow-hidden"
              >
                
                {/* Image Area */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Subtle Project Number Watermark */}
                  <span className="absolute right-4 top-2 text-8xl font-black text-white/5 tracking-tighter font-display select-none pointer-events-none">
                    {project.number}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="flex-1 flex flex-col justify-between p-6 space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white font-display group-hover:text-orange transition-colors duration-300">
                      {project.name}
                    </h3>
                    
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          style={tagStyles}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* GitHub Link */}
                  <div className="pt-1">
                    {hasGithub ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20 inline-flex items-center gap-2 text-zinc-500 hover:text-orange transition-colors duration-200 group/gh"
                        style={{ textDecoration: "none" }}
                      >
                        <GitHubIcon className="w-5 h-5 transition-colors duration-200" />
                        <span
                          className="text-xs font-medium text-zinc-600 group-hover/gh:text-white transition-colors duration-200"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          View on GitHub
                        </span>
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-2 cursor-default select-none"
                        style={{ color: "#3f3f46" }}
                      >
                        <GitHubIcon className="w-5 h-5" />
                        <span
                          className="text-xs font-medium"
                          style={{
                            color: "#3f3f46",
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          View on GitHub
                        </span>
                      </span>
                    )}
                  </div>
                </div>

              </motion.article>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
