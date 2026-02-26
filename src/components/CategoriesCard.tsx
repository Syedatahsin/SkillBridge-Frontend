"use client";

import React, { useEffect, useState } from "react";
import { 
  Sparkles, Layers, Fingerprint, Box, Compass, 
  Orbit, Diamond, Component, Zap, Hexagon,
  ArrowRight, Loader2, Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// --- 1. THE 10 NEUTRAL ICONS ---
const NEUTRAL_ICONS = [
  Layers, Box, Sparkles, Compass, Hexagon, 
  Orbit, Diamond, Component, Zap, Fingerprint
];

// --- 2. DYNAMIC COLOR PALETTE ---
const COLORS = [
  "text-blue-400 group-hover:text-blue-300", 
  "text-purple-400 group-hover:text-purple-300", 
  "text-indigo-400 group-hover:text-indigo-300",
  "text-pink-400 group-hover:text-pink-300", 
  "text-cyan-400 group-hover:text-cyan-300", 
  "text-emerald-400 group-hover:text-emerald-300"
];

const GLOWS = [
  "from-blue-600/20", "from-purple-600/20", "from-indigo-600/20",
  "from-pink-600/20", "from-cyan-600/20", "from-emerald-600/20"
];

interface CategorySectionProps {
  role?: "admin" | "student" | "teacher" | "public";
}

export default function CategorySection({ role = "public" }: CategorySectionProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- 3. FETCH DATA FROM YOUR BACKEND ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/categories/get");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // --- 4. ADJUSTED ROUTER LOGIC ---
  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams();
    params.set("categories", categoryName);
    router.push(`/find-tutors?${params.toString()}`);
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center bg-black">
      <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
      <p className="text-zinc-500 animate-pulse uppercase tracking-widest text-xs">Loading Categories...</p>
    </div>
  );

  return (
    <section className="bg-black py-24 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-purple-900/10 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
              Explore by <span className="text-purple-500">Category</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
              Choose a subject to find your favorite mentor and start your learning journey.
            </p>
          </div>
          
          
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          
          {role === "admin" && (
            <Card className="group relative border-2 border-dashed border-zinc-800 bg-zinc-900/20 hover:border-purple-500/50 transition-all cursor-pointer rounded-[2.5rem] flex items-center justify-center min-h-[280px]">
              <CardContent className="p-0 flex flex-col items-center gap-4">
                <div className="p-5 rounded-full bg-zinc-800 text-zinc-500 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-xl">
                  <Plus size={32} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Create Category</span>
              </CardContent>
            </Card>
          )}

          {categories.length > 0 ? (
            categories.map((cat, i) => {
              const IconComponent = NEUTRAL_ICONS[i % NEUTRAL_ICONS.length];
              const teacherCount = cat._count?.tutors ?? 0;

              return (
                <Card 
                  key={cat.id || i} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group relative bg-[#0A0A0A] border border-white/10 hover:border-purple-500/40 transition-all duration-500 cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl"
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                    GLOWS[i % GLOWS.length],
                    "to-transparent"
                  )} />

                  <CardContent className="p-10 relative z-10 flex flex-col items-center gap-8">
                    <div className={cn(
                      "p-6 rounded-[1.5rem] bg-white/5 border border-white/10 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:bg-black/60 group-hover:shadow-purple-500/20 group-hover:shadow-2xl",
                      COLORS[i % COLORS.length]
                    )}>
                      <IconComponent size={32} strokeWidth={1.5} />
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-xl text-zinc-100 group-hover:text-white transition-colors">
                        {cat.name}
                      </h3>
                      
                      <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/5 transition-colors group-hover:border-white/10 group-hover:bg-white/10">
                        <p className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-black uppercase tracking-widest">
                          {teacherCount} {teacherCount === 1 ? 'Teacher' : 'Teachers'} Available
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
              <p className="text-zinc-600 font-medium">No categories found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}