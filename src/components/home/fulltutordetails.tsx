"use client";

import React, { useState } from "react";
import { 
  Star, CheckCircle2, Calendar, Clock, 
  ChevronRight, ShieldCheck, Award, MessageCircle 
} from "lucide-react";
import { format } from "date-fns"; // Recommended: npm install date-fns
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TutorProfilePage({ tutorData }: { tutorData: any }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Formatting helpers
  const avgRating = tutorData.reviews?.length > 0 
    ? (tutorData.reviews.reduce((a: any, b: any) => a + b.rating, 0) / tutorData.reviews.length).toFixed(1)
    : "New Joiner";

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-32 h-32 border-4 border-purple-500/20 rounded-3xl">
              <AvatarImage src={tutorData.user?.image} className="object-cover" />
              <AvatarFallback>{tutorData.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">{tutorData.user?.name}</h1>
                <CheckCircle2 className="text-blue-500 size-6" />
                {tutorData.isFeatured && (
                  <Badge className="bg-purple-600 text-[10px] uppercase tracking-tighter">Featured</Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tutorData.categories?.map((cat: any) => (
                  <Badge key={cat.categoryId} variant="outline" className="border-white/10 text-indigo-400">
                    {cat.category?.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-bold">{avgRating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="size-4 text-purple-500" />
                  <span>{tutorData.experience} Years Experience</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <ShieldCheck className="text-green-500 size-5" /> About the Master
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              {tutorData.bio}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8 bg-[#0a0a0a] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-black">Investment</p>
                  <h2 className="text-4xl font-black text-purple-400">${tutorData.pricePerHour}<span className="text-sm text-gray-500">/hr</span></h2>
                </div>
                <MessageCircle className="size-6 text-gray-600 cursor-pointer hover:text-white transition-colors" />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="size-4 text-purple-500" /> Available Slots
                </p>
                
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {tutorData.availability?.filter((a: any) => !a.isBooked).map((slot: any) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                        selectedSlot === slot.id 
                          ? "bg-purple-600 border-purple-400 text-white" 
                          : "bg-white/5 border-white/5 hover:border-purple-500/50 text-gray-400"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{format(new Date(slot.startTime), "EEEE, MMM do")}</span>
                        <span className="text-sm">{format(new Date(slot.startTime), "hh:mm a")} - {format(new Date(slot.endTime), "hh:mm a")}</span>
                      </div>
                      <Clock className={cn("size-4 opacity-0 group-hover:opacity-100 transition-opacity", selectedSlot === slot.id && "opacity-100")} />
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                disabled={!selectedSlot}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-bold text-lg group"
              >
                Book Session
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-[10px] text-center text-gray-600 uppercase tracking-widest">
                Secure checkout • Instant Confirmation
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}