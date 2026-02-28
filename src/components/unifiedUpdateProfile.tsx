"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Save, User as UserIcon, DollarSign, BookOpen, Settings, BadgeCheck } from "lucide-react";

// 1. Define the interface to include the 'role' property
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
}

export default function GlobalUpdateProfile() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  
  // 2. Cast the user to the ExtendedUser type
  const user = session?.user as ExtendedUser | undefined;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [userName, setUserName] = useState("");
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [price, setPrice] = useState(0);
  const [exp, setExp] = useState(0);
  
  useEffect(() => {
    if (user) {
      setUserName(user.name || "");
      if (user.role === "TUTOR") {
        fetchTutorData(user.id);
      }
    }
  }, [user]);

  const fetchTutorData = async (uid: string) => {
    try {
      const idRes = await fetch(`http://localhost:5000/api/tutor/tutorid/${uid}`);
      const idData = await idRes.json();
      
      const tid = idData.id || idData.tutorId || (typeof idData === "string" ? idData : null);
      
      if (!tid) {
        console.error("Tutor ID extraction failed. Received:", idData);
        return;
      }

      setTutorId(tid);

      const profileRes = await fetch(`http://localhost:5000/api/tutor/public/${tid}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setBio(profileData.bio || "");
        setPrice(profileData.pricePerHour || 0);
        setExp(profileData.experience || 0);
      }
    } catch (err) {
      console.error("Error loading tutor data:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const userRes = await fetch(`http://localhost:5000/api/users/update/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName }),
      });

      if (!userRes.ok) throw new Error("Failed to update user name.");

      if (user?.role === "TUTOR" && tutorId) {
        const tutorRes = await fetch(`http://localhost:5000/api/tutor/update/${tutorId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            bio, 
            pricePerHour: Number(price), 
            experience: Number(exp) 
          }),
        });

        if (!tutorRes.ok) {
            const errBody = await tutorRes.json();
            throw new Error(errBody.message || "Tutor profile update failed.");
        }
      }

      setMessage({ type: "success", text: "Profile Synchronized Successfully" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-[#0A0A0B] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px]" />
        
        <header className="mb-10">
          <div className="flex items-center gap-3 text-purple-500 mb-2">
            <Settings size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Control Panel</span>
          </div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
             Update <span className="text-purple-600">{user?.role}</span>
          </h2>
        </header>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <BadgeCheck size={14} className="text-zinc-500" /> Identity Node
            </h3>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:border-purple-600 outline-none transition-all"
              />
            </div>
          </div>

          {user?.role === "TUTOR" && (
            <div className="space-y-6 pt-8 border-t border-white/5 animate-in slide-in-from-bottom-4 duration-700">
               <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} className="text-purple-500" /> Professional Logic
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" size={18} />
                  <input 
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:border-purple-600 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-black text-[10px]">EXP</span>
                  <input 
                    type="number"
                    value={exp}
                    onChange={(e) => setExp(Number(e.target.value))}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:border-purple-600 outline-none transition-all"
                  />
                </div>
              </div>

              <textarea 
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-white font-medium focus:border-purple-600 outline-none transition-all resize-none"
                placeholder="Write your professional bio..."
              />
            </div>
          )}

          {message.text && (
            <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-in zoom-in-95 ${
              message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase py-5 rounded-2xl tracking-[0.3em] text-xs hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Push Updates</>}
          </button>
        </form>
      </div>
    </div>
  );
}