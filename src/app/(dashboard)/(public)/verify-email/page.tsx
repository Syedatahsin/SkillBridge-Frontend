"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client"; 

// 1. This component handles the actual logic
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Initializing secure verification...");

  useEffect(() => {
    // If no token is found in the URL
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing. Please check your email link.");
      return;
    }

    const verifyToken = async () => {
      try {
        // Using 'as any' to bypass the TypeScript "Property does not exist" error
        // while still using the powerful Better Auth logic.
        const { data, error } = await (authClient as any).verifyEmail({
          query: {
            token: token,
          },
        });

        if (error) {
          setStatus("error");
          setMessage(error.message || "This link has expired or is invalid.");
        } else {
          // Success! We stay here so they can manually click "Go to Login"
          setStatus("success");
          setMessage("Email verified successfully! You can now access the SkillBridge platform.");
        }
      } catch (error) {
        // This catch block is vital for Render Free Tier (initial wake-up delay)
        setStatus("error");
        setMessage("The security server is waking up. Please refresh this page in 20 seconds.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="w-full max-w-md border-white/10 bg-[#0A0A0B]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border">
      <CardHeader className="text-center pt-12">
        <div className="flex justify-center mb-8">
          {status === "loading" && (
            <div className="relative">
                <Loader2 className="h-20 w-20 text-purple-500 animate-spin" />
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
            </div>
          )}
          {status === "success" && (
            <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
            </div>
          )}
          {status === "error" && (
            <div className="bg-rose-500/10 p-4 rounded-full border border-rose-500/20">
                <XCircle className="h-12 w-12 text-rose-500" />
            </div>
          )}
        </div>
        <CardTitle className="text-3xl font-black italic uppercase tracking-tighter text-white">
          {status === "loading" ? "Verifying" : status === "success" ? "Access Granted" : "System Error"}
        </CardTitle>
        <CardDescription className="text-gray-400 mt-3 font-medium px-6">
          {message}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-center pb-12 px-10">
        {status !== "loading" && (
          <Button 
            onClick={() => router.push("/login")}
            className="group relative w-full bg-white text-black hover:bg-purple-600 hover:text-white font-black uppercase tracking-[0.2em] py-7 rounded-2xl transition-all duration-300 shadow-lg"
          >
            Go to Login
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// 2. Main Page wrapper with Suspense (Required for Next.js build)
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] opacity-50">
            Initializing Ecosystem...
          </p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}