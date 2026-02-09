"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { 
  Search, Star, ChevronDown, LayoutGrid, User, 
  LogOut, Settings, BookOpen, Calendar, ShieldCheck 
} from "lucide-react";

import { handleSearchAction } from "@/Serveraction/action"; // Import the server action
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { de } from "zod/locales";

// Define the Schema
const searchSchema = z.object({
  query: z.string().optional(),
  subject: z.string().default("Subject"),
  rating: z.number().min(0).max(5).default(0),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const SkillBridgeNavbar = ({ role = "public" }: { role?: string }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const form = useForm({
    defaultValues: {
      query: "",
      subject: "Subject",
      rating: 0,
      minPrice: undefined,
      maxPrice: undefined,
    } as SearchFormValues,
    onSubmit: async ({ value }) => {
      // Manual Zod Validation without adapter
      const result = searchSchema.safeParse(value);
      
      if (!result.success) {
        console.error("Validation failed:", result.error.format());
        return;
      }

      // Call Server Action
      await handleSearchAction(result.data);
      alert("Search sent to server!");
    },
  });

  if (!mounted) return <nav className="h-20 bg-black border-b border-white/10 w-full" />;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur-md text-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 p-2 rounded-xl">
            <LayoutGrid className="size-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">SkillBridge</span>
        </a>

        {/* SEARCH BAR (TanStack Form) */}
        {(role === "public" || role === "student") && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="hidden lg:flex flex-1 max-w-3xl items-center bg-white/5 border border-white/10 rounded-full p-1 pl-4 focus-within:ring-1 focus-within:ring-purple-500/50"
          >
            <Search className="size-4 text-gray-400 shrink-0" />

            <form.Field name="query">
              {(field) => (
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full px-3 placeholder:text-gray-500"
                />
              )}
            </form.Field>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <form.Field name="subject">
              {(field) => (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-[11px] font-bold text-gray-400 px-2 outline-none uppercase whitespace-nowrap">
                    {field.state.value} <ChevronDown className="size-3 text-purple-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-950 border-white/10 text-white">
                    {["Design", "Development", "Business"].map((s) => (
                      <DropdownMenuItem key={s} onClick={() => field.handleChange(s)} className="cursor-pointer">{s}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </form.Field>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <form.Field name="rating">
              {(field) => (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-[11px] font-bold text-gray-400 px-2 outline-none uppercase whitespace-nowrap">
                    {field.state.value > 0 ? `${field.state.value}+` : "Rating"} <Star className="size-3 fill-yellow-500 text-yellow-500 ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-950 border-white/10 text-white">
                    {[4, 3, 2].map((r) => (
                      <DropdownMenuItem key={r} onClick={() => field.handleChange(r)} className="cursor-pointer">{r}+ Stars</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </form.Field>

            <div className="h-6 w-px bg-white/10 mx-1" />

            {/* Price Range */}
            <div className="flex items-center gap-1 px-2">
              <form.Field name="minPrice">
                {(field) => (
                  <input
                    type="number"
                    placeholder="Min"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-transparent border-none w-10 text-[11px] text-purple-400 font-bold placeholder:text-gray-600 focus:ring-0"
                  />
                )}
              </form.Field>
              <span className="text-gray-600 text-[10px]">-</span>
              <form.Field name="maxPrice">
                {(field) => (
                  <input
                    type="number"
                    placeholder="Max"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-transparent border-none w-10 text-[11px] text-purple-400 font-bold placeholder:text-gray-600 focus:ring-0"
                  />
                )}
              </form.Field>
            </div>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit} size="sm" className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 font-bold transition-transform hover:scale-105">
                  {isSubmitting ? "..." : "Find"}
                </Button>
              )}
            />
          </form>
        )}

        {/* TEACHER LINKS */}
        {role === "teacher" && (
          <div className="hidden md:flex items-center gap-8">
            <a href="/availability" className="text-sm font-semibold flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
              <Calendar className="size-4 text-purple-500" /> Availability
            </a>
            <a href="/books" className="text-sm font-semibold flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
              <BookOpen className="size-4 text-purple-500" /> Manage Books
            </a>
          </div>
        )}

        {/* PROFILE SECTION */}
        <div className="flex items-center gap-3">
          {role === "public" ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-full text-gray-400">Login</Button>
              <Button className="rounded-full bg-white text-black font-bold px-6">Join Free</Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full border border-white/10 bg-white/5 hover:ring-2 hover:ring-purple-500/30 transition-all">
                  <User className="size-5 text-purple-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-slate-950 border-white/10 text-white shadow-2xl">
                <DropdownMenuLabel className="p-4">
                  <p className="text-sm font-bold leading-none">Syeda Anika</p>
                  <p className="text-[10px] text-purple-400 uppercase font-black mt-1">{role} Portal</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {role === "admin" && (
                  <DropdownMenuItem className="p-3 cursor-pointer hover:bg-white/5">
                    <ShieldCheck className="mr-3 size-4 text-indigo-400" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="p-3 cursor-pointer hover:bg-white/5">
                  <User className="mr-3 size-4 text-gray-400" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer hover:bg-white/5">
                  <Settings className="mr-3 size-4 text-gray-400" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="p-3 cursor-pointer text-red-400 hover:bg-red-400/10">
                  <LogOut className="mr-3 size-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};
export default SkillBridgeNavbar;