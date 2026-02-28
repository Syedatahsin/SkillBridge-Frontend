import GlobalUpdateProfile from "@/components/unifiedUpdateProfile";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Profile Settings | Tutor Terminal",
  description: "Update your personal and professional identity.",
};

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20 relative z-10">
        
        {/* Navigation / Header Area */}
        <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
          <Link 
            href="/profile" 
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all"
          >
            <div className="size-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Profile</span>
          </Link>
          
          <div className="hidden md:block">
            <span className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.4em] select-none">
              Terminal v2.0.26
            </span>
          </div>
        </div>

        {/* The Main Update Form Component */}
        <GlobalUpdateProfile />

        {/* Footer Note */}
        <p className="text-center mt-12 text-zinc-600 font-bold text-[9px] uppercase tracking-[0.3em]">
          All updates are deployed in real-time to the production database.
        </p>
      </div>
    </main>
  );
}