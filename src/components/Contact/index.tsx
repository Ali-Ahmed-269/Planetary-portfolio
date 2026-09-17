"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";

/* ─── Easing ─────────────────────────────────────────────────────────────── */
const EASE_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];

/* ─── Animation Variants ─────────────────────────────────────────────────── */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const leftColVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const rightColVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

const cardContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const formFieldVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const formContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

/* ─── Inline SVG Icons ───────────────────────────────────────────────────── */
const GithubIcon = ({ size = 18 }: { size?: number }) => (
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

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
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

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
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
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

/* ─── Contact Info Data ──────────────────────────────────────────────────── */
interface ContactCard {
  emoji: string;
  label: string;
  value: string;
}

const CONTACT_CARDS: ContactCard[] = [
  { emoji: "📧", label: "Email", value: "alikhan42574@gmail.com" },
  { emoji: "📍", label: "Location", value: "Islamabad, Pakistan" },
  { emoji: "💼", label: "Available for", value: "Freelance & Full-time" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "#", icon: GithubIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
];

/* ─── Form Field Styles ──────────────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#111111",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.75rem",
  padding: "0.8rem 1rem",
  color: "#ffffff",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s",
};

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactSectionProps {
  id?: string;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function ContactSection({ id = "contact" }: ContactSectionProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    }, 2000);
  };

  const fieldStyle = (name: string): React.CSSProperties => ({
    ...inputBase,
    borderColor:
      focusedField === name ? "#f97316" : "rgba(255,255,255,0.1)",
  });

  const scrollToTop = () => {
    document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id={id}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#111111" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(249,115,22,0.05), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-24 relative z-10 flex flex-col flex-1 space-y-16">

        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
              Contact
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
            {"Let's build something "}
            <span style={{ color: "#f97316" }}>amazing together</span>
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
            Have a project in mind? I&apos;d love to hear about it.
          </p>
        </motion.div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 flex-1 items-start">

          {/* ── LEFT COLUMN: Contact Info ── */}
          <motion.div
            variants={leftColVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col space-y-8"
          >
            <p
              style={{
                color: "#a1a1aa",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              I&apos;m currently available for freelance work and interesting
              projects. Let&apos;s talk!
            </p>

            {/* Contact Cards */}
            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col space-y-3"
            >
              {CONTACT_CARDS.map((card) => {
                const isHovered = hoveredCard === card.label;
                return (
                  <motion.div
                    key={card.label}
                    variants={cardItemVariants}
                    onMouseEnter={() => setHoveredCard(card.label)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      backgroundColor: "#0a0a0a",
                      border: `1px solid ${isHovered ? "rgba(249,115,22,0.45)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      boxShadow: isHovered
                        ? "0 4px 20px rgba(249,115,22,0.1)"
                        : "none",
                      transition: "border-color 0.25s, box-shadow 0.25s",
                      cursor: "default",
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        backgroundColor: "rgba(249,115,22,0.1)",
                        border: "1px solid rgba(249,115,22,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                      }}
                    >
                      {card.emoji}
                    </div>

                    <div>
                      <p
                        style={{
                          color: "#52525b",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          margin: 0,
                          marginBottom: "0.15rem",
                        }}
                      >
                        {card.label}
                      </p>
                      <p
                        style={{
                          color: "#ffffff",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {card.value}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Social links */}
            <div className="flex flex-col space-y-4">
              <p
                style={{
                  color: "#52525b",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                or find me on
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => {
                  const isHovered = hoveredSocial === label;
                  return (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredSocial(label)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "2.75rem",
                        height: "2.75rem",
                        borderRadius: "0.625rem",
                        backgroundColor: "#0a0a0a",
                        border: `1px solid ${isHovered ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.08)"}`,
                        color: isHovered ? "#f97316" : "#71717a",
                        transition: "border-color 0.2s, color 0.2s",
                        textDecoration: "none",
                      }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Contact Form ── */}
          <motion.div
            variants={rightColVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "1.25rem",
                padding: "2rem",
              }}
            >
              {success ? (
                /* Success state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                >
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "50%",
                      backgroundColor: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    ✓
                  </div>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: "#22c55e",
                      margin: 0,
                    }}
                  >
                    Message sent!
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.9rem",
                      color: "#a1a1aa",
                      margin: 0,
                    }}
                  >
                    I&apos;ll get back to you soon. ✓
                  </p>
                </motion.div>
              ) : (
                /* Form */
                <motion.form
                  onSubmit={handleSubmit}
                  variants={formContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col space-y-4"
                >
                  {/* Name */}
                  <motion.div variants={formFieldVariants}>
                    <label
                      htmlFor="contact-name"
                      style={{
                        display: "block",
                        color: "#a1a1aa",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      style={fieldStyle("name")}
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={formFieldVariants}>
                    <label
                      htmlFor="contact-email"
                      style={{
                        display: "block",
                        color: "#a1a1aa",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      style={fieldStyle("email")}
                    />
                  </motion.div>

                  {/* Subject */}
                  <motion.div variants={formFieldVariants}>
                    <label
                      htmlFor="contact-subject"
                      style={{
                        display: "block",
                        color: "#a1a1aa",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="Project inquiry"
                      value={form.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      style={fieldStyle("subject")}
                    />
                  </motion.div>

                  {/* Message */}
                  <motion.div variants={formFieldVariants}>
                    <label
                      htmlFor="contact-message"
                      style={{
                        display: "block",
                        color: "#a1a1aa",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell me about your project..."
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...fieldStyle("message"),
                        resize: "vertical",
                        minHeight: "7.5rem",
                      }}
                    />
                  </motion.div>

                  {/* Submit */}
                  <motion.div variants={formFieldVariants}>
                    <motion.button
                      id="contact-submit"
                      type="submit"
                      disabled={sending}
                      whileHover={!sending ? { scale: 1.015 } : {}}
                      whileTap={!sending ? { scale: 0.98 } : {}}
                      style={{
                        width: "100%",
                        padding: "0.875rem 1.5rem",
                        borderRadius: "0.75rem",
                        border: "none",
                        backgroundColor: sending ? "#7c3404" : "#f97316",
                        color: "#ffffff",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        letterSpacing: "0.02em",
                        cursor: sending ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {sending ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            style={{
                              display: "inline-block",
                              width: "1rem",
                              height: "1rem",
                              border: "2px solid rgba(255,255,255,0.3)",
                              borderTopColor: "#fff",
                              borderRadius: "50%",
                            }}
                          />
                          Sending…
                        </>
                      ) : (
                        "Send Message →"
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex flex-col space-y-6 pt-4">
          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />

          {/* Footer row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              style={{
                color: "#52525b",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                margin: 0,
                textAlign: "center",
              }}
            >
              © 2024 Ali Ahmed Khan. Crafted with ❤️ and lots of ☕
            </p>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#f97316",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                padding: 0,
                letterSpacing: "0.03em",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.textDecoration =
                  "underline")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.textDecoration = "none")
              }
            >
              Back to top ↑
            </motion.button>
          </div>
        </div>

      </div>
    </section>
  );
}
