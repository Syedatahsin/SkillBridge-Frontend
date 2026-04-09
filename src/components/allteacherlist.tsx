"use client";

import React, { useState } from "react";
import { 
  Search, Star, ShieldCheck, ArrowRight, 
  MapPin, SlidersHorizontal, ChevronLeft, 
  ChevronRight, Sparkles, HandCoins, User 
} from "lucide-react";

export default function TeacherListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // DUMMY DATA: Teacher List (Based on your attributes)
  const tutors = [
    {
      id: "t1",
      name: "Dr. Ariful Islam",
      specialty: "Senior Computer Scientist",
      bio: "Expert in building scalable web applications and mastering React patterns.",
      rating: 4.9,
      reviewCount: 124,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop",
      price: 45
    },
    {
      id: "t2",
      name: "Sarah Jenkins",
      specialty: "UI/UX Architecture",
      bio: "Helping designers bridge the gap between Figma and production-ready code.",
      rating: 4.8,
      reviewCount: 89,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
      price: 40
    },
    {
      id: "t3",
      name: "Marcus Thorne",
      specialty: "Backend Lead",
      bio: "Deep dive into Go, Rust, and distributed database systems.",
      rating: 5.0,
      reviewCount: 56,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop",
      price: 55
    },
    // Add more for pagination testing...
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 transition-colors duration-300">
      
      {/* --- HEADER & SEARCH --- */}
      <section className="pt-20 pb-12 px-6 border-b border-border/10">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles size={14} className="fill-purple-500" /> Discovery Mode
            </div>
            <h1 className="text-6xl lg:text-9xl font-black italic tracking-tighter leading-none">
              Find your <span className="text-purple-600">Mentor.</span>
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search by name or specialty..."
                className="w-full h-16 bg-muted/10 border border-border/50 rounded-2xl pl-16 pr-6 text-sm italic focus:outline-none focus:border-purple-600 transition-all text-foreground"
              />
            </div>
            <button className="h-16 px-8 bg-muted/10 border border-border/50 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-muted/20 transition-all text-foreground">
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>
        </div>
      </section>

      {/* --- TEACHER GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <div 
              key={tutor.id} 
              className="group bg-card border border-border/50 rounded-[3rem] p-8 hover:border-purple-600/50 transition-all duration-500 flex flex-col shadow-2xl"
            >
              {/* Profile Card Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="size-24 rounded-[1.8rem] bg-gradient-to-tr from-purple-600 to-fuchsia-600 p-[2px]">
                    <div className="size-full bg-card rounded-[1.7rem] overflow-hidden">
                      <img src={tutor.image} alt={tutor.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-lg border-2 border-background">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={14} className="fill-purple-500 text-purple-500" />
                    <span className="font-black text-sm text-foreground">{tutor.rating}</span>
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">{tutor.reviewCount} Reviews</p>
                </div>
              </div>

              {/* Bio Section */}
              <div className="flex-1 space-y-2 mb-8">
                <h3 className="text-2xl font-black italic tracking-tighter text-foreground">{tutor.name}</h3>
                <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest">{tutor.specialty}</p>
                <p className="text-muted-foreground text-xs leading-relaxed italic line-clamp-2">
                  "{tutor.bio}"
                </p>
              </div>

              {/* Pricing & Action */}
              <div className="pt-6 border-t border-border/10 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Session Rate</p>
                  <p className="text-xl font-black tracking-tight text-foreground">${tutor.price}.00<span className="text-xs text-muted-foreground">/hr</span></p>
                </div>
                <button className="size-14 rounded-2xl bg-foreground text-background flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all group/btn shadow-xl">
                  <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- PAGINATION --- */}
        <div className="mt-24 flex items-center justify-center gap-4">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="size-14 rounded-2xl border border-border/50 flex items-center justify-center hover:bg-muted/20 transition-all disabled:opacity-20 text-foreground"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <button 
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`size-14 rounded-2xl font-black italic transition-all ${
                  currentPage === num 
                  ? "bg-purple-600 border border-purple-400 text-white shadow-lg shadow-purple-900/40" 
                  : "border border-border/50 hover:bg-muted/20 text-muted-foreground"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="size-14 rounded-2xl border border-border/50 flex items-center justify-center hover:bg-muted/20 transition-all text-foreground"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </main>

      {/* --- FOOTER BANNER --- */}
      <footer className="py-20 px-6 bg-muted/10 border-t border-border/10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4 text-emerald-500">
              <HandCoins size={32} />
              <p className="text-xs font-black uppercase tracking-[0.2em] italic">All Mentors support <br /> Cash on Delivery payment</p>
           </div>
           <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">© 2026 TutorVibe Marketplace</p>
        </div>
      </footer>
    </div>
  );
}