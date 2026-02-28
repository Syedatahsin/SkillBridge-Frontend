"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { 
  Search, ChevronDown, LayoutGrid, User, 
  Loader2, Star, Settings, LogOut, UserCircle 
} from "lucide-react";

// 1. Import your authClient
import { authClient } from "@/lib/auth-client"; 

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  role?: "public" | "student" | "teacher" | "admin" | "tutor"; // Added tutor if needed
  userId?: string;
}

export default function SkillBridgeNavbar({ role = "public", userId }: NavbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 2. LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/"); // Redirect to home
            router.refresh();  // Refresh to clear session state
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories/get");
        if (response.ok) {
          const result = await response.json();
          const data = Array.isArray(result) ? result : result.data;
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Category fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const form = useForm({
    defaultValues: { query: "", subject: "Subject", rating: 0, minPrice: undefined as number | undefined, maxPrice: undefined as number | undefined },
    onSubmit: async ({ value }) => {
      const params = new URLSearchParams();
      if (value.query) params.append("search", value.query);
      if (value.subject && value.subject !== "Subject") params.append("categories", value.subject);
      router.push(`/find-tutors?${params.toString()}`);
    },
  });

  if (!mounted) return <nav className="h-24 bg-[#050505] border-b border-white/10 w-full" />;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl text-white">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between gap-6">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2.5 rounded-2xl group-hover:rotate-6 transition-all shadow-lg shadow-purple-500/20">
            <LayoutGrid className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">
              SKILL<span className="text-purple-500">BRIDGE</span>
            </span>
          </div>
        </Link>

        {/* SEARCH BAR (Visible for Public/Student) */}
        {(role === "public" || role === "student") && (
          <form
            onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
            className="hidden xl:flex flex-1 max-w-5xl items-center bg-white/[0.03] border border-white/10 rounded-full p-1.5 pl-6 focus-within:border-purple-500/50 transition-all shadow-2xl"
          >
            <Search className="size-4 text-purple-500 shrink-0" />
            <form.Field name="query">
              {(field) => (
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Find a mentor..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full px-4 placeholder:text-gray-600 font-bold outline-none"
                />
              )}
            </form.Field>
            <Button type="submit" className="rounded-full bg-purple-600 hover:bg-purple-700 px-8 font-black uppercase text-[10px] tracking-widest h-11 transition-all shadow-lg shadow-purple-500/20">
              Find
            </Button>
          </form>
        )}

        {/* AUTH SECTION */}
        <div className="flex items-center gap-6 shrink-0">
          {role === "public" ? (
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">Login</Link>
              <Link href="/registration">
                <Button className="rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest px-8 h-12 hover:bg-purple-600 hover:text-white transition-all">Join Now</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all group">
                   {isLoggingOut ? <Loader2 className="size-5 animate-spin text-purple-500" /> : <User className="size-5 text-purple-500 group-hover:scale-110 transition-transform" />}
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="bg-[#0A0A0B] border-white/10 text-white rounded-2xl p-2 min-w-[220px] shadow-2xl mt-2 animate-in fade-in zoom-in duration-200">
                <DropdownMenuLabel className="px-3 py-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Account Control</p>
                  <p className="text-xs font-bold text-purple-400 mt-1 capitalize">{role} Mode</p>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-white/5" />
                
                <DropdownMenuItem onClick={() => router.push(`/profileview`)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-white/5 flex items-center gap-3">
                  <UserCircle className="size-4 text-blue-400" /> View Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push(`/${role}/settings`)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-white/5 flex items-center gap-3">
                  <Settings className="size-4 text-purple-400" /> Update Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/5" />

                {/* UPDATED LOGOUT ITEM */}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-rose-500/10 text-rose-500 flex items-center gap-3 focus:bg-rose-500/10 focus:text-rose-500"
                >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Signing out..." : "Logout Session"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}