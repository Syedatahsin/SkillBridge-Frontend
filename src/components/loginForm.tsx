"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm(props: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // 🚨 FIX 1: Proper session hydration guard
  useEffect(() => {
    if (isPending) return; // wait until session is loaded
    if (!session?.user) return;

    const role = (session.user as any).role;

    if (role === "ADMIN") window.location.replace("/admin");
    else if (role === "TUTOR") window.location.replace("/teacher");
    else window.location.replace("/student");
  }, [session, isPending]);

  // 🚨 FIX 2: EMAIL LOGIN
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...");

      try {
        const res = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        if (res?.error) {
          toast.error(res.error.message || "Login failed", { id: toastId });
          return;
        }

        toast.success("Login successful!", { id: toastId });

        // Fetch the active session explicitly from the client state to get the full user object
        const { data: currentSession } = await authClient.getSession();
        
        // Add a small delay if session isn't immediately populated (Next.js hydrated state buffer)
        const activeRole = (currentSession?.user as any)?.role || (res?.data?.user as any)?.role;
        
        // Use window.location.href for instantaneous hard navigation guaranteeing the new layout loads
        if (activeRole === "ADMIN") {
          window.location.href = "/admin";
        } else if (activeRole === "TUTOR") {
          window.location.href = "/teacher";
        } else {
          window.location.href = "/student";
        }

      } catch (err) {
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

  // 🚨 FIX 3: Google login (correct callback)
  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin + "/login", // frontend only
    });
  };

  // 🚨 FIX 4: prevent rendering before session check (avoids flicker)
  if (isPending) {
    return (
      <div className="flex items-center justify-center text-foreground">
        Loading...
      </div>
    );
  }

  return (
    <Card
      {...props}
      className="w-full max-w-md bg-card border-none text-foreground transition-colors duration-300 shadow-2xl rounded-[2.5rem]"
    >
      <CardHeader>
        <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">
          SKILL<span className="text-purple-500">BRIDGE</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <button
          onClick={handleGoogle}
          type="button"
          className="w-full mb-6 bg-white text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 hover:scale-[1.02] shadow-md border border-gray-200"
        >
          <svg className="size-5 mr-3" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
            <span className="bg-zinc-900 px-4 text-muted-foreground border border-white/10 rounded-full py-1">Or login with email</span>
          </div>
        </div>

        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="space-y-4">

            {/* EMAIL */}
            <form.Field name="email">
              {(field) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

            {/* PASSWORD */}
            <form.Field name="password">
              {(field) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </Field>
              )}
            </form.Field>

          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Button form="login-form" type="submit" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}