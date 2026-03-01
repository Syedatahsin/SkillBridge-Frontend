"use client";

import React, { useEffect, useState } from "react";
import { Star, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";

// Accept userId (which could be the Profile ID or User ID from your Server Action)
export const ReviewSection = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // We use the same stats endpoint. 
        // Your backend Service handles the OR logic to find the profile!
        const res = await fetch(`${process.env.BACKEND_URL}/api/reviews/stats/${userId}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchReviews();
  }, [userId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-3xl bg-white/5">
      <Loader2 className="animate-spin text-purple-600 size-8 mb-2" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Syncing Reviews...</p>
    </div>
  );

  if (!data) return null;

  return (
    <div className="mt-16 grid lg:grid-cols-3 gap-8">
      {/* LEFT: AVERAGE RATING CARD */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-white/10 rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Global Rating</p>
          <h2 className="text-7xl font-black text-white italic tracking-tighter">
            {data.averageRating}
          </h2>
          <div className="flex justify-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={22} 
                fill={i < Math.round(Number(data.averageRating)) ? "currentColor" : "none"} 
                strokeWidth={i < Math.round(Number(data.averageRating)) ? 0 : 2}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-medium">Based on {data.totalReviews} student reviews</p>
         
        </CardContent>
      </Card>

      {/* RIGHT: REVIEWS LIST */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-2 px-2">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Student <span className="text-purple-500">Feedback</span>
          </h2>
          <a href="#" className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-purple-400 flex items-center gap-1 transition-colors">
            See all <ArrowRight size={14} />
          </a>
        </div>

        {data.latestReviews && data.latestReviews.length > 0 ? (
          data.latestReviews.map((rev: any) => (
            <div key={rev.id} className="p-6 rounded-[2rem] bg-[#0A0A0B] border border-white/10 hover:border-purple-500/30 transition-all space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center overflow-hidden">
                    {rev.student?.image ? (
                        <img src={rev.student.image} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-black text-purple-500">{rev.student?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase italic">{rev.student?.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                        {formatDistanceToNow(new Date(rev.createdAt))} ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-yellow-500 bg-yellow-500/5 px-3 py-1.5 rounded-full border border-yellow-500/10">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} strokeWidth={2} />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                &quot;{rev.comment}&quot;
              </p>
            </div>
          ))
        ) : (
          <div className="h-full min-h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-[2.5rem]">
            <p className="text-gray-600 font-black uppercase text-[10px] tracking-[0.3em]">No student reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
};