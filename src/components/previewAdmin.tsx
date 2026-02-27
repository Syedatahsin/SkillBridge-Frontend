"use client";

import React, { useEffect, useState } from "react";
import { 
  User, ArrowRight, MoreVertical, Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTutors = async () => {
      try {
        setLoading(true);
        // Limit 10 for dashboard overview
        const res = await fetch("http://localhost:5000/api/tutor/alltutor?limit=10");
        const json = await res.json();
        
        if (json.success) {
          setTutors(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTutors();
  }, []);

  return (
    <div className="bg-black min-h-screen pb-20 text-white font-sans">
      <div className="container mx-auto px-4">
        
        <section className="pt-12">
          <Tabs defaultValue="teachers" className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                  Recent <span className="text-purple-500">Activity</span>
                </h2>
                <p className="text-gray-500 font-medium italic">Showing the latest registrations.</p>
              </div>
              
              <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-full h-auto flex-wrap">
                <TabsTrigger value="teachers" className="rounded-full px-8 py-3 data-[state=active]:bg-purple-600 font-bold">Teachers</TabsTrigger>
                <TabsTrigger value="bookings" className="rounded-full px-8 py-3 data-[state=active]:bg-purple-600 font-bold">Bookings</TabsTrigger>
                <TabsTrigger value="users" className="rounded-full px-8 py-3 data-[state=active]:bg-purple-600 font-bold">Students</TabsTrigger>
              </TabsList>
            </div>

            {/* TEACHERS GRID */}
            <TabsContent value="teachers" className="outline-none space-y-12">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-purple-500 size-10" />
                </div>
              ) : tutors.length > 0 ? (
                <>
                  {/* Adjusted to 3 columns for better spacing with 10 items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.map((tutor) => (
                      <div key={tutor.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-purple-500/50 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all overflow-hidden shrink-0">
                            {tutor.user?.image ? (
                              <img src={tutor.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-white leading-none truncate">{tutor.user?.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black mt-1 truncate">
                              {tutor.user?.email || "No Email"}
                            </p>
                          </div>
                        </div>
                        
                        <Link href={`/tutorsingleprofile/${tutor.id}`}>
                          <Button className="w-full rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black font-bold text-xs py-5 transition-all duration-300">
                            View Profile <ArrowRight size={14} className="ml-2" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* ACTION FOOTER INSIDE TABS CONTENT */}
                  <div className="flex justify-center pt-8">
                    <Link href="/admin/TeacherFullList">
                      <Button 
                        variant="ghost" 
                        className="px-10 py-7 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-purple-400 font-bold text-lg group transition-all"
                      >
                        View Full Teacher Directory
                        <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-[2rem]">
                  <p className="text-gray-500 uppercase text-xs font-black">No recent teachers found</p>
                </div>
              )}
            </TabsContent>

            {/* OTHER TABS CONTENT... */}
          </Tabs>
        </section>
      </div>
    </div>
  );
}