"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Home,
  User,
  Code2,
  Layers,
  Mail,
} from "lucide-react";

/* ─── Social SVG Icons ────────────────────────────────────────────────────── */
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface NavItem {
  id: string;
  href: string;
  icon: React.ElementType;
  label: string;
}

interface SocialItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const NAV_ITEMS: NavItem[] = [
  { id: "home",     href: "#home",     icon: Home,    label: "Home"     },
  { id: "about",    href: "#about",    icon: User,    label: "About"    },
  { id: "projects", href: "#projects", icon: Code2,   label: "Projects" },
  { id: "skills",   href: "#skills",   icon: Layers,  label: "Skills"   },
  { id: "contact",  href: "#contact",  icon: Mail,    label: "Contact"  },
];

const SOCIAL_ITEMS: SocialItem[] = [
  { href: "#", icon: GithubIcon,   label: "GitHub"   },
  { href: "#", icon: LinkedinIcon, label: "LinkedIn" },
  { href: "#", icon: TwitterIcon,  label: "Twitter"  },
];

/* ─── Animation variants ─────────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Sidebar() {
  const [activeSection, setActiveSection] = useState<string>("home");

  /* Track active section via IntersectionObserver */
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="fixed left-0 top-0 h-screen w-[60px] z-50 flex flex-col items-center"
      style={{
        backgroundColor: "#0a0a0a",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* ── Logo mark ── */}
      <motion.div variants={itemVariants} className="mt-5 mb-6">
        <div
          className="w-8 h-8 flex items-center justify-center text-sm font-bold"
          style={{
            border: "1.5px solid #f97316",
            color: "#f97316",
            borderRadius: "6px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          A
        </div>
      </motion.div>

      {/* ── Nav icons ── */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.div key={item.id} variants={itemVariants} className="relative flex items-center">
              {/* Active indicator dot */}
              <motion.span
                animate={{ opacity: isActive ? 1 : 0, scaleY: isActive ? 1 : 0.4 }}
                transition={{ duration: 0.2 }}
                className="absolute -left-[3px] w-[3px] h-5 rounded-full"
                style={{ backgroundColor: "#f97316" }}
              />

              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                aria-label={item.label}
                title={item.label}
                className="group relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
                style={{
                  color: isActive ? "#f97316" : "#a1a1aa",
                  backgroundColor: isActive ? "rgba(249,115,22,0.08)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#f97316";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(249,115,22,0.06)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "#a1a1aa";
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  }
                }}
              >
                <Icon size={18} strokeWidth={1.75} />
              </a>
            </motion.div>
          );
        })}
      </nav>

      {/* ── Social icons at bottom ── */}
      <motion.div
        variants={containerVariants}
        className="flex flex-col items-center gap-1 mb-5"
      >
        {SOCIAL_ITEMS.map((social) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={social.label}
              variants={itemVariants}
              href={social.href}
              aria-label={social.label}
              title={social.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200"
              style={{ color: "#52525b" }}
              whileHover={{ color: "#f97316", scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={16} strokeWidth={1.75} />
            </motion.a>
          );
        })}
      </motion.div>
    </motion.aside>
  );
}
