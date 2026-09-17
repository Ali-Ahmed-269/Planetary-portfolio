"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Easing constants ───────────────────────────────────────────────────── */
const EASE_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
const EASE_SPRING: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const leftContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const leftItemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const rightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_SPRING } },
};

const techContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const techCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};

/* ─── Tech Stack Data ────────────────────────────────────────────────────── */
interface TechItem {
  name: string;
  icon: string;
  color: string;
}

const TECH_STACK: TechItem[] = [
  { name: "Next.js",       icon: "🌐", color: "#ffffff" },
  { name: "Svelte",        icon: "🔥", color: "#ff6600" },
  { name: "React",         icon: "⚛️",  color: "#61dafb" },
  { name: "TypeScript",    icon: "📘", color: "#3178c6" },
  { name: "Supabase",      icon: "⚡", color: "#3ecf8e" },
  { name: "Tailwind",      icon: "🎨", color: "#38bdf8" },
  { name: "Framer Motion", icon: "🎬", color: "#cc66ff" },
  { name: "Git",           icon: "🔀", color: "#f14e32" },
];

/* ─── Code Editor Lines (visual only — not real executable code) ─────────── */
interface CodePart {
  text: string;
  color: string;
}

interface CodeLine {
  indent: number;
  parts: CodePart[];
}

const CODE_LINES: CodeLine[] = [
  { indent: 0, parts: [{ text: "import", color: "#c678dd" }, { text: " { motion }", color: "#abb2bf" }, { text: " from", color: "#c678dd" }, { text: " 'framer-motion'", color: "#98c379" }] },
  { indent: 0, parts: [{ text: "import", color: "#c678dd" }, { text: " React", color: "#e06c75" }, { text: " from", color: "#c678dd" }, { text: " 'react'", color: "#98c379" }] },
  { indent: 0, parts: [{ text: "", color: "" }] },
  { indent: 0, parts: [{ text: "const", color: "#c678dd" }, { text: " Portfolio", color: "#e5c07b" }, { text: " = () => {", color: "#abb2bf" }] },
  { indent: 1, parts: [{ text: "return", color: "#c678dd" }, { text: " (", color: "#abb2bf" }] },
  { indent: 2, parts: [{ text: "<", color: "#e06c75" }, { text: "motion.div", color: "#e06c75" }] },
  { indent: 3, parts: [{ text: "initial", color: "#d19a66" }, { text: "={{ opacity: ", color: "#abb2bf" }, { text: "0", color: "#d19a66" }, { text: " }}", color: "#abb2bf" }] },
  { indent: 3, parts: [{ text: "animate", color: "#d19a66" }, { text: "={{ opacity: ", color: "#abb2bf" }, { text: "1", color: "#d19a66" }, { text: " }}", color: "#abb2bf" }] },
  { indent: 2, parts: [{ text: ">", color: "#e06c75" }] },
  { indent: 3, parts: [{ text: "<", color: "#e06c75" }, { text: "Hero", color: "#61aeee" }, { text: " />", color: "#e06c75" }] },
  { indent: 3, parts: [{ text: "<", color: "#e06c75" }, { text: "About", color: "#61aeee" }, { text: " />", color: "#e06c75" }] },
  { indent: 3, parts: [{ text: "<", color: "#e06c75" }, { text: "Projects", color: "#61aeee" }, { text: " />", color: "#e06c75" }] },
  { indent: 2, parts: [{ text: "</", color: "#e06c75" }, { text: "motion.div", color: "#e06c75" }, { text: ">", color: "#e06c75" }] },
  { indent: 1, parts: [{ text: ")", color: "#abb2bf" }] },
  { indent: 0, parts: [{ text: "}", color: "#abb2bf" }] },
];

/* ─── Flatten helpers ────────────────────────────────────────────────────── */

/** Represents one character with its associated color. */
interface FlatChar {
  char: string;
  color: string;
  lineIdx: number;
  /** Which original part index this char belongs to (for keys). */
  partIdx: number;
  /** Position within the part. */
  charInPart: number;
}

function flattenLines(lines: CodeLine[]): FlatChar[] {
  const flat: FlatChar[] = [];
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    // Leading indent spaces
    for (let s = 0; s < line.indent * 2; s++) {
      flat.push({ char: " ", color: "", lineIdx: li, partIdx: -1, charInPart: s });
    }
    for (let pi = 0; pi < line.parts.length; pi++) {
      const part = line.parts[pi];
      for (let ci = 0; ci < part.text.length; ci++) {
        flat.push({ char: part.text[ci], color: part.color, lineIdx: li, partIdx: pi, charInPart: ci });
      }
    }
    // Newline marker
    flat.push({ char: "\n", color: "", lineIdx: li, partIdx: -2, charInPart: 0 });
  }
  return flat;
}

const FLAT_CHARS = flattenLines(CODE_LINES);
const TOTAL_CHARS = FLAT_CHARS.length;

/* ─── Phase types ────────────────────────────────────────────────────────── */
type Phase = "typing" | "compiling" | "success" | "reset";

/* ─── Timing constants ───────────────────────────────────────────────────── */
const TYPING_SPEED_MS = 120;
const COMPILE_DURATION_MS = 2200;
const SUCCESS_DURATION_MS = 1800;
const RESET_DURATION_MS = 600;

/* ─── Animated Editor Component ──────────────────────────────────────────── */
function AnimatedCodeEditor() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [charIndex, setCharIndex] = useState(0);
  const [compileProgress, setCompileProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const compileStartRef = useRef(0);
  const isVisibleRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  /* ── Cleanup helper ── */
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  /* ── IntersectionObserver: only run while visible ── */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  /* ── Phase: Typing ── */
  useEffect(() => {
    if (phase !== "typing") return;

    const tick = () => {
      if (!isVisibleRef.current) {
        timerRef.current = setTimeout(tick, 100);
        return;
      }
      setCharIndex((prev) => {
        const next = prev + 1;
        if (next >= TOTAL_CHARS) {
          timerRef.current = setTimeout(() => setPhase("compiling"), 400);
          return TOTAL_CHARS;
        }
        // skip newlines faster
        const speed = FLAT_CHARS[prev]?.char === "\n" ? 45 : TYPING_SPEED_MS;
        timerRef.current = setTimeout(tick, speed);
        return next;
      });
    };

    timerRef.current = setTimeout(tick, 600);
    return clearTimers;
  }, [phase, clearTimers]);

  /* ── Phase: Compiling ── */
  useEffect(() => {
    if (phase !== "compiling") return;

    compileStartRef.current = performance.now();
    setCompileProgress(0);

    const animate = (now: number) => {
      const elapsed = now - compileStartRef.current;
      const progress = Math.min(elapsed / COMPILE_DURATION_MS, 1);
      // Ease-out-quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCompileProgress(eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("success");
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return clearTimers;
  }, [phase, clearTimers]);

  /* ── Phase: Success ── */
  useEffect(() => {
    if (phase !== "success") return;
    timerRef.current = setTimeout(() => setPhase("reset"), SUCCESS_DURATION_MS);
    return clearTimers;
  }, [phase, clearTimers]);

  /* ── Phase: Reset ── */
  useEffect(() => {
    if (phase !== "reset") return;
    timerRef.current = setTimeout(() => {
      setCharIndex(0);
      setCompileProgress(0);
      setPhase("typing");
    }, RESET_DURATION_MS);
    return clearTimers;
  }, [phase, clearTimers]);

  /* ── Build visible lines from charIndex ── */
  const visibleLines: { lineIdx: number; chars: FlatChar[] }[] = [];
  {
    let currentLineIdx = -1;
    for (let i = 0; i < charIndex && i < FLAT_CHARS.length; i++) {
      const fc = FLAT_CHARS[i];
      if (fc.char === "\n") continue;
      if (fc.lineIdx !== currentLineIdx) {
        currentLineIdx = fc.lineIdx;
        visibleLines.push({ lineIdx: fc.lineIdx, chars: [] });
      }
      visibleLines[visibleLines.length - 1].chars.push(fc);
    }
  }

  /* ── Cursor blink state ── */
  const cursorVisible = phase === "typing";

  /* ── Status bar content ── */
  const statusColor =
    phase === "success"
      ? "#28c840"
      : phase === "compiling"
      ? "#febc2e"
      : "#52525b";

  const statusText =
    phase === "compiling"
      ? "Compiling..."
      : phase === "success"
      ? "✓ Compiled successfully"
      : phase === "reset"
      ? "Clearing..."
      : "portfolio.tsx";

  return (
    <div ref={sectionRef} style={{ position: "relative", borderRadius: "1rem" }}>
      {/* Glow behind */}
      <div
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "1rem",
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,115,22,0.12), transparent)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Editor shell */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          backgroundColor: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f57", display: "block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#febc2e", display: "block" }} />
          <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#28c840", display: "block" }} />
          <span
            style={{
              marginLeft: "auto",
              color: statusColor,
              fontFamily: "monospace",
              fontSize: "0.7rem",
              transition: "color 0.3s",
            }}
          >
            {statusText}
          </span>
        </div>

        {/* Code area */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: "0.8rem",
            lineHeight: 1.9,
            minHeight: "340px",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            {phase === "reset" ? (
              /* Fade-out during reset */
              <motion.div
                key="reset-fade"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: "absolute", inset: 0, padding: "1.25rem 1.5rem" }}
              />
            ) : null}
          </AnimatePresence>

          {/* Typed lines */}
          {visibleLines.map((vl) => (
            <div key={vl.lineIdx} style={{ display: "flex", alignItems: "baseline" }}>
              {/* Line number */}
              <span
                style={{
                  color: "#3f3f46",
                  minWidth: "2rem",
                  userSelect: "none",
                  fontSize: "0.7rem",
                }}
              >
                {vl.lineIdx + 1}
              </span>

              {/* Indent */}
              <span
                style={{
                  minWidth: `${CODE_LINES[vl.lineIdx].indent * 1.2}rem`,
                  display: "inline-block",
                }}
              />

              {/* Characters */}
              {vl.chars
                .filter((fc) => fc.partIdx >= 0)
                .map((fc, i) => (
                  <span key={`${fc.lineIdx}-${fc.partIdx}-${fc.charInPart}`} style={{ color: fc.color || "#abb2bf" }}>
                    {fc.char}
                    {/* Cursor after the last visible char */}
                    {cursorVisible &&
                      i === vl.chars.filter((c) => c.partIdx >= 0).length - 1 &&
                      vl.lineIdx === visibleLines[visibleLines.length - 1].lineIdx && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                          style={{
                            display: "inline-block",
                            width: "2px",
                            height: "1.1em",
                            backgroundColor: "#f97316",
                            marginLeft: "1px",
                            verticalAlign: "text-bottom",
                          }}
                        />
                      )}
                  </span>
                ))}
            </div>
          ))}

          {/* Cursor on empty state */}
          {cursorVisible && visibleLines.length === 0 && (
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ color: "#3f3f46", minWidth: "2rem", userSelect: "none", fontSize: "0.7rem" }}>1</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1.1em",
                  backgroundColor: "#f97316",
                  marginLeft: "1px",
                  verticalAlign: "text-bottom",
                }}
              />
            </div>
          )}
        </div>

        {/* ── Compile / Success overlay ── */}
        <AnimatePresence>
          {phase === "compiling" && (
            <motion.div
              key="compile-bar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              {/* Spinner */}
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(249,115,22,0.2)",
                  borderTopColor: "#f97316",
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
              {/* Progress bar */}
              <div
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    borderRadius: 2,
                    background: "linear-gradient(90deg, #f97316, #fb923c)",
                    width: `${compileProgress * 100}%`,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  color: "#a1a1aa",
                  minWidth: "2.5rem",
                  textAlign: "right",
                }}
              >
                {Math.round(compileProgress * 100)}%
              </span>
            </motion.div>
          )}

          {phase === "success" && (
            <motion.div
              key="success-bar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                borderTop: "1px solid rgba(40,200,64,0.15)",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {/* Checkmark */}
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
              >
                <circle cx="8" cy="8" r="7" stroke="#28c840" strokeWidth="1.5" fill="rgba(40,200,64,0.1)" />
                <motion.path
                  d="M5 8.5L7 10.5L11 6"
                  stroke="#28c840"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.2 }}
                  fill="none"
                />
              </motion.svg>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#28c840",
                }}
              >
                Compiled successfully in 1.2s
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  color: "#3f3f46",
                }}
              >
                0 errors • 0 warnings
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── About Section ──────────────────────────────────────────────────────── */
export default function AboutSection() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [arrowHovered, setArrowHovered] = useState(false);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.06), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

        {/* ── LEFT COLUMN ── */}
        <motion.div
          variants={leftContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col space-y-8"
        >
          {/* Section label */}
          <motion.div variants={leftItemVariants} className="flex items-center space-x-2">
            <span style={{ color: "#f97316", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
              /
            </span>
            <span
              style={{
                color: "#a1a1aa",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              About Me
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={leftItemVariants}>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.15,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Frontend Developer
              <br />
              <span style={{ color: "#f97316" }}>&amp; CS Student</span>
            </h2>
          </motion.div>

          {/* Bio paragraphs */}
          <motion.div variants={leftItemVariants} className="space-y-4">
            <p
              style={{
                color: "#a1a1aa",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              I&apos;m <span style={{ color: "#ffffff", fontWeight: 500 }}>Ali Ahmed Khan</span>, a passionate
              frontend developer and computer science student who loves building modern web
              applications with clean code and beautiful UI/UX.
            </p>
            <p
              style={{
                color: "#a1a1aa",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              I specialize in{" "}
              <span style={{ color: "#f97316", fontWeight: 500 }}>React, Next.js</span> and modern
              frontend technologies. Currently exploring{" "}
              <span style={{ color: "#f97316", fontWeight: 500 }}>3D web experiences</span> with
              Three.js and building full-stack applications with Supabase.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={leftItemVariants}>
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={() => setArrowHovered(true)}
              onMouseLeave={() => setArrowHovered(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                borderRadius: "9999px",
                border: `1.5px solid ${arrowHovered ? "#f97316" : "rgba(255,255,255,0.2)"}`,
                color: arrowHovered ? "#f97316" : "#ffffff",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                transition: "border-color 0.25s, color 0.25s",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              More About Me
              <motion.span
                animate={{ x: arrowHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT COLUMN ── */}
        <motion.div
          variants={rightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col space-y-6"
        >
          {/* Animated Code Editor */}
          <AnimatedCodeEditor />

          {/* Tech Stack Grid */}
          <div>
            {/* Label */}
            <div className="flex items-center space-x-2 mb-4">
              <span style={{ color: "#f97316", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                /
              </span>
              <span
                style={{
                  color: "#a1a1aa",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Tech Stack
              </span>
            </div>

            <motion.div
              variants={techContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.625rem",
              }}
            >
              {TECH_STACK.map((tech) => {
                const isHovered = hoveredTech === tech.name;
                return (
                  <motion.div
                    key={tech.name}
                    variants={techCardVariants}
                    onMouseEnter={() => setHoveredTech(tech.name)}
                    onMouseLeave={() => setHoveredTech(null)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.375rem",
                      padding: "0.75rem 0.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: "#111111",
                      border: `1px solid ${isHovered ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.07)"}`,
                      boxShadow: isHovered
                        ? "0 4px 20px rgba(249,115,22,0.12)"
                        : "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      cursor: "default",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>{tech.icon}</span>
                    <span
                      style={{
                        color: isHovered ? tech.color : "#71717a",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        textAlign: "center",
                        letterSpacing: "0.03em",
                        transition: "color 0.2s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tech.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
