"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Save, User as UserIcon, DollarSign, BookOpen, Settings, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
}

export default function GlobalUpdateProfile() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user as ExtendedUser | undefined;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [userName, setUserName] = useState("");
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [price, setPrice] = useState(0);
  const [exp, setExp] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  
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
      const idRes = await fetch(`${API_BASE}/api/tutor/tutorid/${uid}`);
      if (!idRes.ok) return;

      const idData = await idRes.json();
      const tid = idData.id || idData.tutorId || (typeof idData === "string" ? idData : null);
      
      if (!tid) return;

      setTutorId(tid);

      const profileRes = await fetch(`${API_BASE}/api/tutor/public/${tid}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setBio(profileData.bio || "");
        setPrice(profileData.pricePerHour || 0);
        setExp(profileData.experience || 0);
      }
    } catch (err) {
      console.log("No existing tutor profile found for this account.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // 1. Update User Name in your Database
      const userRes = await fetch(`${API_BASE}/api/users/update/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName }),
      });

      if (!userRes.ok) throw new Error("Failed to update account name.");

      // 2. FORCE REFRESH SESSION (This fixes the name not changing immediately)
      await authClient.getSession({
        fetchOptions: {
          cache: "no-store", 
        },
      });
      
      // Syncs Server Components like Navbars
      router.refresh(); 

      // 3. Update Tutor Profile if applicable
      if (user?.role === "TUTOR" && tutorId) {
        const tutorRes = await fetch(`${API_BASE}/api/tutor/update/${tutorId}`, {
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

  if (authLoading) return <div className="flex justify-center py-20 transition-colors duration-300"><Loader2 className="animate-spin text-purple-600" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-4 transition-colors duration-300">
      <div className="bg-card border border-border/50 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px]" />
        
        <header className="mb-10">
          <div className="flex items-center gap-3 text-purple-500 mb-2">
            <Settings size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Control Panel</span>
          </div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter leading-none">
              Update <span className="text-purple-600">{user?.role}</span>
          </h2>
        </header>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <BadgeCheck size={14} className="text-muted-foreground" /> Identity Node
            </h3>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-muted/10 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-foreground font-bold focus:border-purple-600 outline-none transition-all"
              />
            </div>
          </div>

          {user?.role === "TUTOR" && (
            <div className="space-y-6 pt-8 border-t border-border/50 animate-in slide-in-from-bottom-4 duration-700">
               <h3 className="text-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14} className="text-purple-500" /> Professional Logic
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" size={18} />
                  <input 
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-muted/10 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-foreground font-bold focus:border-purple-600 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-black text-[10px]">EXP</span>
                  <input 
                    type="number"
                    value={exp}
                    onChange={(e) => setExp(Number(e.target.value))}
                    className="w-full bg-muted/10 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-foreground font-bold focus:border-purple-600 outline-none transition-all"
                  />
                </div>
              </div>

              <textarea 
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-muted/10 border border-border/50 rounded-2xl p-6 text-foreground font-medium focus:border-purple-600 outline-none transition-all resize-none"
                placeholder={tutorId ? "Write your professional bio..." : "No tutor profile linked to this account yet."}
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
            className="w-full bg-foreground text-background font-black uppercase py-5 rounded-2xl tracking-[0.3em] text-xs hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Push Updates</>}
          </button>
        </form>
      </div>
    </div>
  );
}