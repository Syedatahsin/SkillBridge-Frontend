"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { UserPlus, Upload, UserCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const CLOUDINARY_UPLOAD_PRESET = "SkillBridge"; 
const CLOUDINARY_CLOUD_NAME = "dflenq5oc";

export default function RegisterForm() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
      role: "student" as "student" | "tutor",
    },
    onSubmit: async ({ value }) => {
      // THIS MUST SHOW IN BROWSER CONSOLE (F12)
      console.log("🚀 SUBMITTING DATA:", value);
      
      const toastId = toast.loading("Creating account...");
      try {
        const { data, error } = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
          image: value.image,
          role: value.role.toUpperCase(),
          status: "ACTIVE",
          callbackURL: "/dashboard",
        } as any);

        if (error) {
          console.error("Auth Error:", error);
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Verification email sent!", { id: toastId });
        router.push("/login");
      } catch (err) {
        console.error("Network/Server Error:", err);
        toast.error("Connection failed", { id: toastId });
      }
    },
  });

  // Helper to log file upload success
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        console.log("📸 Image Uploaded:", data.secure_url);
        setPreview(data.secure_url);
        field.handleChange(data.secure_url);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] p-6">
      <Card className="w-full max-w-md bg-[#0A0A0B] border-white/10 shadow-2xl rounded-[2rem]">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-black italic text-white uppercase">
            SKILL<span className="text-purple-500">BRIDGE</span>
          </CardTitle>
          <CardDescription>Join the community</CardDescription>
        </CardHeader>

        <CardContent>
          {/* THE FORM START */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("🖱️ Form tag caught the click!");
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Avatar Upload */}
            <form.Field name="image">
              {(field) => (
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden bg-white/5">
                    {preview ? <img src={preview} className="w-full h-full object-cover" /> : <UserCircle size={80} className="text-gray-800" />}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, field)} />
                  </div>
                </div>
              )}
            </form.Field>

            <div className="space-y-4">
              <form.Field name="name">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Name</label>
                    <Input className="bg-white/5 border-white/10 text-white" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} required />
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Email</label>
                    <Input type="email" className="bg-white/5 border-white/10 text-white" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} required />
                  </div>
                )}
              </form.Field>

              <form.Field name="role">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Role</label>
                    <Select value={field.state.value} onValueChange={(val: any) => field.handleChange(val)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A0B] text-white border-white/10">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="tutor">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Password</label>
                    <Input type="password" className="bg-white/5 border-white/10 text-white" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} required minLength={8} />
                  </div>
                )}
              </form.Field>
            </div>

            {/* BUTTON MOVED INSIDE THE <FORM> TAG */}
            <div className="pt-4 space-y-4">
              <Button 
                type="submit" 
                disabled={isUploading} 
                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black uppercase tracking-[0.2em] transition-all active:scale-95"
              >
                {isUploading ? <Loader2 className="animate-spin" /> : "Initialize Account"}
              </Button>
              
              <Link href="/login" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">
                Existing Member? <span className="text-purple-500 underline ml-1">Login</span>
              </Link>
            </div>
          </form>
          {/* THE FORM END */}
        </CardContent>
      </Card>
    </div>
  );
}