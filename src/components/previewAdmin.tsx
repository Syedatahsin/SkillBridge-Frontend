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
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?limit=10`), // Keeping your limit=10
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/bookings?limit=10`)
        ]);

        const tutorJson = await tutorRes.json();
        const studentJson = await studentRes.json();
        const bookingJson = await bookingRes.json();
        
        if (tutorJson.success) setTutors(tutorJson.data);
        
        // --- ADDED LOGIC HERE ---
        if (studentJson.success) {
          // Filter the users to only include those with the role "STUDENT"
          const filteredStudents = studentJson.data.filter(
            (user: any) => user.role === "STUDENT"
          );
          setStudents(filteredStudents);
        }
        // ------------------------

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
    <div className="bg-background min-h-screen pb-20 text-foreground font-sans transition-colors duration-300">
      <div className="container mx-auto px-4">
        
        <section className="pt-12">
          <Tabs defaultValue="teachers" className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
                  Recent <span className="text-purple-500">Activity</span>
                </h2>
                <p className="text-muted-foreground font-medium italic">Showing the latest platform logs.</p>
              </div>
              
              <TabsList className="bg-muted/10 border border-border/50 p-1.5 rounded-full h-auto flex-wrap transition-colors">
                <TabsTrigger 
                  value="teachers" 
                  className="rounded-full px-8 py-3 text-muted-foreground data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold flex gap-2 transition-all"
                >
                   <GraduationCap size={18} /> Teachers
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="rounded-full px-8 py-3 text-muted-foreground data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold flex gap-2 transition-all"
                >
                   <Users size={18} /> Students
                </TabsTrigger>
                <TabsTrigger 
                  value="bookings" 
                  className="rounded-full px-8 py-3 text-muted-foreground data-[state=active]:bg-purple-600 data-[state=active]:text-white font-bold flex gap-2 transition-all"
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

// --- SUB-COMPONENTS REMAIN THE SAME ---

function BookingCard({ booking }: { booking: any }) {
  return (
    <div className="bg-card border border-border/10 rounded-[2rem] p-6 hover:border-purple-500/50 transition-all group relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-500">
                <Calendar size={18} />
            </div>
            <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">Status</p>
                <p className="text-xs font-bold text-emerald-400 mt-1 uppercase">
                  {booking.status}
                </p>
            </div>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/60">REF: {booking.id.slice(-6).toUpperCase()}</span>
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-muted/20 border border-border/10 mb-6 transition-colors">
        <div className="text-center flex-1">
            <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Student</p>
            <p className="font-bold text-foreground truncate text-sm">{booking.student?.name}</p>
        </div>
        <ArrowRightLeft className="text-zinc-700" size={16} />
        <div className="text-center flex-1">
            <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Instructor</p>
            <p className="font-bold text-foreground truncate text-sm">{booking.tutor?.user?.name}</p>
        </div>
      </div>

       <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2 text-xs font-medium">
             <Clock size={14} className="text-purple-500" />
             {new Date(booking.availability?.startTime).toLocaleDateString()}
          </div>
          <div className="h-1 w-1 rounded-full bg-muted transition-colors" />
          <div className="text-xs font-mono text-muted-foreground/80 uppercase">
             {new Date(booking.availability?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
      </div>
    </div>
  );
}

function UserCard({ user, href }: { user: any, href: string }) {
  return (
    <div className="bg-card border border-border/10 rounded-[2.5rem] p-6 hover:border-purple-500/50 transition-all group shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="size-14 rounded-2xl bg-muted border border-border/50 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all overflow-hidden shrink-0">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-foreground text-lg truncate tracking-tight">{user?.name || "Unknown User"}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-black mt-1 truncate tracking-widest">
            {user?.email || "No Email Linked"}
          </p>
        </div>
      </div>
      
      <Link href={href}>
        <Button className="w-full rounded-2xl bg-muted border border-border/50 hover:bg-foreground hover:text-background font-black text-[10px] uppercase tracking-widest py-6 transition-all duration-300">
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
    <div className="text-center py-24 border border-dashed border-border/50 rounded-[3rem]">
      <p className="text-muted-foreground uppercase text-[10px] font-black tracking-[0.3em]">{message}</p>
    </div>
  );
}

function ViewAllButton({ href, label }: { href: string, label: string }) {
  return (
    <div className="flex justify-center pt-8">
      <Link href={href}>
        <Button 
          variant="ghost" 
          className="px-12 py-8 rounded-full border border-border/10 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-purple-500/50 font-bold group transition-all"
        >
          View Full {label}
          <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}