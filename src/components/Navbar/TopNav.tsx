"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Home",     href: "#home"     },
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills"   },
  { label: "Journey",  href: "#journey"  },
  { label: "Contact",  href: "#contact"  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function TopNav() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [hovered, setHovered] = useState<string | null>(null);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  /* Scroll-driven transforms */
  const navHeight    = useTransform(scrollY, [0, 100], [60, 50]);
  const bgOpacity    = useTransform(scrollY, [0, 80],  [0.8, 0.97]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0.05, 0.12]);

  /* Track active section via IntersectionObserver */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        className="fixed top-0 left-0 md:left-[60px] right-0 z-50"
        style={{
          height: navHeight,
        }}
      >
        {/* Blurred dark background */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#0a0a0a",
            opacity: bgOpacity,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* Bottom border */}
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "#ffffff",
            opacity: borderOpacity,
          }}
        />

        {/* Content row */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            gap: "0.75rem",
          }}
        >
          {/* ── Logo ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => setPhotoOpen(true)}
              className="cursor-pointer ring-1 ring-transparent hover:ring-orange-500 transition-all rounded-full overflow-hidden shrink-0 flex items-center justify-center p-0"
              style={{
                width: "2rem",
                height: "2rem",
                border: "1.5px solid #f97316",
                flexShrink: 0,
                background: "transparent",
              }}
              aria-label="View profile picture modal"
            >
              <Image
                src="/hero.jpg"
                alt="Ali Khan"
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-full"
              />
            </button>
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#ffffff",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                Ali{" "}
                <span style={{ color: "#f97316" }}>Khan</span>
              </span>
            </motion.a>
          </div>

          {/* ── Center nav pill (hidden below md breakpoint) ── */}
          <nav className="hidden md:flex flex-1 justify-center">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.125rem",
                padding: "0.375rem 0.5rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {NAV_LINKS.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;
                const isHov    = hovered === id;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: "relative",
                      padding: "0.25rem 0.75rem",
                      fontSize: "0.8125rem",
                      borderRadius: "9999px",
                      color: isActive || isHov ? "#ffffff" : "#a1a1aa",
                      fontWeight: isActive ? 500 : 400,
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.label}

                    {/* Animated orange underline */}
                    {isActive && (
                      <motion.span
                        layoutId="active-underline"
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          left: "0.75rem",
                          right: "0.75rem",
                          height: "2px",
                          borderRadius: "9999px",
                          backgroundColor: "#f97316",
                        }}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* ── Right section: CTA button & Mobile Hamburger ── */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              style={{
                flexShrink: 0,
                padding: "0.35rem 0.9rem",
                borderRadius: "9999px",
                border: "1.5px solid #f97316",
                color: "#f97316",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 500,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              whileHover={{
                backgroundColor: "#f97316",
                color: "#ffffff",
                scale: 1.03,
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              Let&apos;s Build →
            </motion.a>

            {/* Hamburger button (visible only below md) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Dropdown Menu & Backdrop ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[60px] left-0 md:left-[60px] bg-black/60 backdrop-blur-xs z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Dropdown panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[60px] left-0 md:left-[60px] right-0 z-40 md:hidden bg-[#0a0a0a]/95 border-b border-white/10 shadow-2xl backdrop-blur-xl px-4 py-3 flex flex-col gap-1"
            >
              {NAV_LINKS.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`min-h-[44px] flex items-center px-4 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "text-orange-500 bg-orange-500/10 border border-orange-500/20"
                        : "text-zinc-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Photo Lightbox Modal ── */}
      <AnimatePresence>
        {photoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setPhotoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full flex items-center justify-center cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src="/hero.jpg"
                alt="Ali Khan"
                width={400}
                height={530}
                className="rounded-2xl shadow-2xl border border-white/10 max-h-[80vh] w-auto h-auto object-cover select-none"
              />
              <button
                type="button"
                onClick={() => setPhotoOpen(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center hover:bg-orange-600 cursor-pointer shadow-lg transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

