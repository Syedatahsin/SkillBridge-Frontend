"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    question: "How do I find the right tutor for me?",
    answer: "You can use our advanced search bar to filter tutors by subject, rating, and price range. Each tutor has a detailed profile with reviews from other students to help you decide."
  },
  {
    question: " How do I book a one-to-one  session??",
    answer: "Students can create an account, choose their preferred teacher, and enroll for one-to-one session based on their availability. "
  },
  {
    question: "Can I cancel a booked session?",
    answer: "Yes, just click on the cancel button in your session details."
  },
  {
    question: "How are the one-to-one sessions conducted",
    answer: "Sessions are conducted individually between the student and the teacher, ensuring personalized attention and focused learning support."
  },
  {
    question: "How do I apply to become a teacher?",
    answer: "Simply click the “Join Now” button and choose the “Teacher” role during sign-up. Then, complete your profile by adding your subject and other relevant details to get started. ✨"
  }
];

export default function FAQSection() {
  return (
    <section className="bg-background py-24 text-foreground relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">
            <HelpCircle size={14} /> Support
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the SkillBridge platform.
          </p>
        </div>

        {/* Accordion Logic */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border bg-card rounded-2xl px-6 transition-all hover:border-purple-500/30"
            >
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-purple-400 py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="mailto:anikasyeda82@gmail.com" className="text-purple-400 font-bold hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}