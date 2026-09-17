import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero";
import AboutSection from "@/components/About";
import ProjectsSection from "@/components/Projects";
import SkillsSection from "@/components/Skills";
import JourneySection from "@/components/Journey";
import ContactSection from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* pl-[60px] offsets the sidebar; pt-[60px] offsets the top nav */}
      <main
        style={{
          paddingLeft: "60px",
          paddingTop: "60px",
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
        }}
      >
        <HeroSection />

        <AboutSection />
        <ProjectsSection />
        <SkillsSection id="skills" />
        <JourneySection id="journey" />
        <ContactSection id="contact" />
      </main>
    </>
  );
}
