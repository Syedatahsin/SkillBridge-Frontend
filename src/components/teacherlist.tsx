"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getTutorsAction } from "@/Serveraction/getallteacheraction";
import { Button } from "@/components/ui/button";
import { User, ArrowRight, Loader2, Sparkles, GraduationCap } from "lucide-react";

export default function TutorListSection() {
  const [tutors, setTutors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getTutorsAction(page);
      if (result && result.data) {
        setTutors(result.data);
        setTotalPages(result.meta?.lastPage || 1);
      }
    } catch (error) {
      console.error("Failed to load tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto text-foreground relative transition-colors duration-300">
      {/* Background Glow Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/10 blur-[120px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-purple-400 font-black text-[10px] uppercase tracking-[0.4em] mb-3">
            <Sparkles size={14} className="fill-purple-400" /> Discover Excellence
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none text-foreground">
            Expert <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500">Mentors</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md font-medium">
            Elevate your skills with personalized guidance from world-class instructors.
          </p>
        </div>
        <div className="px-5 py-2 bg-muted/10 border border-border/50 rounded-full backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Page <span className="text-foreground">{page}</span> / {totalPages}
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[450px] gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse" />
            <Loader2 className="animate-spin size-12 text-purple-500 relative" />
          </div>
          <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] animate-pulse">
            Curating top talent...
          </p>
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-32 bg-muted/5 border border-dashed border-border rounded-[3rem] backdrop-blur-sm">
          <GraduationCap className="size-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No tutors found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor: any) => (
            <div 
              key={`tutor-${tutor.id}`} 
              className="group relative bg-card border border-border/50 p-8 rounded-[2.5rem] hover:border-purple-500/40 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl"
            >
              {/* Card Gradient Hover Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl group-hover:bg-purple-600/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center border border-border/10 group-hover:scale-110 transition-transform duration-500">
                    <User className="size-8 text-purple-400" />
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <h3 className="text-2xl font-black tracking-tight group-hover:text-purple-400 transition-colors duration-300">
                  {tutor.user?.name || "Expert Tutor"}
                </h3>
                
                <p className="text-sm text-muted-foreground mt-4 line-clamp-3 leading-relaxed font-medium">
                  {tutor.bio || "Crafting a unique learning experience for every student through dedicated mentorship."}
                </p>

                {/* CATEGORIES CHIPS */}
                <div className="flex flex-wrap gap-2 mt-6">
                   {tutor.categories?.slice(0, 3).map((c: any) => (
                     <span 
                        key={`cat-${tutor.id}-${c.id || c.categoryId}`}
                        className="text-[9px] uppercase font-black tracking-widest px-3 py-1.5 bg-muted/10 border border-border/50 rounded-full text-purple-300 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all"
                     >
                        {c.category?.name}
                     </span>
                   ))}
                </div>
              </div>

              <div className="mt-10 relative z-10">
                <Link href={`/tutorsingleprofile/${tutor.id}`}>
                  <Button className="w-full h-14 bg-foreground text-background hover:bg-gradient-to-r hover:from-purple-600 hover:to-fuchsia-600 hover:text-white transition-all duration-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl group-hover:shadow-[0_10px_30px_rgba(147,51,234,0.3)]">
                    View Profile <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!loading && tutors.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-24">
          <div className="flex items-center p-2 bg-card/40 border border-border rounded-2xl backdrop-blur-xl">
            <Button
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="hover:bg-muted text-foreground disabled:opacity-20 rounded-xl transition-colors"
            >
              Prev
            </Button>

            <div className="flex gap-1 px-4 border-l border-r border-border">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={`page-btn-${p}`}
                  onClick={() => setPage(p)}
                  className={`size-9 rounded-xl text-xs font-black transition-all ${
                    page === p 
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40" 
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="hover:bg-muted text-foreground disabled:opacity-20 rounded-xl transition-colors"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}