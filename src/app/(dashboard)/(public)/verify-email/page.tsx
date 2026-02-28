"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// 1. This component handles the actual logic and search params
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyToken = async () => {
      try {
        // Replace with your actual backend verification URL
        const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may be expired.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification. Please try again later.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <Card className="w-full max-w-md border-white/10 bg-black/50 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {status === "loading" && <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />}
          {status === "success" && <CheckCircle className="h-12 w-12 text-green-500" />}
          {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Verification Failed"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {message}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-center">
        {status !== "loading" && (
          <Button 
            onClick={() => router.push("/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
          >
            Go to Login
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// 2. This is the main page that Next.js sees. 
// It MUST wrap the content in Suspense to pass the Build phase.
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p>Loading Verification Page...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}