"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Star, CheckCircle2, ArrowRight, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// --- INTERNAL PRICE LOGIC ---
const PriceContext = createContext<{ onSale?: boolean }>({ onSale: false });
const usePriceContext = () => useContext(PriceContext);

const Price = ({ className, children, onSale }: { className?: string; children: ReactNode; onSale?: boolean }) => (
  <PriceContext.Provider value={{ onSale }}>
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  </PriceContext.Provider>
);

const PriceValue = ({ price, currency = "USD", variant = "regular", className }: { price?: number; currency?: string; variant?: "regular" | "sale"; className?: string }) => {
  const { onSale } = usePriceContext();
  if (price == null) return null;
  const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
  return (
    <span className={cn(variant === "regular" ? (onSale ? "text-gray-500 line-through text-xs" : "text-white") : "text-purple-400 font-bold", className)}>
      {formatted}
    </span>
  );
};

// --- DUMMY DATA FOR DESIGN ---
const DUMMY_TEACHERS = [
  { id: 1, name: "Alexander Rivet", subject: "Architecture", rating: 5.0, price: 90, sale: 75, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 2, name: "Dr. Elena Sofia", subject: "Neuroscience", rating: 4.9, price: 120, sale: 99, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 3, name: "Marcus Thorne", subject: "Data Science", rating: 4.8, price: 85, sale: null, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 4, name: "Sarah L. Jenkins", subject: "UI/UX Design", rating: 4.9, price: 70, sale: 50, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 5, name: "Julian Vane", subject: "Philosophy", rating: 5.0, price: 65, sale: null, img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 6, name: "Dr. Maya Angel", subject: "Psychology", rating: 4.7, price: 110, sale: 85, img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 7, name: "Liam Sterling", subject: "Crypto Finance", rating: 4.9, price: 150, sale: 120, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 8, name: "Sophia Ricci", subject: "Classic Art", rating: 4.8, price: 55, sale: null, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 9, name: "Jameson Lock", subject: "Cyber Security", rating: 5.0, price: 200, sale: 175, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=500&auto=format&fit=crop" },
  { id: 10, name: "Clara Oswald", subject: "History", rating: 4.6, price: 45, sale: 30, img: "https://images.unsplash.com/photo-1531123897727-8f129e16fd8c?q=80&w=400&h=500&auto=format&fit=crop" },
];

export default function FeaturedDesign() {
  return (
    <section className="bg-black py-24 text-white relative">
      {/* Visual background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Elegant Section Header */}
        <div className="mb-16 flex flex-col items-center text-center space-y-4">
          <Badge className="bg-white/5 text-purple-400 border-white/10 px-6 py-1 tracking-widest uppercase text-[10px]">
            <Trophy className="mr-2 size-3 inline" /> Elite Educators
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Featured <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Skill Masters</span>
          </h2>
          <p className="text-gray-400 max-w-xl text-lg font-light">
            Hand-picked professionals who are redefining the boundaries of online education.
          </p>
        </div>

        {/* 10 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {DUMMY_TEACHERS.map((teacher) => (
            <Card key={teacher.id} className="group relative border-white/5 bg-[#050505] overflow-hidden rounded-[2rem] transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <CardHeader className="p-0 relative overflow-hidden">
                <AspectRatio ratio={0.8}>
                  <img 
                    src={teacher.img} 
                    alt={teacher.name} 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                </AspectRatio>
                
                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    <Star className="size-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-[10px] font-bold">{teacher.rating}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4 relative">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <CardTitle className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                       {teacher.name}
                     </CardTitle>
                     <CheckCircle2 className="size-3.5 text-blue-500 shrink-0" />
                   </div>
                   <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-black">{teacher.subject}</p>
                </div>

                <CardDescription className="text-xs text-gray-500 line-clamp-2">
                  Top-tier industry expert with over 10 years of professional experience in {teacher.subject.toLowerCase()}.
                </CardDescription>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <Price onSale={!!teacher.sale} className="flex flex-col items-start gap-0">
                    <span className="text-[9px] text-gray-600 uppercase font-bold">Price /hr</span>
                    <div className="flex items-center gap-2">
                      <PriceValue price={teacher.price} variant="regular" />
                      <PriceValue price={teacher.sale || undefined} variant="sale" className="text-lg" />
                    </div>
                  </Price>
                  
                  <div className="bg-white/5 p-2 rounded-full group-hover:bg-purple-600 transition-all group-hover:rotate-45">
                    <ArrowRight className="size-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-20 flex justify-center">
          <Button className="group h-14 px-12 rounded-full bg-white text-black hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold shadow-2xl">
            Browse All Mentors
            <Sparkles className="ml-2 size-4 group-hover:animate-pulse" />
          </Button>
        </div>
      </div>
    </section>
  );
}