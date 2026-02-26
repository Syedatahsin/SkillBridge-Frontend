"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // Your client config
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        return;
      }

      // This is the magic command that talks to your backend
      const { data, error } = await authClient.verifyEmail({
        query: { token },
      });

      if (error) {
        toast.error(error.message || "Verification failed");
        setStatus("error");
      } else {
        toast.success("Email verified! Redirecting...");
        setStatus("success");
       
        router.push("/");
      }
    }
    verify();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white">
      {status === "verifying" && (
        <>
          <Loader2 className="animate-spin text-purple-500 mb-4" size={48} />
          <h1 className="text-2xl font-bold italic tracking-tighter">INITIALIZING ACCESS...</h1>
        </>
      )}
      {status === "error" && (
        <h1 className="text-red-500 font-bold">VERIFICATION LINK EXPIRED OR INVALID</h1>
      )}
    </div>
  );
}