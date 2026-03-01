"use client";

import React, { useEffect, useState } from "react";
import { 
  User, ArrowRight, Loader2, GraduationCap, Users, Calendar, Clock, ArrowRightLeft
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [tutorRes, studentRes, bookingRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/alltutor?limit=10`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?role=STUDENT&limit=10`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/bookings?limit=10`)
        ]);

        const tutorJson = await tutorRes.json();
        const studentJson = await studentRes.json();
        const bookingJson = await bookingRes.json();
        
        if (tutorJson.success) setTutors(tutorJson.data);
        if (studentJson.success) setStudents(studentJson.data);
        if (bookingJson.success) setBookings(bookingJson.data);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
                <p className="text-zinc-500 font-medium italic">Showing the latest platform logs.</p>
              </div>
              
              {/* TABS LIST - Fixed visibility for dark background */}
              <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-full h-auto flex-wrap">
                <TabsTrigger 
                  value="teachers" 
                  className="rounded-full px-8 py-3 text-zinc-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold flex gap-2 transition-all"
                >
                   <GraduationCap size={18} /> Teachers
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="rounded-full px-8 py-3 text-zinc-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold flex gap-2 transition-all"
                >
                   <Users size={18} /> Students
                </TabsTrigger>
                <TabsTrigger 
                  value="bookings" 
                  className="rounded-full px-8 py-3 text-zinc-400 data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold flex gap-2 transition-all"
                >
                   <Calendar size={18} /> Bookings
                </TabsTrigger>
              </TabsList>
            </div>

            {/* --- TEACHERS TAB --- */}
            <TabsContent value="teachers" className="outline-none space-y-12">
              {loading ? <LoadingState /> : tutors.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.map((tutor) => (
                      <UserCard key={tutor.id} user={tutor.user} href={`/tutorsingleprofile/${tutor.id}`} />
                    ))}
                  </div>
                  <ViewAllButton href="/TeacherFullList" label="Teacher Directory" />
                </>
              ) : <EmptyState message="No teachers found" />}
            </TabsContent>

            {/* --- STUDENTS TAB --- */}
            <TabsContent value="users" className="outline-none space-y-12">
              {loading ? <LoadingState /> : students.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((student) => (
                      <UserCard key={student.id} user={student} href={`/studentsingleprofile/${student.id}`} />
                    ))}
                  </div>
                  <ViewAllButton href="/studentlist" label="Student Directory" />
                </>
              ) : <EmptyState message="No students found" />}
            </TabsContent>

            {/* --- BOOKINGS TAB --- */}
            <TabsContent value="bookings" className="outline-none space-y-12">
               {loading ? <LoadingState /> : bookings.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                  <ViewAllButton href="/viewallbookings" label="Full Booking Logs" />
                </>
              ) : <EmptyState message="No recent bookings" />}
            </TabsContent>

          </Tabs>
        </section>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function BookingCard({ booking }: { booking: any }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-purple-500/50 transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-500">
                <Calendar size={18} />
            </div>
            <div>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-none">Status</p>
                <p className="text-xs font-bold text-emerald-400 mt-1 uppercase">
                  {booking.status}
                </p>
            </div>
        </div>
        <span className="text-[10px] font-mono text-zinc-600">REF: {booking.id.slice(-6).toUpperCase()}</span>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
        <div className="text-center flex-1">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Student</p>
            <p className="font-bold text-white truncate text-sm">{booking.student?.name}</p>
        </div>
        <ArrowRightLeft className="text-zinc-700" size={16} />
        <div className="text-center flex-1">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Instructor</p>
            <p className="font-bold text-white truncate text-sm">{booking.tutor?.user?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-zinc-400">
         <div className="flex items-center gap-2 text-xs font-medium">
            <Clock size={14} className="text-purple-500" />
            {new Date(booking.availability?.startTime).toLocaleDateString()}
         </div>
         <div className="h-1 w-1 rounded-full bg-zinc-800" />
         <div className="text-xs font-mono text-zinc-500 uppercase">
            {new Date(booking.availability?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </div>
    </div>
  );
}

function UserCard({ user, href }: { user: any, href: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:border-purple-500/50 transition-all group">
      <div className="flex items-center gap-4 mb-6">
        <div className="size-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all overflow-hidden shrink-0">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-white text-lg truncate tracking-tight">{user?.name || "Unknown User"}</p>
          <p className="text-[10px] text-zinc-500 uppercase font-black mt-1 truncate tracking-widest">
            {user?.email || "No Email Linked"}
          </p>
        </div>
      </div>
      
      <Link href={href}>
        <Button className="w-full rounded-2xl bg-white/5 border border-white/5 hover:bg-white hover:text-black font-black text-[10px] uppercase tracking-widest py-6 transition-all duration-300">
          Profile Details <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-purple-500 size-10" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-24 border border-dashed border-white/10 rounded-[3rem]">
      <p className="text-zinc-600 uppercase text-[10px] font-black tracking-[0.3em]">{message}</p>
    </div>
  );
}

function ViewAllButton({ href, label }: { href: string, label: string }) {
  return (
    <div className="flex justify-center pt-8">
      <Link href={href}>
        <Button 
          variant="ghost" 
          className="px-12 py-8 rounded-full border border-white/5 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-purple-500/50 font-bold group transition-all"
        >
          View Full {label}
          <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}