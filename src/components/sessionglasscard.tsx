"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SESSIONS = [
  { id: 1, student: "Rahat Islam", subject: "Next.js Mastery", time: "10:00 AM", date: "Oct 24", status: "upcoming" },
  { id: 2, student: "Anika Jannat", subject: "UI Design", time: "02:00 PM", date: "Oct 22", status: "completed" },
  { id: 3, student: "Tanvir Ahmed", subject: "React Basics", time: "09:00 AM", date: "Oct 20", status: "cancelled" },
];

export const TeacherSessions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Sessions</h2>
        <Button className="bg-purple-600 hover:bg-purple-700 rounded-full text-xs">
          Schedule New
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-full mb-8">
          <TabsTrigger value="upcoming" className="rounded-full data-[state=active]:bg-purple-600">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full data-[state=active]:bg-purple-600">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-full data-[state=active]:bg-purple-600">Cancelled</TabsTrigger>
        </TabsList>

        {["upcoming", "completed", "cancelled"].map((status) => (
          <TabsContent key={status} value={status} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SESSIONS.filter(s => s.status === status).map((session) => (
              <Card key={session.id} className="bg-white/5 border-white/10 hover:border-purple-500/50 transition-all overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <User size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">#{session.id}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg">{session.student}</h3>
                  <p className="text-purple-400 text-sm mb-4">{session.subject}</p>
                  
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1"><Calendar size={14} /> {session.date}</div>
                    <div className="flex items-center gap-1"><Clock size={14} /> {session.time}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};