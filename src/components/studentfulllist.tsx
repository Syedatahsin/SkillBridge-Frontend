"use client";

import React, { useEffect, useState } from "react";
import { 
  User, ArrowLeft, Loader2, Mail, Calendar, ChevronRight, ShieldAlert, ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AllStudentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFullList = async () => {
    try {
      setLoading(true);
      // We pass limit=0 to get everyone, and role=STUDENT to filter
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?limit=0&role=STUDENT`);
      const json = await res.json();
      
      if (json.success) {
        // Based on our new service logic, data is in json.data
        setData(json.data);
      }
    } catch (error) {
      console.error("Error fetching full student list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullList();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans transition-colors duration-300">
      <div className="container mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-border/10 pb-10">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="pl-0 text-muted-foreground hover:text-purple-400 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Return to Dashboard
            </Button>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-foreground">
              Student <span className="text-purple-500">Database</span>
            </h1>
            <p className="text-muted-foreground font-medium italic">
              Viewing {data.length} registered students in the master directory.
            </p>
          </div>
        </div>

        {/* LIST CONTAINER */}
        <div className="bg-card border border-border/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-md transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground border-b border-border/10 bg-muted/5">
                  <th className="px-8 py-7">Student Name</th>
                  <th className="px-8 py-7">Account Status</th>
                  <th className="px-8 py-7">Joined Date</th>
                  <th className="px-8 py-7 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                        <p className="text-muted-foreground text-xs uppercase tracking-widest font-black">Scanning Database...</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((student) => {
                    const isBanned = student.status === "BANNED";
                    return (
                      <tr 
                        key={student.id} 
                        onClick={() => router.push(`/studentsingleprofile/${student.id}`)}
                        className="hover:bg-muted/5 transition-colors group cursor-pointer"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="size-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:border-purple-500/50 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                              {student.image ? (
                                <img src={student.image} className="size-full object-cover rounded-2xl" alt="" />
                              ) : (
                                <User size={20} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground text-lg group-hover:text-purple-400 transition-colors">
                                {student.name}
                              </p>
                              <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
                                <Mail size={12} />
                                <span>{student.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          {isBanned ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase border border-red-500/20">
                              <ShieldAlert size={10} /> Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20">
                              <ShieldCheck size={10} /> Active
                            </span>
                          )}
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                            <Calendar size={14} className="text-muted-foreground/60" />
                            {new Date(student.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                          </div>
                        </td>

                        <td className="px-8 py-6 text-right">
                           <div className="inline-flex items-center justify-center size-10 rounded-xl bg-muted text-muted-foreground group-hover:bg-purple-500 group-hover:text-white transition-all">
                              <ChevronRight size={18} />
                           </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-muted-foreground italic">
                      No students found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-border/10 bg-muted/5 flex justify-between items-center">
            <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              End of Directory
            </span>
            <span className="text-muted-foreground/80 text-xs font-bold">
              Total Records: <span className="text-purple-500">{data.length}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}