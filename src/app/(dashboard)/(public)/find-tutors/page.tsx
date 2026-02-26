"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Clock, DollarSign, User } from "lucide-react";

export default function FindTutorsPage() {
  const searchParams = useSearchParams();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        // Build the URL using the searchParams from the Navbar
        const response = await fetch(
          `http://localhost:5000/api/tutor/public/getSEARCHtutors?${searchParams.toString()}`
        );
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [searchParams]); // Re-run when URL changes

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">
          Available <span className="text-purple-500">Mentors</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
          </div>
        ) : tutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor: any) => (
              <div 
                key={tutor.id} 
                className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-14 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                    <User className="size-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase text-sm tracking-widest">{tutor.user?.name}</h3>
                    <p className="text-xs text-gray-500 font-bold">{tutor.bio?.substring(0, 40)}...</p>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                   <div className="flex items-center gap-1 text-[10px] font-black uppercase text-yellow-500">
                      <Star className="size-3 fill-yellow-500" /> 
                      {/* Calculation logic matching your backend filter */}
                      {(tutor.reviews?.reduce((s:any, r:any) => s + r.rating, 0) / (tutor.reviews?.length || 1)).toFixed(1)}
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-black uppercase text-purple-400">
                      <DollarSign className="size-3" /> {tutor.pricePerHour}/hr
                   </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tutor.categories?.map((c: any) => (
                    <span key={c.category.id} className="text-[8px] font-black uppercase px-3 py-1 bg-white/5 rounded-full border border-white/5 text-gray-400">
                      {c.category.name}
                    </span>
                  ))}
                </div>

                <button className="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all active:scale-95">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">No mentors found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}