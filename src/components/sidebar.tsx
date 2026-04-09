"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Grid, 
  Users, 
  Calendar, 
  TrendingUp, 
  Star, 
  ChevronRight,
  Sparkles,
  Zap,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarOption {
  label: string;
  href: string;
  icon: React.ElementType;
  description: string;
}

const SECTION_DATA: Record<string, SidebarOption[]> = {
  admin: [
    { label: "Overview", href: "#overview", icon: LayoutDashboard, description: "System metrics" },
    { label: "Categories", href: "#categories", icon: Grid, description: "Taxonomy management" },
    { label: "Accounts", href: "#management", icon: Users, description: "User permissions" },
  ],
  student: [
    { label: "Greeting", href: "#welcome", icon: Sparkles, description: "Daily briefing" },
    { label: "Insights", href: "#overview", icon: Zap, description: "Learning stats" },
    { label: "Schedule", href: "#sessions", icon: Calendar, description: "Upcoming classes" },
    { label: "Explore", href: "#categories", icon: Briefcase, description: "Skill mapping" },
  ],
  teacher: [
    { label: "Revenue", href: "#revenue", icon: TrendingUp, description: "Earnings analytics" },
    { label: "Performance", href: "#overview", icon: LayoutDashboard, description: "Engagement data" },
    { label: "Dashboard", href: "#sessions", icon: Calendar, description: "Session flow" },
    { label: "Feedback", href: "#reviews", icon: Star, description: "Student ratings" },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");
  const [role, setRole] = useState<"admin" | "student" | "teacher" | null>(null);
  
  // Detect role from pathname
  useEffect(() => {
    if (pathname.includes("/admin")) setRole("admin");
    else if (pathname.includes("/student")) setRole("student");
    else if (pathname.includes("/teacher")) setRole("teacher");
  }, [pathname]);

  const options = role ? SECTION_DATA[role] : [];

  // Intersection Observer for scroll-sync
  useEffect(() => {
    if (!role) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Focus on items near the top of the viewport
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    options.forEach((opt) => {
      const el = document.querySelector(opt.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [role, options]);

  return (
    <aside className="w-80 bg-card/50 backdrop-blur-3xl border-r border-border/50 hidden xl:flex flex-col shrink-0 relative overflow-hidden group transition-colors duration-300">
      {/* GLOW EFFECT */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-48 -right-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="sticky top-[81px] p-6 pt-10 flex flex-col h-[calc(100vh-81px)] overflow-y-auto scrollbar-hide z-10">
        <div className="mb-10 px-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Navigator
          </h3>
          <div className="h-0.5 w-8 bg-purple-600/50 rounded-full" />
        </div>

        <nav className="flex flex-col gap-2">
          {options.map((option, idx) => {
            const isActive = activeTab === option.href;
            const Icon = option.icon;

            return (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={option.href}
                  onClick={() => setActiveTab(option.href)}
                  className={`group relative p-4 rounded-3xl flex items-center gap-5 transition-all duration-500 overflow-hidden
                    ${isActive 
                      ? "bg-muted/20 border border-border flex shadow-[0_8px_32px_rgba(0,0,0,0.1)]" 
                      : "bg-transparent border border-transparent hover:bg-muted/5"
                    }
                  `}
                >
                  {/* ACTIVE INDICATOR */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-bg"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-transparent border-l-2 border-purple-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className={`p-3 rounded-2xl transition-all duration-500 relative z-10
                    ${isActive 
                      ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
                      : "bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground"
                    }
                  `}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  <div className="flex flex-col relative z-10">
                    <span className={`text-sm font-black tracking-tight transition-colors duration-500 
                      ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}
                    `}>
                      {option.label}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                      {option.description}
                    </span>
                  </div>

                  <div className={`ml-auto transition-all duration-500 relative z-10
                    ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
                  `}>
                    <ChevronRight size={14} className="text-purple-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* BOTTOM DECORATION */}
        <div className="mt-auto pt-10 px-4">
          <div className="p-5 rounded-[2rem] bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 relative overflow-hidden group/card">
            <div className="absolute top-0 right-0 p-3 text-purple-600/20 group-hover/card:text-purple-600/40 transition-colors">
              <Zap size={40} fill="currentColor" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-1">Status</p>
            <p className="text-xs font-black italic text-foreground uppercase">Ultra Fluid Mode</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
