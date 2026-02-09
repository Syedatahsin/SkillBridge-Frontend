"use client";

import React from "react";
import { 
  Code2, Palette, BarChart3, Globe2, Cpu, FlaskConical, 
  Music, Camera, Languages, Layers, ShieldCheck, Zap,
  Plus, LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  name: string;
  icon: LucideIcon;
  count: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { name: "Development", icon: Code2, count: "120+ Tutors", color: "from-blue-500/20" },
  { name: "Design", icon: Palette, count: "85+ Tutors", color: "from-purple-500/20" },
  { name: "Business", icon: BarChart3, count: "60+ Tutors", color: "from-indigo-500/20" },
  { name: "Marketing", icon: Globe2, count: "45+ Tutors", color: "from-pink-500/20" },
  { name: "IT & Software", icon: Cpu, count: "90+ Tutors", color: "from-cyan-500/20" },
  { name: "Science", icon: FlaskConical, count: "30+ Tutors", color: "from-emerald-500/20" },
  { name: "Music", icon: Music, count: "25+ Tutors", color: "from-red-500/20" },
  { name: "Photography", icon: Camera, count: "40+ Tutors", color: "from-orange-500/20" },
  { name: "Languages", icon: Languages, count: "70+ Tutors", color: "from-yellow-500/20" },
  { name: "Architecture", icon: Layers, count: "15+ Tutors", color: "from-violet-500/20" },
  { name: "Cybersecurity", icon: ShieldCheck, count: "35+ Tutors", color: "from-rose-500/20" },
  { name: "Electronics", icon: Zap, count: "20+ Tutors", color: "from-amber-500/20" },
];

interface CategorySectionProps {
  role?: "admin" | "student" | "teacher" | "public";
}

export default function CategorySection({ role = "public" }: CategorySectionProps) {
  return (
    <section className="bg-black py-24 text-white">
      <div className="container mx-auto px-4">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {role === "admin" ? "Manage" : "Explore by"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Categories
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl">
              {role === "admin" 
                ? "Organize and update the platform's learning sectors." 
                : "Find specialized mentors across various industries."}
            </p>
          </div>

          {/* Optional View All button for Student/Public */}
          {role !== "admin" && (
            <button className="text-purple-400 font-bold hover:underline flex items-center gap-2">
              View all categories <ArrowRight size={16} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          
          {/* SPECIAL ADMIN "ADD" CARD */}
          {role === "admin" && (
            <Card className="group relative overflow-hidden border-2 border-dashed border-white/10 bg-transparent transition-all duration-300 hover:border-purple-500/50 hover:bg-white/5 cursor-pointer">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Plus size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Add New</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black">Category</p>
                </div>
              </CardContent>
            </Card>
          )}

          {CATEGORIES.map((cat, i) => {
            const IconComponent = cat.icon;

            return (
              <Card 
                key={i} 
                className="group relative overflow-hidden border-white/5 bg-[#0A0A0A] transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1 cursor-pointer"
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  cat.color,
                  "to-transparent"
                )} />

                <CardContent className="p-6 relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-purple-400 group-hover:scale-110 group-hover:text-white group-hover:bg-purple-600 transition-all duration-300">
                    <IconComponent size={28} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      {cat.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Add this at the top for the ArrowRight icon
import { ArrowRight } from "lucide-react";