import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

/* ─── Font Definitions ───────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/* ─── Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Ali Ahmed Khan — Frontend Developer",
  description:
    "Crafting modern, fast and beautiful web experiences",
};

/* ─── Root Layout ────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <body style={{ backgroundColor: "#0a0a0a", margin: 0, padding: 0 }}>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
