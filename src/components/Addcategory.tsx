"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { FolderPlus, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddCategoryForm() {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      setHasError(false);
      setIsSubmitting(true);
      const toastId = toast.loading("Creating category...");

      try {
        // FIX: Added absolute URL to hit your Express Port 5000
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/admin/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const data = await res.json();

        // FIX: Fetch doesn't throw on 400/500, we must check res.ok
        if (!res.ok) {
          // This picks up the "message" from your Express globalErrorHandler
          throw new Error(data.message || "Failed to create category");
        }

        toast.success("Category created successfully!", { id: toastId });
        form.reset();
        router.push("/admin/");

      } catch (err: any) {
        setHasError(true);
        // This shows the actual error message (e.g., "Duplicate key error") in the toast
        toast.error(err.message || "Connection refused. Is the server running?", { 
          id: toastId,
          style: { border: '1px solid #ef4444' } 
        });
        
        // Shake animation timing
        setTimeout(() => setHasError(false), 500);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] p-6 font-sans">
      <Card className={`w-full max-w-md bg-[#0A0A0B] border-white/10 shadow-2xl rounded-[2.5rem] transition-all duration-300 ${hasError ? "animate-shake border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "hover:border-purple-500/20"}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
              <FolderPlus className="text-purple-500" size={32} />
            </div>
          </div>
          <CardTitle className="text-3xl font-black italic text-white uppercase tracking-tighter">
            NEW<span className="text-purple-500"> CATEGORY</span>
          </CardTitle>
          <CardDescription className="text-gray-500 font-semibold uppercase text-[10px] tracking-widest mt-1">
            SkillBridge Administration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <form.Field name="name">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest ml-1">Name</label>
                    <Input 
                      placeholder="e.g., MATHEMATICS"
                      className={`bg-white/5 border-white/10 text-white h-12 focus:border-purple-500 transition-all ${hasError ? "border-red-500/50" : ""}`} 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      required 
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest ml-1">Description</label>
                    <Textarea 
                      placeholder="Optional details..." 
                      className="bg-white/5 border-white/10 text-white min-h-[100px] focus:border-purple-500 transition-all resize-none" 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="pt-2 space-y-4">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-purple-500/20"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Category"}
              </Button>
              
              <Link href="/dashboard" className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                <ArrowLeft size={12} />
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}