"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Clock, Video, ArrowRight, 
  UserCheck, MessageSquare, XCircle, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SessionProps {
  role: "teacher" | "student";
}

 const SessionManagement = ({ role }: SessionProps) => {
  // Teachers get the "Cancelled" tab, students just see "Upcoming" and "Completed"
  const statuses = role === "teacher" 
    ? ["upcoming", "completed", "cancelled"] 
    : ["upcoming", "completed"];

  return (
    <section className="mt-20">
      <Tabs defaultValue="upcoming" className="w-full">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {role === "teacher" ? "Teaching Schedule" : "My Learning Schedule"}
            </h2>
            <p className="text-gray-500 font-medium">
              {role === "teacher" 
                ? "Manage your students and upcoming classes." 
                : "Manage your lessons and join virtual classrooms."}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1.5 rounded-[2rem]">
            <TabsList className="bg-transparent border-none gap-2">
              {statuses.map((status) => (
                <TabsTrigger 
                  key={status}
                  value={status} 
                  className="rounded-full px-8 py-2.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 font-bold transition-all capitalize"
                >
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* CONTENT SECTION */}
        {statuses.map((status) => (
          <TabsContent key={status} value={status} className="space-y-8 outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div 
                  key={item} 
                  className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.07] hover:border-purple-500/50 transition-all duration-300"
                >
                  {/* Card Badge/Icon */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg shadow-purple-500/20">
                      <div className="bg-slate-950 size-full rounded-[14px] flex items-center justify-center">
                        {status === "cancelled" ? (
                          <XCircle className="text-rose-500" size={24} />
                        ) : status === "completed" ? (
                          <CheckCircle2 className="text-emerald-400" size={24} />
                        ) : (
                          <UserCheck className="text-purple-400" size={24} />
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID</p>
                      <p className="text-sm font-bold text-white">#SB-204{item}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    Advanced UI Design
                  </h3>
                  <p className="text-gray-400 text-sm font-medium mb-6">
                    {role === "teacher" ? "with Student " : "with Prof. "} 
                    <span className="text-white">{role === "teacher" ? "Rahat Islam" : "Sarah Drasner"}</span>
                  </p>

                  {/* Time Info */}
                  <div className="flex items-center gap-4 py-5 border-y border-white/5 mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                      <Calendar size={14} className="text-purple-500" /> Oct 24
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                      <Clock size={14} className="text-purple-500" /> 10:00 AM
                    </div>
                  </div>

                  {/* ACTION BUTTONS (Role & Status Dependent) */}
                  <div className="flex gap-3">
                    {status === "upcoming" ? (
                      <>
                        <Button className="flex-1 rounded-2xl bg-purple-600 hover:bg-purple-700 font-bold h-12 shadow-lg shadow-purple-500/20">
                          <Video size={18} className="mr-2" /> 
                          {role === "teacher" ? "Start Session" : "Join Class"}
                        </Button>
                        <Button variant="outline" size="icon" className="size-12 rounded-2xl border-white/10 bg-white/5 text-gray-400 hover:text-white">
                          <MessageSquare size={18} />
                        </Button>
                      </>
                    ) : status === "completed" ? (
                      <Button className="w-full rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold h-12">
                        {role === "teacher" ? "View Summary" : "Rate Experience"}
                      </Button>
                    ) : (
                      <Button disabled className="w-full rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-bold h-12">
                        Session Cancelled
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* VIEW ALL FOOTER */}
            <div className="flex justify-center pt-8">
              <Button variant="ghost" className="text-gray-500 hover:text-purple-400 font-bold gap-2 group">
                {role === "teacher" ? "View teaching history" : "View learning history"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );

};
export default SessionManagement;   