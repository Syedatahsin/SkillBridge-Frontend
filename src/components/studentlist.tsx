"use client";

import React, { useState } from "react";
import { 
  Search, MoreHorizontal, Mail, Calendar, 
  User as UserIcon, Ban, ShieldCheck, ChevronLeft, 
  ChevronRight, UserCheck, Trash2, Zap, GraduationCap, Briefcase,
  Verified
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// --- DUMMY DATA ---
const DUMMY_STUDENTS = [
  { id: "s1", name: "Anika Jannat", email: "anika@email.com", emailVerified: true, createdAt: "2026-01-15T10:00:00Z", status: "active" },
  { id: "s2", name: "Rahat Islam", email: "rahat@email.com", emailVerified: true, createdAt: "2026-02-01T14:30:00Z", status: "active" },
  { id: "s3", name: "Tanvir Hasan", email: "tanvir@email.com", emailVerified: true, createdAt: "2025-12-20T09:00:00Z", status: "suspended" },
];

const DUMMY_TEACHERS = [
  { id: "t1", name: "Dr. Sarah Smith", email: "sarah@email.com", emailVerified: true, createdAt: "2025-05-10T10:00:00Z", status: "active" },
  { id: "t2", name: "Prof. Ahmed Ali", email: "ahmed@email.com", emailVerified: true, createdAt: "2025-08-12T14:30:00Z", status: "active" },
  { id: "t3", name: "Jessica Ray", email: "jess@email.com", emailVerified: true, createdAt: "2025-11-05T09:00:00Z", status: "banned" },
];

interface UniversalTableProps {
  role: "student" | "teacher";
}

const UniversalUserTable = ({ role }: UniversalTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isStudent = role === "student";
  const displayData = isStudent ? DUMMY_STUDENTS : DUMMY_TEACHERS;

  // Unified Theme
  const accentText = "text-purple-500";
  const accentBg = "bg-purple-600";

  const filteredData = displayData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-[#0A0A0B] text-white p-1 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="bg-[#111113] p-8 rounded-t-[2.3rem] border-b border-white/5">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white capitalize">
              {role} <span className={accentText}>List</span>
            </h1>
            <p className="text-gray-500 font-medium">Manage all your {role}s in one place.</p>
          </div>
          
          <div className="relative w-full lg:w-[400px]">
            <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2", accentText)} size={20} />
            <Input 
              placeholder={`Search by name or email...`} 
              className="pl-12 h-14 bg-black border-2 border-purple-500/20 rounded-xl focus:ring-0 transition-all placeholder:text-gray-600 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="p-4">
        <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#161618] text-gray-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-8 py-5">Name</th>
                <th className="px-8 py-5">{isStudent ? "Joined On" : "Started On"}</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((user) => (
                <tr key={user.id} className="group hover:bg-purple-600/[0.03] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={cn("size-12 rounded-xl flex items-center justify-center text-white shadow-lg", accentBg)}>
                         {isStudent ? <GraduationCap size={24} /> : <Briefcase size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-lg text-white">{user.name}</p>
                            {!isStudent && <Verified size={16} className="text-blue-500" />}
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={14} className={accentText} />
                      <span className="text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight border",
                      user.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    )}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className={cn("text-white font-bold rounded-lg px-6 h-10 hover:brightness-110", accentBg)}>
                          Options
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#111113] border border-white/10 text-white w-56 rounded-xl p-1 shadow-xl">
                        <DropdownMenuLabel className="text-gray-500 text-xs px-3 py-2">Settings</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg focus:bg-purple-600 p-3 font-medium cursor-pointer">
                          <ShieldCheck className="mr-2" size={18} /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem className="rounded-lg text-rose-500 focus:bg-rose-600 focus:text-white p-3 font-bold cursor-pointer">
                          <Ban className="mr-2" size={18} /> Stop Access
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg text-gray-400 hover:text-white focus:bg-red-600 p-3 font-medium cursor-pointer">
                          <Trash2 className="mr-2" size={18} /> Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER --- */}
        <div className="mt-8 flex justify-between items-center px-4">
          <p className="text-gray-500 text-sm font-medium">
            Total {role}s: <span className={accentText}>{filteredData.length}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-white/5 text-gray-500"><ChevronLeft size={20} /></Button>
            <button className={cn("size-10 rounded-lg font-bold text-white shadow-md", accentBg)}>1</button>
            <button className="size-10 rounded-lg font-bold border border-white/10 text-gray-500 hover:bg-white/5 transition-colors">2</button>
            <Button variant="ghost" size="icon" className="hover:bg-white/5 text-gray-500"><ChevronRight size={20} /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalUserTable;