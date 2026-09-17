"use client";

import { motion, Variants } from "framer-motion";

/* ─── Easing ─────────────────────────────────────────────────────────────── */
const EASE_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const leftCardVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const rightCardVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const dotVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 18, delay: 0.2 },
  },
};

/* ─── Timeline Data ──────────────────────────────────────────────────────── */
interface TimelineItem {
  year: string;
  title: string;
  description: string;
  tag: string;
  tagEmoji: string;
  tagColor: {
    text: string;
    bg: string;
    border: string;
  };
}

const TIMELINE: TimelineItem[] = [
  {
    year: "2022",
    title: "Started CS Degree",
    description:
      "Enrolled in Computer Science program. Discovered my passion for web development and started learning HTML, CSS and JavaScript.",
    tag: "Education",
    tagEmoji: "🎓",
    tagColor: {
      text: "#60a5fa",
      bg: "rgba(96,165,250,0.08)",
      border: "rgba(96,165,250,0.2)",
    },
  },
  {
    year: "2023",
    title: "First React Project",
    description:
      "Built my first React application — a task manager app. Learned component-based architecture and state management.",
    tag: "Development",
    tagEmoji: "💻",
    tagColor: {
      text: "#a78bfa",
      bg: "rgba(167,139,250,0.08)",
      border: "rgba(167,139,250,0.2)",
    },
  },
  {
    year: "2023",
    title: "Discovered Next.js",
    description:
      "Fell in love with Next.js and its powerful features. Started building full-stack applications with server-side rendering.",
    tag: "Framework",
    tagEmoji: "⚡",
    tagColor: {
      text: "#34d399",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.2)",
    },
  },
  {
    year: "2024",
    title: "First Client Project",
    description:
      "Delivered my first real-world client project — Student Portal with Next.js and Supabase. Learned the importance of clean code.",
    tag: "Milestone",
    tagEmoji: "🏆",
    tagColor: {
      text: "#f97316",
      bg: "rgba(249,115,22,0.08)",
      border: "rgba(249,115,22,0.2)",
    },
  },
  {
    year: "2024–Present",
    title: "Exploring 3D Web",
    description:
      "Deep diving into Three.js, GSAP animations, and building cinematic web experiences. Currently working on advanced portfolio.",
    tag: "Current",
    tagEmoji: "🚀",
    tagColor: {
      text: "#fb923c",
      bg: "rgba(251,146,60,0.08)",
      border: "rgba(251,146,60,0.2)",
    },
  },
];

/* ─── Pulse Ring Component ───────────────────────────────────────────────── */
function PulseDot() {
  return (
    <div className="relative flex items-center justify-center w-4 h-4">
      {/* Pulse ring */}
      <motion.span
        className="absolute rounded-full border border-orange-400"
        style={{ width: "100%", height: "100%" }}
        animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
      {/* Core dot */}
      <span
        className="relative w-4 h-4 rounded-full bg-orange-500 border-2 border-orange-300 z-10 flex-shrink-0"
        style={{ boxShadow: "0 0 10px rgba(249,115,22,0.6)" }}
      />
    </div>
  );
}

/* ─── Timeline Card ──────────────────────────────────────────────────────── */
interface TimelineCardProps {
  item: TimelineItem;
  side: "left" | "right";
  index: number;
}

function TimelineCard({ item, side, index }: TimelineCardProps) {
  const cardVariant = side === "left" ? leftCardVariants : rightCardVariants;

  return (
    <div
      className="relative grid items-center w-full"
      style={{
        gridTemplateColumns: "1fr 2.5rem 1fr",
        columnGap: "0",
      }}
    >
      {/* Left slot */}
      <div className={`flex ${side === "left" ? "justify-end pr-6" : ""}`}>
        {side === "left" && (
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={index}
            whileHover={{
              borderColor: "rgba(249,115,22,0.45)",
              boxShadow: "0 8px 32px rgba(249,115,22,0.12)",
            }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: "#111111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1rem",
              padding: "1.5rem",
              maxWidth: "28rem",
              width: "100%",
            }}
          >
            <CardContent item={item} />
          </motion.div>
        )}
      </div>

      {/* Center dot column */}
      <div className="flex items-center justify-center z-10">
        <motion.div
          variants={dotVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <PulseDot />
        </motion.div>
      </div>

      {/* Right slot */}
      <div className={`flex ${side === "right" ? "justify-start pl-6" : ""}`}>
        {side === "right" && (
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={index}
            whileHover={{
              borderColor: "rgba(249,115,22,0.45)",
              boxShadow: "0 8px 32px rgba(249,115,22,0.12)",
            }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: "#111111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1rem",
              padding: "1.5rem",
              maxWidth: "28rem",
              width: "100%",
            }}
          >
            <CardContent item={item} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Card Inner Content ─────────────────────────────────────────────────── */
function CardContent({ item }: { item: TimelineItem }) {
  return (
    <div className="flex flex-col space-y-3">
      {/* Year badge */}
      <span
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          padding: "0.2rem 0.75rem",
          borderRadius: "9999px",
          fontSize: "0.8rem",
          fontWeight: 600,
          fontFamily: "'Space Grotesk', sans-serif",
          color: "#fb923c",
          backgroundColor: "rgba(249,115,22,0.15)",
          border: "1px solid rgba(249,115,22,0.3)",
          letterSpacing: "0.03em",
        }}
      >
        {item.year}
      </span>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "1.125rem",
          color: "#ffffff",
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          color: "#a1a1aa",
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        {item.description}
      </p>

      {/* Tag badge */}
      <span
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          alignItems: "center",
          gap: "0.3rem",
          padding: "0.2rem 0.65rem",
          borderRadius: "9999px",
          fontSize: "0.7rem",
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: item.tagColor.text,
          backgroundColor: item.tagColor.bg,
          border: `1px solid ${item.tagColor.border}`,
        }}
      >
        <span>{item.tagEmoji}</span>
        {item.tag}
      </span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
interface JourneySectionProps {
  id?: string;
}

export default function JourneySection({ id = "journey" }: JourneySectionProps) {
  return (
    <section
      id={id}
      className="relative min-h-screen py-24 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(249,115,22,0.04), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto w-full px-6 lg:px-8 relative z-10 flex flex-col space-y-20">

        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center text-center space-y-4 pb-8 border-b border-white/5"
        >
          <div className="flex items-center space-x-2">
            <span
              style={{
                color: "#f97316",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
              }}
            >
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
              Journey
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: 1.1,
              color: "#ffffff",
              margin: 0,
            }}
          >
            My path so{" "}
            <span style={{ color: "#f97316" }}>far</span>
          </h2>

          <p
            style={{
              color: "#a1a1aa",
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              maxWidth: "32rem",
              margin: 0,
            }}
          >
            The milestones that shaped me as a developer
          </p>
        </motion.div>

        {/* ── VERTICAL TIMELINE ── */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: "1px",
              background:
                "linear-gradient(to bottom, transparent 0%, #f97316 15%, #f97316 85%, transparent 100%)",
              opacity: 0.35,
            }}
          />

          {/* Timeline items */}
          <div className="flex flex-col" style={{ gap: "3.5rem" }}>
            {TIMELINE.map((item, index) => {
              const side: "left" | "right" = index % 2 === 0 ? "left" : "right";
              return (
                <TimelineCard
                  key={`${item.year}-${item.title}`}
                  item={item}
                  side={side}
                  index={index}
                />
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
