"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { Star, CheckCircle2, ArrowRight, Sparkles, Trophy, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// --- HELPERS ---
const calculateRating = (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return "No Rating";
  const total = reviews.reduce((acc, rev) => acc + rev.rating, 0);
  const avg = total / reviews.length;
  return avg.toFixed(1);
};

// --- PRICE CONTEXT ---
const PriceContext = createContext<{ onSale?: boolean }>({ onSale: false });
const usePriceContext = () => useContext(PriceContext);

const Price = ({ className, children, onSale }: { className?: string; children: ReactNode; onSale?: boolean }) => (
  <PriceContext.Provider value={{ onSale }}>
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  </PriceContext.Provider>
);

const PriceValue = ({ price, variant = "regular", className }: { price?: number; variant?: "regular" | "sale"; className?: string }) => {
  if (price == null) return null;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);

  return (
    <span className={cn(variant === "regular" ? "text-white" : "text-purple-400 font-bold", className)}>
      {formatted}
    </span>
  );
};

export default function FeaturedMasters() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Fetch with page and limit=4
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/public/featured?page=${page}&limit=4`);

        if (!response.ok) throw new Error("Failed to fetch");

        const result = await response.json();
        const data = Array.isArray(result) ? result : result.data;
        setMentors(Array.isArray(data) ? data : []);
        if (result.meta) setMeta(result.meta);
      } catch (err) {
        console.error("Featured Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [page]);

  const handleNext = () => {
    if (meta && page < meta.lastPage) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: document.getElementById('featured-section')?.offsetTop ? document.getElementById('featured-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: document.getElementById('featured-section')?.offsetTop ? document.getElementById('featured-section')!.offsetTop - 100 : 0, behavior: 'smooth' });
    }
  };

  if (loading && mentors.length === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
        <Loader2 className="animate-spin size-10 text-purple-500 mb-4" />
        <p className="text-muted-foreground font-light tracking-widest">CURATING ELITE TALENT...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[40vh] flex flex-col items-center justify-center bg-background text-foreground p-6 text-center transition-colors duration-300">
        <AlertCircle className="size-10 text-red-500 mb-4" />
        <p className="text-muted-foreground">Unable to load featured mentors at this time.</p>
        <Button variant="link" onClick={() => window.location.reload()} className="text-purple-400">Try Again</Button>
      </div>
    );
  }

  return (
    <section id="featured-section" className="bg-background py-24 text-foreground relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center space-y-4">
          <Badge className="bg-muted/20 text-purple-400 border-border/10 px-6 py-1 tracking-widest uppercase text-[10px] hover:bg-muted/30 transition-colors">
            <Trophy className="mr-2 size-3 inline text-yellow-500" /> Top 1% Educators
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Featured <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Skill Masters</span>
          </h2>
          <p className="text-muted-foreground max-w-xl text-lg font-light italic">
            "Education is the passport to the future."
          </p>
        </div>

        {/* 10 Card Grid */}
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-opacity duration-500", loading ? "opacity-50" : "opacity-100")}>
          {mentors.length > 0 ? (
            mentors.map((teacher) => {
              const avgRating = calculateRating(teacher.reviews);
              const mainCategory = teacher.categories?.[0]?.category?.name || "Expert Master";

              // CLOUDINARY LOGIC: Check if teacher.user.image exists
              const profileImage = teacher.user?.image && teacher.user.image !== ""
                ? teacher.user.image
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.user?.name || 'Tutor')}&background=random&color=fff&size=512`;

              return (
                <Card key={teacher.id} className="group relative border-border/50 bg-card overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                  <CardHeader className="p-0 relative overflow-hidden">
                    <AspectRatio ratio={0.8} className="bg-neutral-900">
                      <img
                        src={profileImage}
                        alt={teacher.user?.name}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.user?.name || 'T')}&background=6366f1&color=fff`;
                        }}
                      />
                      {/* Gradient Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                    </AspectRatio>

                    {/* Floating Rating Badge */}
                    <div className="absolute top-5 right-5 z-20">
                      <div className="flex items-center gap-1.5 bg-background/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-border/50 shadow-2xl">
                        <Star className={cn("size-3", avgRating === "No Rating" ? "text-muted-foreground" : "fill-yellow-500 text-yellow-500")} />
                        <span className="text-[11px] font-black tracking-tighter text-foreground">{avgRating}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-7 space-y-4 relative">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold text-foreground group-hover:text-purple-400 transition-colors truncate">
                          {teacher.user?.name}
                        </CardTitle>
                        <CheckCircle2 className="size-4 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-[10px] text-indigo-400 uppercase tracking-[0.2em] font-black">{mainCategory}</p>
                    </div>

                    <CardDescription className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
                      {teacher.bio || `Specializing in ${mainCategory.toLowerCase()} with a focus on real-world application.`}
                    </CardDescription>

                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                      <Price className="flex flex-col items-start gap-0">
                        <span className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-tighter">Rate per Hour</span>
                        <PriceValue price={teacher.pricePerHour} className="text-2xl font-black text-purple-400" />
                      </Price>

                      <Link
                        href={`/tutorsingleprofile/${teacher.id}`}
                        className="bg-muted/20 p-3 rounded-2xl group-hover:bg-purple-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[360deg]"
                      >
                        <ArrowRight className="size-5 text-foreground group-hover:text-white transition-colors" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4">
              <Sparkles className="size-12 text-gray-800" />
              <p className="text-gray-600 font-medium">Our elite selection is being updated. Check back shortly!</p>
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