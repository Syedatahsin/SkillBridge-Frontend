"use client";

import React, { useState, useEffect } from "react";
import { 
  User, Mail, ShieldCheck, GraduationCap, 
  Star, DollarSign, BookOpen, Loader2 
} from "lucide-react";

interface ProfileProps {
  userId: string;
  role: "student" | "teacher" | "admin";
}

export default function UnifiedProfile({ userId, role }: ProfileProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // We call a unified endpoint that returns User + TutorProfile (if teacher)
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/${userId}`);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId, role]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#050505]">
        <Loader2 className="animate-spin text-purple-600 size-12 mb-4" />
        <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Database...</p>
      </div>
    );
  }

  if (!profileData) return <div className="text-white text-center py-20">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-1">
      {/* PROFILE HEADER CARD */}
      <div className="bg-[#0A0A0B] border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -z-10" />

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className="size-32 md:size-40 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-600 p-1">
              <div className="w-full h-full rounded-[2.3rem] bg-[#050505] flex items-center justify-center overflow-hidden">
                {profileData.image ? (
                  <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="size-16 text-purple-500" />
                )}
              </div>
            </div>
            {/* Role Badge */}
            <div className="absolute -bottom-2 -right-2 bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              {role}
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-2">
              {profileData.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                <Mail className="size-4 text-purple-500" />
                {profileData.email}
              </div>
              {role === "admin" && (
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                  <ShieldCheck className="size-4" />
                  System Controller
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TEACHER SPECIFIC EXTRA INFO */}
        {role === "teacher" && profileData.tutorProfile && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-12 border-t border-white/5">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Hourly Rate</p>
                <div className="flex items-center gap-2 text-2xl font-black text-white italic">
                  <DollarSign className="text-purple-500" />
                  {profileData.tutorProfile.price || "0"}/hr
                </div>
              </div>
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Rating</p>
                <div className="flex items-center gap-2 text-2xl font-black text-white italic">
                  <Star className="text-yellow-500 fill-yellow-500" />
                  {profileData.tutorProfile.rating || "5.0"}
                </div>
              </div>
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Subject</p>
                <div className="flex items-center gap-2 text-2xl font-black text-white italic uppercase tracking-tighter">
                  <BookOpen className="text-purple-500" />
                  {profileData.tutorProfile.expertise || "Expert"}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white/5 rounded-[2rem] p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="text-purple-500" />
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">About Mentor</h3>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed">
                {profileData.tutorProfile.bio || "No biography provided yet."}
              </p>
            </div>
          </>
        )}

        {/* ADMIN/STUDENT SPECIFIC VIEW */}
        {(role === "admin" || role === "student") && (
          <div className="mt-12 p-8 rounded-[2rem] border border-purple-500/20 bg-purple-500/5">
            <h3 className="text-sm font-black text-purple-500 uppercase tracking-[0.3em] mb-4">Account Metadata</h3>
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Account ID: <span className="text-white ml-2">{profileData.id}</span>
              </p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Status: <span className="text-emerald-500 ml-2">Verified Active</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}