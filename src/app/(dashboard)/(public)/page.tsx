"use client";

import { motion } from "framer-motion";
import CategorySection from "@/components/CategoriesCard";
import FAQSection from "@/components/home/faq";
import Footer from "@/components/Footer";
import Hero1 from "@/components/home/hero1";
import FeaturedDesign from "@/components/product-card1";
import HowItWorks from "@/components/home/HowItWorks";
import SocialProofGraph from "@/components/home/SocialProofGraph";
import SkillBridgeFinalCTA from "@/components/home/SkillBridgeFinalCTA";
import WhySkillBridge from "@/components/home/WhySkillBridge";
import SectionConnector from "@/components/home/SectionConnector";

const SectionWrapper = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className="relative z-10"
  >
    {children}
  </motion.div>
);

const Pge = () => {
  return (
    <div className="flex flex-col relative overflow-x-hidden">
      {/* Universal Central Pathway Line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent pointer-events-none z-0 hidden md:block" />

      <SectionWrapper>
        <Hero1 />
      </SectionWrapper>
      <SectionConnector label="Featured Masters" />

      <SectionWrapper delay={0.1}>
        <FeaturedDesign />
      </SectionWrapper>
      <SectionConnector label="Explore Categories" />

      <SectionWrapper delay={0.1}>
        <CategorySection role="student" />
      </SectionWrapper>
      <SectionConnector label="SkillBridge Impact" />

      <SectionWrapper delay={0.1}>
        <SocialProofGraph />
      </SectionWrapper>
      <SectionConnector label="How It Works" />

      <SectionWrapper delay={0.1}>
        <HowItWorks />
      </SectionWrapper>
      <SectionConnector label="Frequently Asked Questions" />

      <SectionWrapper delay={0.1}>
        <FAQSection />
      </SectionWrapper>
      <SectionConnector label="Why SkillBridge?" />

      <SectionWrapper delay={0.1}>
        <WhySkillBridge />
      </SectionWrapper>
      <SectionConnector label="Join the Community" />

      <SectionWrapper delay={0.1}>
        <SkillBridgeFinalCTA />
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default Pge;