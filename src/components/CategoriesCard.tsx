"use client";

import React, { useEffect, useState } from "react";
import { 
  Sparkles, Layers, Fingerprint, Box, Compass, 
  Orbit, Diamond, Component, Zap, Hexagon,
  ArrowRight, Loader2, Plus 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);
  const router = useRouter();

  // --- 3. FETCH DATA FROM YOUR BACKEND ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/get?page=${page}&limit=4`);
        const result = await res.json();
        const data = Array.isArray(result) ? result : result.data;

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }

        if (result.meta) setMeta(result.meta);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [page]);

  const handleNext = () => {
    if (meta && page < meta.lastPage) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: document.getElementById('categories-section')?.offsetTop ? document.getElementById('categories-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: document.getElementById('categories-section')?.offsetTop ? document.getElementById('categories-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
    }
  };

  // --- 4. ADJUSTED ROUTER LOGIC ---
  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams();
    params.set("categories", categoryName);
    router.push(`/find-tutors?${params.toString()}`);
  };

  if (loading && categories.length === 0) return (
    <div className="h-96 flex flex-col items-center justify-center bg-background transition-colors duration-300">
      <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
      <p className="text-muted-foreground animate-pulse uppercase tracking-widest text-xs">Loading Categories...</p>
    </div>
  );

  return (
    <section id="categories-section" className="bg-background py-24 text-foreground relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-purple-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/50 pb-12">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
              Explore by <span className="text-purple-500">Category</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              Choose a subject to find your favorite mentor and start your learning journey.
            </p>
          </div>
        </div>

        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-500", loading ? "opacity-50" : "opacity-100")}>
          
          {/* ADMIN ACTION CARD - REDIRECTS TO http://localhost:3000/admin/addcategory */}
          {role === "admin" && page === 1 && (
            <Card 
              onClick={() => router.push("/admin/addcategory")}
              className="group relative border-2 border-dashed border-border bg-muted/5 hover:border-purple-500/50 transition-all cursor-pointer rounded-[2.5rem] flex items-center justify-center min-h-[280px]"
            >
              <CardContent className="p-0 flex flex-col items-center gap-4">
                <div className="p-5 rounded-full bg-muted text-muted-foreground group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-xl">
                  <Plus size={32} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Create Category</span>
              </CardContent>
            </Card>
          )}

          {/* REAL CATEGORIES FROM DATABASE */}
          {categories.map((cat, i) => {
            const IconComponent = NEUTRAL_ICONS[i % NEUTRAL_ICONS.length];
            const teacherCount = cat._count?.tutors ?? 0;

            return (
              <Card 
                key={cat.id || i} 
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative bg-card border border-border/50 hover:border-purple-500/40 transition-all duration-500 cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl"
              >
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                  GLOWS[i % GLOWS.length],
                  "to-transparent"
                )} />

                <CardContent className="p-10 relative z-10 flex flex-col items-center gap-8">
                  <div className={cn(
                    "p-6 rounded-[1.5rem] bg-muted/20 border border-border/50 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:bg-background/80 group-hover:shadow-purple-500/20 group-hover:shadow-2xl",
                    COLORS[i % COLORS.length]
                  )}>
                    <IconComponent size={32} strokeWidth={1.5} />
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-xl text-foreground group-hover:text-foreground transition-colors">
                      {cat.name}
                    </h3>
                    
                    <div className="inline-block px-4 py-1.5 rounded-full bg-muted/20 border border-border/10 transition-colors group-hover:border-border/20 group-hover:bg-muted/30">
                      <p className="text-[10px] text-muted-foreground group-hover:text-foreground font-black uppercase tracking-widest">
                        {teacherCount} {teacherCount === 1 ? 'Teacher' : 'Teachers'} Available
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* EMPTY STATE */}
          {!loading && categories.length === 0 && role !== "admin" && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
              <p className="text-zinc-600 font-medium">No categories found in the database.</p>
            </div>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {meta && meta.lastPage > 0 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={page === 1}
              className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-xl hover:bg-muted/50 disabled:opacity-30 h-12 w-12"
            >
              <ArrowRight className="size-5 rotate-180" />
            </Button>
            
            <div className="flex items-center gap-2 bg-muted/20 px-4 py-2 rounded-2xl border border-border/50">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Page</span>
              <span className="text-sm font-black text-foreground">{page}</span>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">of</span>
              <span className="text-sm font-black text-foreground">{meta.lastPage}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={page === meta.lastPage}
              className="rounded-2xl border-border/50 bg-card/50 backdrop-blur-xl hover:bg-muted/50 disabled:opacity-30 h-12 w-12"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}