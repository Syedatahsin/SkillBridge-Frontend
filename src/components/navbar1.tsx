"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { 
  Search, ChevronDown, LayoutGrid, User, 
  Loader2, Star, Settings, LogOut, UserCircle, 
  ShieldCheck, GraduationCap 
} from "lucide-react";

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
  role?: "public" | "student" | "teacher" | "admin" | "TUTOR" | "STUDENT" | string; 
  userId?: string;
}

export default function SkillBridgeNavbar({ role = "public", userId }: NavbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 1. Better Auth Logout Handler
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 2. Fetch Categories for the Search Bar
  useEffect(() => {
    setMounted(true);
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/get`);
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

  // 3. Search Form with Min/Max Price and Rating
  const form = useForm({
    defaultValues: {
      query: "",
      subject: "Subject",
      rating: 0,
      minPrice: undefined as number | undefined,
      maxPrice: undefined as number | undefined,
    },
    onSubmit: async ({ value }) => {
      const params = new URLSearchParams();
      if (value.query) params.append("search", value.query);
      if (value.subject && value.subject !== "Subject") params.append("categories", value.subject);
      if (value.minPrice) params.append("minPrice", value.minPrice.toString());
      if (value.maxPrice) params.append("maxPrice", value.maxPrice.toString());
      if (value.rating > 0) params.append("minRating", value.rating.toString());

      router.push(`/find-tutors?${params.toString()}`);
    },
  });

  // 4. Helper for Role-Based Paths
  const getRoleBasePath = () => {
    const r = role.toUpperCase();
    if (r === "TEACHER" || r === "TUTOR") return "/teacher";
    if (r === "STUDENT") return "/student";
    return "";
  };

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

        {/* PREVIOUS SEARCH BAR SECTION (RESTORED) */}
        {(role === "public" || role.toUpperCase() === "STUDENT") && (
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

            <div className="h-6 w-px bg-white/10 mx-1" />

            <form.Field name="subject">
              {(field) => (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-white px-4 outline-none uppercase tracking-widest transition-colors">
                    <span className={field.state.value !== "Subject" ? "text-purple-400" : ""}>
                      {field.state.value}
                    </span>
                    {isLoading ? <Loader2 className="animate-spin size-3" /> : <ChevronDown className="size-3 text-purple-500" />}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0A0A0B] border-white/10 text-white rounded-2xl p-2 min-w-[200px] shadow-2xl">
                    <DropdownMenuItem onClick={() => field.handleChange("Subject")} className="cursor-pointer rounded-xl font-bold text-xs p-3 text-gray-500">
                      All Subjects
                    </DropdownMenuItem>
                    {categories.map((cat) => (
                      <DropdownMenuItem 
                        key={cat.id} 
                        onClick={() => field.handleChange(cat.name)}
                        className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-purple-500/10 hover:text-purple-400"
                      >
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </form.Field>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <form.Field name="rating">
              {(field) => (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-white px-4 outline-none uppercase tracking-widest transition-colors">
                    {field.state.value > 0 ? `${field.state.value}+ Stars` : "Rating"}
                    <Star className={`size-3 ${field.state.value > 0 ? "fill-yellow-500 text-yellow-500" : "text-purple-500"}`} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#0A0A0B] border-white/10 text-white rounded-2xl p-2 shadow-2xl">
                    {[4, 3, 2].map((r) => (
                      <DropdownMenuItem 
                        key={r} 
                        onClick={() => field.handleChange(r)}
                        className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-yellow-500/10 hover:text-yellow-500"
                      >
                        {r}+ Stars
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </form.Field>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <div className="flex items-center gap-2 px-4 shrink-0">
              <form.Field name="minPrice">
                {(field) => (
                  <input
                    type="number"
                    placeholder="Min"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-transparent border-none w-12 text-[11px] text-purple-400 font-black placeholder:text-gray-600 focus:ring-0 outline-none"
                  />
                )}
              </form.Field>
              <span className="text-gray-600 text-xs">-</span>
              <form.Field name="maxPrice">
                {(field) => (
                  <input
                    type="number"
                    placeholder="Max"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-transparent border-none w-12 text-[11px] text-purple-400 font-black placeholder:text-gray-600 focus:ring-0 outline-none"
                  />
                )}
              </form.Field>
            </div>

            <Button type="submit" className="rounded-full bg-purple-600 hover:bg-purple-700 px-8 font-black uppercase text-[10px] tracking-widest h-11 transition-all shadow-lg shadow-purple-500/20">
              Find
            </Button>
          </form>
        )}

        {/* AUTH SECTION (NEW CODE LOGIC) */}
        <div className="flex items-center gap-6 shrink-0">
          {role === "public" ? (
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">Login</Link>
              <Link href="/registration">
                <Button className="rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-widest px-8 h-12 hover:bg-purple-600 hover:text-white transition-all shadow-xl">Join Now</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-12 w-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all group overflow-hidden">
                   {isLoggingOut ? (
                     <Loader2 className="size-5 animate-spin text-purple-500" />
                   ) : (
                     <User className="size-5 text-purple-500 group-hover:scale-110 transition-transform" />
                   )}
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="bg-[#0A0A0B] border-white/10 text-white rounded-[1.5rem] p-2 min-w-[240px] shadow-2xl mt-4 animate-in fade-in zoom-in duration-200">
                <DropdownMenuLabel className="px-4 py-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Account Access</p>
                  <div className="flex items-center gap-2 mt-2">
                    {role.toUpperCase() === "STUDENT" ? (
                      <ShieldCheck size={14} className="text-emerald-500" />
                    ) : (
                      <GraduationCap size={14} className="text-purple-500" />
                    )}
                    <p className="text-sm font-black italic uppercase text-white leading-none">{role} Console</p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                
                <DropdownMenuItem onClick={() => router.push(`${getRoleBasePath()}/profileview`)} className="cursor-pointer rounded-xl font-bold text-xs p-4 hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <UserCircle className="size-4 text-blue-400" /> View Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push(`${getRoleBasePath()}/updateprofile`)} className="cursor-pointer rounded-xl font-bold text-xs p-4 hover:bg-white/5 flex items-center gap-3 transition-colors">
                  <Settings className="size-4 text-purple-400" /> Profile Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/5 mx-2" />

                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="cursor-pointer rounded-xl font-bold text-xs p-4 hover:bg-rose-500/10 text-rose-500 flex items-center gap-3 transition-colors">
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Ending Session..." : "Logout Session"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}