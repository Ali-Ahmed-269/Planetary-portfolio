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

      {/* Responsive left padding: 0 on mobile, 60px on md+ when sidebar is visible */}
      <main className="pl-0 md:pl-[60px] pt-[74px] min-h-screen bg-[#0a0a0a]">
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
