"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronDown, LayoutGrid, User,
  Loader2, Star, LogOut, UserCircle,
  ShieldCheck, GraduationCap, SlidersHorizontal,
  X, UserPlus, Settings
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
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => { router.push("/"); router.refresh(); },
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
      if (value.query) params.append("search", value.query.trim());
      if (value.subject && value.subject !== "Subject") params.append("categories", value.subject);
      if (value.minPrice) params.append("minPrice", value.minPrice.toString());
      if (value.maxPrice) params.append("maxPrice", value.maxPrice.toString());
      if (value.rating > 0) params.append("minRating", value.rating.toString());
      router.push(`/find-tutors?${params.toString()}`);
    },
  });

  const getRoleBasePath = () => {
    const r = role.toUpperCase();
    if (r === "TEACHER" || r === "TUTOR") return "/teacher";
    if (r === "STUDENT") return "/student";
    return "";
  };

  const isPublic = role === "public";
  const showSearch = isPublic || role.toUpperCase() === "STUDENT";

  if (!mounted) return <nav className="h-16 bg-background border-b border-border/10 w-full" />;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur-xl text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-6">

        {/* ════════════════════════════════════════════════
            LARGE SCREENS (lg+): Everything in ONE ROW
            Logo | Nav Links | Search (flex-1) | Auth
        ════════════════════════════════════════════════ */}
        <div className="hidden lg:flex items-center h-20 gap-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2.5 rounded-2xl group-hover:rotate-6 transition-all shadow-lg shadow-purple-500/20">
              <LayoutGrid className="size-5 text-white" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase">
              SKILL<span className="text-purple-500">BRIDGE</span>
            </span>
          </Link>

          {/* PUBLIC NAV LINKS */}
          {isPublic && (
            <div className="flex items-center gap-6 shrink-0 ml-4">
              <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          )}

          {/* SEARCH BAR (flex-1 = takes all remaining space) */}
          {showSearch && (
            <form
              onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
              className="flex-1 flex items-center bg-muted/20 border border-border/50 rounded-full px-4 h-11 focus-within:border-purple-500/50 transition-all shadow-lg mx-4 dark:bg-white/[0.04] dark:border-white/10"
            >
              <Search className="size-4 text-purple-500 shrink-0 mr-3" />

              <form.Field name="query">
                {(field) => (
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Search mentors, subjects..."
                    className="bg-transparent text-sm flex-1 placeholder:text-gray-600 font-medium outline-none"
                  />
                )}
              </form.Field>

              {/* Separator */}
              <div className="h-5 w-px bg-border/50 dark:bg-white/10 mx-3" />

              {/* Subject */}
              <form.Field name="subject">
                {(field) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors whitespace-nowrap outline-none">
                      <span className={field.state.value !== "Subject" ? "text-purple-400" : ""}>{field.state.value}</span>
                      {isLoading ? <Loader2 className="animate-spin size-3" /> : <ChevronDown className="size-3 text-purple-500" />}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-border text-popover-foreground rounded-2xl p-2 min-w-[200px] max-h-64 overflow-y-auto shadow-2xl">
                      <DropdownMenuItem onClick={() => field.handleChange("Subject")} className="cursor-pointer rounded-xl font-bold text-xs p-3 text-muted-foreground hover:bg-muted dark:text-gray-500 dark:hover:bg-white/5">
                        All Subjects
                      </DropdownMenuItem>
                      {categories.map((cat) => (
                        <DropdownMenuItem key={cat.id} onClick={() => field.handleChange(cat.name)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-purple-500/10 hover:text-purple-400">
                          {cat.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </form.Field>

              <div className="h-5 w-px bg-border/50 dark:bg-white/10 mx-3" />

              {/* Rating */}
              <form.Field name="rating">
                {(field) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white uppercase tracking-widest transition-colors whitespace-nowrap outline-none">
                      {field.state.value > 0 ? `${field.state.value}+ Stars` : "Rating"}
                      <Star className={`size-3 ${field.state.value > 0 ? "fill-yellow-500 text-yellow-500" : "text-purple-500"}`} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-border text-popover-foreground rounded-2xl p-2 shadow-2xl">
                      <DropdownMenuItem onClick={() => field.handleChange(0)} className="cursor-pointer rounded-xl font-bold text-xs p-3 text-muted-foreground hover:bg-muted dark:text-gray-500 dark:hover:bg-white/5">
                        Any Rating
                      </DropdownMenuItem>
                      {[4, 3, 2].map((r) => (
                        <DropdownMenuItem key={r} onClick={() => field.handleChange(r)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-yellow-500/10 hover:text-yellow-400">
                          {r}+ Stars
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </form.Field>

              <div className="h-5 w-px bg-border/50 dark:bg-white/10 mx-3" />

              {/* Price */}
              <form.Field name="minPrice">
                {(field) => (
                  <input type="number" placeholder="Min $" value={field.state.value ?? ""} onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-transparent w-12 text-[10px] text-purple-400 font-black placeholder:text-gray-600 outline-none" />
                )}
              </form.Field>
              <span className="text-gray-600 text-[10px] mx-1">–</span>
              <form.Field name="maxPrice">
                {(field) => (
                  <input type="number" placeholder="Max $" value={field.state.value ?? ""} onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-transparent w-12 text-[10px] text-purple-400 font-black placeholder:text-gray-600 outline-none" />
                )}
              </form.Field>

              <Button type="submit" className="ml-3 rounded-full bg-purple-600 hover:bg-purple-700 px-5 font-black uppercase text-[10px] tracking-widest h-8 transition-all shadow-lg shadow-purple-500/20 shrink-0">
                Find
              </Button>
            </form>
          )}

          {/* AUTH */}
          <div className="flex items-center gap-4 shrink-0">
            {isPublic ? (
              <>
                <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/registration">
                  <Button className="rounded-2xl bg-foreground text-background font-black uppercase text-[10px] tracking-widest px-6 h-11 hover:bg-purple-600 hover:text-white transition-all shadow-xl whitespace-nowrap dark:bg-white dark:text-black">
                    Join Now
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="h-10 w-10 rounded-full border border-border bg-muted/20 flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all">
                    {isLoggingOut ? <Loader2 className="size-4 animate-spin text-purple-500" /> : <User className="size-4 text-purple-500" />}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground rounded-2xl p-2 min-w-[220px] shadow-2xl mt-2">
                  <DropdownMenuLabel className="px-3 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account</p>
                    <div className="flex items-center gap-2 mt-1">
                      {role.toUpperCase() === "STUDENT" ? <ShieldCheck size={13} className="text-emerald-500" /> : <GraduationCap size={13} className="text-purple-500" />}
                      <p className="text-xs font-black italic uppercase text-foreground">{role} Console</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50 mx-2" />
                  <DropdownMenuItem onClick={() => router.push(`${getRoleBasePath()}/profileview`)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-muted flex items-center gap-2">
                    <UserCircle className="size-4 text-blue-400" /> View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`${getRoleBasePath()}/updateprofile`)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-muted flex items-center gap-2">
                    <Settings className="size-4 text-purple-400" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 mx-2" />
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-rose-500/10 text-rose-500 flex items-center gap-2">
                    <LogOut className="size-4" /> {isLoggingOut ? "Signing out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            SMALL/MEDIUM SCREENS (< lg): STACKED LAYOUT
            Row 1: Logo | About | Contact | Login | Join
            Row 2: Search bar (with collapsible filters)
        ════════════════════════════════════════════════ */}
        <div className="lg:hidden">

          {/* Row 1 */}
          <div className="flex items-center justify-between h-16 gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-xl group-hover:rotate-6 transition-all shadow-lg shadow-purple-500/20">
                <LayoutGrid className="size-5 text-white" />
              </div>
              <span className="text-lg font-black italic tracking-tighter uppercase">
                SKILL<span className="text-purple-500 hidden xs:inline">BRIDGE</span>
              </span>
            </Link>

            {/* Right side: links + auth */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {/* About (public only) */}
              {isPublic && (
                <>
                  <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </>
              )}

              {isPublic ? (
                <>
                  {/* Login icon */}
                  <Link href="/login" className="flex items-center justify-center size-9 rounded-full bg-muted/20 border border-border/50 text-muted-foreground hover:text-foreground hover:border-purple-500/50 transition-all">
                    <User className="size-4" />
                  </Link>

                  {/* Join Now */}
                  <Link href="/registration">
                    <Button className="rounded-xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest px-4 h-9 hover:bg-purple-600 hover:text-white transition-all shadow-xl whitespace-nowrap">
                      <span className="hidden sm:inline">Join Now</span>
                      <UserPlus className="sm:hidden size-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="h-9 w-9 rounded-full border border-border/50 bg-muted/20 flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all">
                      {isLoggingOut ? <Loader2 className="size-4 animate-spin text-purple-500" /> : <User className="size-4 text-purple-500" />}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground rounded-2xl p-2 min-w-[200px] shadow-2xl mt-2">
                    <DropdownMenuItem onClick={() => router.push(`${getRoleBasePath()}/profileview`)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-muted flex items-center gap-2">
                      <UserCircle className="size-4 text-blue-400" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`${getRoleBasePath()}/updateprofile`)} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-muted flex items-center gap-2">
                      <Settings className="size-4 text-purple-400" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 mx-2" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-rose-500/10 text-rose-500 flex items-center gap-2">
                      <LogOut className="size-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Row 2: Search */}
          {showSearch && (
            <div className="pb-3">
              <form
                onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                className="w-full bg-muted/20 border border-border/50 rounded-2xl p-2 focus-within:border-purple-500/50 transition-all shadow-lg dark:bg-white/[0.04] dark:border-white/10"
              >
                {/* Search input + controls */}
                <div className="flex items-center gap-2 px-2">
                  <Search className="size-4 text-purple-500 shrink-0" />
                  <form.Field name="query">
                    {(field) => (
                      <input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Search mentors, subjects..."
                        className="bg-transparent text-sm flex-1 placeholder:text-gray-600 font-medium outline-none"
                      />
                    )}
                  </form.Field>

                  {/* Filter toggle */}
                  <button
                    type="button"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="flex items-center justify-center size-8 rounded-lg border bg-background/20 border-border/10 text-gray-400 shrink-0"
                  >
                    {isFiltersOpen ? <X className="size-3.5 text-white" /> : <SlidersHorizontal className="size-3.5" />}
                  </button>

                  <Button type="submit" className="rounded-xl bg-purple-600 hover:bg-purple-700 px-5 font-black uppercase text-[10px] tracking-widest h-8 shrink-0">
                    Find
                  </Button>
                </div>

                {/* Collapsible filters */}
                <AnimatePresence>
                  {isFiltersOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 px-2 pt-3 mt-2 border-t border-white/5">
                        {/* Subject */}
                        <form.Field name="subject">
                          {(field) => (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex items-center justify-between w-full text-[10px] font-black text-muted-foreground bg-muted/20 dark:text-gray-400 dark:bg-white/5 rounded-xl px-3 py-2.5 uppercase tracking-widest outline-none">
                                <span className={field.state.value !== "Subject" ? "text-purple-400" : ""}>{field.state.value}</span>
                                {isLoading ? <Loader2 className="animate-spin size-3" /> : <ChevronDown className="size-3 text-purple-500" />}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-popover border-border text-popover-foreground rounded-2xl p-2 min-w-[200px] max-h-64 overflow-y-auto shadow-2xl">
                                <DropdownMenuItem onClick={() => { field.handleChange("Subject"); setIsFiltersOpen(false); }} className="cursor-pointer rounded-xl font-bold text-xs p-3 text-muted-foreground dark:text-gray-500">
                                  All Subjects
                                </DropdownMenuItem>
                                {categories.map((cat) => (
                                  <DropdownMenuItem key={cat.id} onClick={() => { field.handleChange(cat.name); setIsFiltersOpen(false); }} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-purple-500/10">
                                    {cat.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </form.Field>

                        {/* Rating */}
                        <form.Field name="rating">
                          {(field) => (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex items-center justify-between w-full text-[10px] font-black text-muted-foreground bg-muted/20 dark:text-gray-400 dark:bg-white/5 rounded-xl px-3 py-2.5 uppercase tracking-widest outline-none">
                                <span>{field.state.value > 0 ? `${field.state.value}+ Stars` : "Rating"}</span>
                                <Star className={`size-3 ${field.state.value > 0 ? "fill-yellow-500 text-yellow-500" : "text-purple-500"}`} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-popover border-border text-popover-foreground rounded-2xl p-2 shadow-2xl">
                                <DropdownMenuItem onClick={() => { field.handleChange(0); setIsFiltersOpen(false); }} className="cursor-pointer rounded-xl font-bold text-xs p-3 text-muted-foreground dark:text-gray-500">
                                  Any Rating
                                </DropdownMenuItem>
                                {[4, 3, 2].map((r) => (
                                  <DropdownMenuItem key={r} onClick={() => { field.handleChange(r); setIsFiltersOpen(false); }} className="cursor-pointer rounded-xl font-bold text-xs p-3 hover:bg-yellow-500/10">
                                    {r}+ Stars
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </form.Field>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
