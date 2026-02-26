"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { UserCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const CLOUDINARY_UPLOAD_PRESET = "SkillBridge"; 
const CLOUDINARY_CLOUD_NAME = "dflenq5oc";

export default function RegisterForm() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
      role: "student" as "student" | "tutor",
    },
    onSubmit: async ({ value }) => {
      setHasError(false);
      const toastId = toast.loading("Creating your profile...");

      try {
        const res = await authClient.signUp.email({
          email: value.email,
          password: value.password,
          name: value.name,
          image: value.image,
          role: value.role.toUpperCase(),
          status: "ACTIVE",
          callbackURL: "/",
        } as any);

        if (res?.error) {
          setHasError(true);
          
          // Force extract data from the "invisible" error object
          const errData = res.error;
          const errorCode = errData.code || "";
          const errorMessage = errData.message || "An error occurred during registration.";


          if (errorCode.includes("USER_ALREADY_EXISTS") || errData.status === 422) {
            toast.error("Email Already Registered", {
              id: toastId,
              description: "This email is already in use. Try logging in instead.",
              duration: 5000,
              style: { 
                background: '#0A0A0B', 
                color: '#FFFFFF', 
                border: '1px solid #9333ea' 
              },
              action: {
                label: "Login",
                onClick: () => router.push("/login"),
              },
            });
          } else {
            toast.error(errorMessage, { id: toastId });
          }

          setTimeout(() => setHasError(false), 500);
          return;
        }

        toast.success("Welcome aboard!", { id: toastId });
        router.push("/");

      } catch (err: any) {
        setHasError(true);
        console.error("Fatal Error:", err);
        toast.error("Connection error. Please try again.", { id: toastId });
        setTimeout(() => setHasError(false), 500);
      }
    },
  });

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
        setPreview(data.secure_url);
        field.handleChange(data.secure_url);
        toast.success("Avatar uploaded!");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] p-6 font-sans">
      <Card className={`w-full max-w-md bg-[#0A0A0B] border-white/10 shadow-2xl rounded-[2.5rem] transition-all duration-300 ${hasError ? "animate-shake border-red-500/50" : "hover:border-purple-500/20"}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-black italic text-white uppercase tracking-tighter">
            SKILL<span className="text-purple-500">BRIDGE</span>
          </CardTitle>
          <CardDescription className="text-gray-500 font-semibold uppercase text-[10px] tracking-widest mt-1">
            Global Learning Community
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
            {/* Avatar Upload */}
            <form.Field name="image">
              {(field) => (
                <div className="flex flex-col items-center group">
                  <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex items-center justify-center group-hover:border-purple-500 transition-colors cursor-pointer">
                    {preview ? (
                      <img src={preview} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <UserCircle size={40} className="text-white/10 group-hover:text-purple-500 transition-colors" />
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, field)} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-gray-600 mt-2 tracking-widest">Update Photo</span>
                </div>
              )}
            </form.Field>

            <div className="space-y-4">
              <form.Field name="name">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest ml-1">Your Name</label>
                    <Input className="bg-white/5 border-white/10 text-white h-12 focus:border-purple-500 transition-all" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} required />
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest ml-1">Email Address</label>
                    <Input 
                      type="email" 
                      className={`bg-white/5 border-white/10 text-white h-12 transition-all ${hasError ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "focus:border-purple-500"}`} 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      required 
                    />
                  </div>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="role">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest ml-1">Role</label>
                      <Select value={field.state.value} onValueChange={(val: any) => field.handleChange(val)}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                          <SelectValue placeholder="Role" />
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
                      <label className="text-gray-500 text-[10px] uppercase font-bold tracking-widest ml-1">Password</label>
                      <Input type="password" className="bg-white/5 border-white/10 text-white h-12 focus:border-purple-500" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} required minLength={8} />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <Button 
                type="submit" 
                disabled={isUploading} 
                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-purple-500/20"
              >
                {isUploading ? <Loader2 className="animate-spin" /> : "Start Learning"}
              </Button>
              
              <Link href="/login" className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center hover:text-white transition-colors">
                Already a member? <span className="text-purple-500 ml-1 underline underline-offset-4">Sign In</span>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}