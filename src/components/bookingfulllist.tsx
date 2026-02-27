"use client";

import React, { useEffect, useState } from "react";
import { 
  ArrowLeft, Loader2, Calendar, Clock, User, ArrowRight, ChevronRight, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AllBookingsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFullList = async () => {
    try {
      setLoading(true);
      // Fetching all bookings (limit=0) using the standardized endpoint
      const res = await fetch(`http://localhost:5000/api/bookings/bookings?limit=0`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Error fetching full booking list:", error);
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
              Booking <span className="text-purple-500">Log</span>
            </h1>
            <p className="text-zinc-500 font-medium">
              Monitoring {data.length} scheduled sessions across the platform.
            </p>
          </div>
        </div>

        {/* LIST CONTAINER */}
        <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-7">Student & Instructor</th>
                  <th className="px-8 py-7">Schedule</th>
                  <th className="px-8 py-7">Status</th>
                  <th className="px-8 py-7 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Accessing Logs...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="hover:bg-white/[0.02] transition-colors group cursor-default"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          {/* Student Info */}
                          <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 uppercase font-black tracking-tighter">Student</span>
                            <span className="font-bold text-zinc-100">{booking.student?.name}</span>
                          </div>
                          
                          <ArrowRight size={14} className="text-purple-500 mx-2" />

                          {/* Teacher Info */}
                          <div className="flex flex-col">
                            <span className="text-xs text-zinc-500 uppercase font-black tracking-tighter">Instructor</span>
                            <span className="font-bold text-zinc-100">{booking.tutor?.user?.name}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-zinc-100 text-sm font-bold">
                            <Calendar size={14} className="text-purple-500" />
                            {new Date(booking.availability?.startTime).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </div>
                          <div className="flex items-center gap-2 text-zinc-500 text-xs">
                            <Clock size={12} />
                            {new Date(booking.availability?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        {booking.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20">
                            <CheckCircle2 size={12} /> {booking.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-[10px] font-black uppercase border border-purple-500/20">
                            <AlertCircle size={12} /> {booking.status}
                          </span>
                        )}
                      </td>

                      <td className="px-8 py-6 text-right">
                         <div className="text-[10px] font-mono text-zinc-600 uppercase">
                            ID: {booking.id.slice(-8)}
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-zinc-600 italic">
                      No session history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Log Data Verified
            </span>
            <span className="text-zinc-400 text-xs font-medium">
              Total Sessions: {data.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}