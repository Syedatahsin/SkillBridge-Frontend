"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, DollarSign, User, Loader2 } from "lucide-react";

// 1. Define the Interface to fix the TS 'never' error
interface Tutor {
  id: string;
  bio: string;
  pricePerHour: number;
  user: {
    name: string;
    image?: string;
  };
  categories: {
    category: {
      id: string;
      name: string;
    };
  }[];
  reviews: {
    rating: number;
  }[];
}

function TutorsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Fixes the Argument of type 'any[]' is not assignable to 'never[]' error
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/tutor/public/getSEARCHtutors?${searchParams.toString()}`
        );
        const data = await response.json();
        // Ensure data is an array before setting state
        setTutors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch search results", error);
        setTutors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [searchParams]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-8">
        Available <span className="text-purple-500">Mentors</span>
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-[3rem] bg-white/[0.02]">
          <Loader2 className="animate-spin h-12 w-12 text-purple-500 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Searching Databases...</p>
        </div>
      ) : tutors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => {
            // Calculate average rating safely
            const avgRating = tutor.reviews?.length 
              ? (tutor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / tutor.reviews.length).toFixed(1)
              : "0.0";

            return (
              <div 
                key={tutor.id} 
                className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 hover:border-purple-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="size-14 rounded-2xl bg-purple-600/20 flex items-center justify-center border border-purple-500/30 overflow-hidden">
                      {tutor.user?.image ? (
                        <img src={tutor.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="size-6 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-sm tracking-widest text-white">
                        {tutor.user?.name}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight line-clamp-1">
                        {tutor.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-yellow-500 bg-yellow-500/5 px-2 py-1 rounded-md border border-yellow-500/10">
                      <Star className="size-3 fill-yellow-500" /> 
                      {avgRating}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase text-purple-400 bg-purple-500/5 px-2 py-1 rounded-md border border-purple-500/10">
                      <DollarSign className="size-3" /> {tutor.pricePerHour}/hr
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {tutor.categories?.map((c) => (
                      <span key={c.category.id} className="text-[8px] font-black uppercase px-3 py-1 bg-white/5 rounded-full border border-white/5 text-gray-400">
                        {c.category.name}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => router.push(`/tutorsingleprofile/${tutor.id}`)}
                  className="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all active:scale-95"
                >
                  View Profile
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
            No mentors found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}

// 2. The Main Page with Suspense Boundary
export default function FindTutorsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-500 size-10" />
        </div>
      }>
        <TutorsListContent />
      </Suspense>
    </div>
  );
}