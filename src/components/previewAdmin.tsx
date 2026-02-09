"use client";

import React from "react";
import { 
  Code2, Palette, BarChart3, Globe2, Cpu, FlaskConical, 
  Music, Camera, Languages, Layers, ShieldCheck, Zap,
  Plus, LucideIcon, User, Calendar, ArrowRight, ExternalLink, MoreVertical, ListFilter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// --- Types & Data ---
interface Category {
  name: string;
  icon: LucideIcon;
  count: string;
  color: string;
}

const CATEGORIES: Category[] = [
  { name: "Development", icon: Code2, count: "120+ Tutors", color: "from-blue-500/20" },
  { name: "Design", icon: Palette, count: "85+ Tutors", color: "from-purple-500/20" },
  { name: "Business", icon: BarChart3, count: "60+ Tutors", color: "from-indigo-500/20" },
  { name: "Marketing", icon: Globe2, count: "45+ Tutors", color: "from-pink-500/20" },
  { name: "IT & Software", icon: Cpu, count: "90+ Tutors", color: "from-cyan-500/20" },
  { name: "Science", icon: FlaskConical, count: "30+ Tutors", color: "from-emerald-500/20" },
];

export default function AdminDashboard() {
  return (
    <div className="bg-black min-h-screen pb-20 text-white font-sans">
      <div className="container mx-auto px-4">
        
        {/* SECTION 1: CATEGORY MANAGEMENT */}
        <section className="pt-12">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Categories</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl font-medium">
                Update learning sectors and tutor distributions.
              </p>
            </div>
            <Button variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 hidden md:flex">
                <ListFilter size={16} className="mr-2" /> Filter Categories
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card className="group relative overflow-hidden border-2 border-dashed border-white/10 bg-transparent transition-all duration-300 hover:border-purple-500/50 hover:bg-white/5 cursor-pointer h-[180px]">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  <Plus size={28} />
                </div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Create New</h3>
              </CardContent>
            </Card>

            {CATEGORIES.map((cat, i) => {
              const IconComponent = cat.icon;
              return (
                <Card 
                  key={`admin-cat-grid-${i}`} 
                  className="group relative overflow-hidden border-white/5 bg-[#0A0A0A] transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-1 cursor-pointer h-[180px]"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", cat.color, "to-transparent")} />
                  <CardContent className="p-6 relative z-10 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-purple-400 group-hover:scale-110 group-hover:text-white group-hover:bg-purple-600 transition-all duration-300">
                      <IconComponent size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{cat.name}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{cat.count}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: SYSTEM TABS */}
        <section className="mt-24">
          <Tabs defaultValue="bookings" className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Recent Activity</h2>
                <p className="text-gray-500 font-medium italic">Track the latest sessions and user registrations.</p>
              </div>
              
              <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-full h-auto flex-wrap">
                <TabsTrigger value="bookings" className="rounded-full px-8 py-3 data-[state=active]:bg-purple-600 font-bold">Bookings</TabsTrigger>
                <TabsTrigger value="teachers" className="rounded-full px-8 py-3 data-[state=active]:bg-purple-600 font-bold">Teachers</TabsTrigger>
                <TabsTrigger value="users" className="rounded-full px-8 py-3 data-[state=active]:bg-purple-600 font-bold">Students</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="bookings" className="outline-none">
              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5">
                        <th className="px-8 py-6">Student</th>
                        <th className="px-8 py-6">Instructor</th>
                        <th className="px-8 py-6">Schedule</th>
                        <th className="px-8 py-6">Revenue</th>
                        <th className="px-8 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[1, 2, 3].map((item) => (
                        <tr key={`book-row-${item}`} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-6 font-bold">Sarah Ahmed</td>
                          <td className="px-8 py-6 text-purple-400 font-medium">Mr. Rahat</td>
                          <td className="px-8 py-6 text-gray-400 text-sm">Today, 4:00 PM</td>
                          <td className="px-8 py-6 font-black text-emerald-400">$25.00</td>
                          <td className="px-8 py-6 text-right"><MoreVertical size={18} className="inline text-gray-600 cursor-pointer" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {["teachers", "users"].map((tab) => (
              <TabsContent key={`content-key-${tab}`} value={tab}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((item, idx) => (
                    <div key={`user-key-${tab}-${idx}`} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-purple-500/50 transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="size-12 rounded-2xl bg-white/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-white leading-none">User #{idx + 101}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-black mt-1">@username</p>
                        </div>
                      </div>
                      <Button className="w-full rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black font-bold text-xs py-5">
                        View Profile <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* THE UPDATED FOOTER BUTTON */}
          <div className="flex justify-center mt-16">
            <Button 
              variant="ghost" 
              className="px-10 py-7 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-purple-400 font-bold text-lg group transition-all"
            >
              View Full List of Records
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

        </section>
      </div>
    </div>
  );
}