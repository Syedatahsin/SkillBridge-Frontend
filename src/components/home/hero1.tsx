"use client";

import { ArrowRight, ArrowUpRight, Sparkles, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Hero1Props {
  badge?: string;
  heading?: string;
  description?: string;
  buttons?: {
    primary?: { text: string; url: string };
    secondary?: { text: string; url: string };
  };
  image?: { src: string; alt: string };
  className?: string;
}

const Hero1 = ({
  badge = "Find Your Perfect Mentor",
  heading = "Master Any Subject with Expert Guidance",
  description = "Connect with top-tier tutors, browse verified ratings, and book personalized 1-on-1 sessions. Your journey to mastery starts with the right teacher.",
  buttons = {
    primary: { text: "Find Your Tutor", url: "/teacherlist" },
    secondary: { text: "Book a Schedule", url: "#" },
  },
  image = {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    alt: "Student and tutor learning together",
  },
  className,
}: Hero1Props) => {
  return (
    <section className={cn("relative overflow-hidden bg-black py-24 lg:py-32", className)}>
      {/* --- Elegant Background Accents --- */}
      <div className="absolute -left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute -right-[10%] bottom-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          
          {/* --- Content Column --- */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge 
                variant="outline" 
                className="mb-6 border-white/10 bg-white/5 px-4 py-1 text-purple-400 backdrop-blur-md transition-all hover:bg-white/10"
              >
                <Sparkles className="mr-2 size-3" />
                {badge}
                <ArrowUpRight className="ml-2 size-3" />
              </Badge>
            )}
            
            <h1 className="mb-6 text-pretty text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
              {heading.split(" ").map((word, i) => (
                <span key={i} className={i > 3 ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-gray-400 lg:text-xl">
              {description}
            </p>

            <div className="flex w-full flex-col gap-4 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button 
                  asChild 
                  className="group h-14 w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 text-lg font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 sm:w-auto"
                >
                  <a href={buttons.primary.url}>
                    {buttons.primary.text}
                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              )}
              
            </div>
          </div>

          {/* --- Image Column --- */}
          <div className="relative group lg:ml-auto">
            {/* Soft Glow behind image */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-xl transition duration-1000 group-hover:opacity-40" />
            
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
              <img
                src={image.src}
                alt={image.alt}
                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105 opacity-80"
              />
              
              {/* Floating Overlay Info Cards */}
              <div className="absolute bottom-6 left-6 right-6 hidden gap-4 sm:flex">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-lg">
                  <div className="rounded-lg bg-indigo-500/20 p-2">
                    <BookOpen className="size-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Subjects</p>
                    <p className="text-sm font-bold text-white">Explore Vast Categories</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-lg">
                  <div className="rounded-lg bg-purple-500/20 p-2">
                    <Calendar className="size-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Scheduling</p>
                    <p className="text-sm font-bold text-white">24/7 Availability</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero1;