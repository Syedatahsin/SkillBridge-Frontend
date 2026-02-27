"use client";

import React, { useEffect, useState } from "react";
import { 
  User, ArrowLeft, Loader2, Mail, Calendar, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AllTutorsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFullList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/tutor/alltutor?limit=0`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Error fetching full teacher list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullList();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="container mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="pl-0 text-zinc-500 hover:text-purple-400 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Return to Dashboard
            </Button>
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              Teacher <span className="text-purple-500">Database</span>
            </h1>
            <p className="text-zinc-500 font-medium">
              Viewing {data.length} registered instructors in the master directory.
            </p>
          </div>
        </div>

        {/* LIST CONTAINER */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-7">Instructor</th>
                  <th className="px-8 py-7">Status</th>
                  <th className="px-8 py-7">Joined Date</th>
                  <th className="px-8 py-7 text-right">View Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Loading Directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((tutor) => (
                    <tr 
                      key={tutor.id} 
                      onClick={() => router.push(`/tutorsingleprofile/${tutor.id}`)}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="size-12 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:border-purple-500/50 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                            {tutor.user?.image ? (
                                <img src={tutor.user.image} className="size-full object-cover rounded-2xl" alt="" />
                            ) : (
                                <User size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-100 text-lg">
                              {tutor.user?.name}
                            </p>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                              <Mail size={12} />
                              <span>{tutor.user?.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        {tutor.isBanned ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase border border-red-500/20">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                          <Calendar size={14} className="text-zinc-600" />
                          {new Date(tutor.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                         <div className="inline-flex items-center justify-center size-10 rounded-xl bg-zinc-800/50 text-zinc-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <ChevronRight size={18} />
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-zinc-600 italic">
                      No instructors found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Directory End
            </span>
            <span className="text-zinc-400 text-xs font-medium">
              Total Records: {data.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}