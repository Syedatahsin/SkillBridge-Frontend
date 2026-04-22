"use client";

import { Search, CalendarCheck, Video } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Find Your Expert",
    desc: "Browse through our verified tutors by subject, rating, or price to find your perfect match.",
    icon: <Search className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "02",
    title: "Book a Session",
    desc: "Select a time slot that works for you. Our real-time calendar ensures no double bookings.",
    icon: <CalendarCheck className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "03",
    title: "Start Learning",
    desc: "Join your 1-on-1 live session directly from your dashboard and bridge your skill gap.",
    icon: <Video className="w-6 h-6" />,
    color: "from-orange-500 to-yellow-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12 transition-colors duration-300 scroll-mt-24">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-4 pb-2">
            How SkillBridge Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Three simple steps to unlock your full potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.id} className="relative group">
              {/* The Animated Gradient Border Layer */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${step.color} rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt`}></div>
              
              {/* The Main Card Content */}
              <div className="relative flex flex-col items-center p-8 bg-card border border-border/50 rounded-2xl h-full transition-all hover:-translate-y-2">
                <div className="absolute top-4 right-6 text-5xl font-black opacity-10 italic">
                  {step.id}
                </div>
                
                <div className={`p-4 rounded-full bg-gradient-to-br ${step.color} text-white mb-6 shadow-lg shadow-primary/20`}>
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-center text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
