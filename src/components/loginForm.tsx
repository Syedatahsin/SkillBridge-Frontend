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

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  // AUTO-REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role;
      if (role === "STUDENT") router.push("/student");
      else if (role === "TUTOR") router.push("/teacher");
      else if (role === "ADMIN") router.push("/admin");
    }
  }, [session, router]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Verifying credentials...");

      try {
        const res = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        if (res?.error) {
          const errorMessage = res.error.message || "Invalid email or password";
          toast.error(errorMessage, { id: toastId });
          return;
        }

        toast.success("Login successful!", { id: toastId });

        const user = res?.data?.user as any;
        const role = user?.role;

        if (role === "STUDENT") router.push("/student");
        else if (role === "TUTOR") router.push("/teacher");
        else if (role === "ADMIN") router.push("/admin");
        else router.push("/");
        
      } catch (err) {
        toast.error("Connection error. Please try again.", {
          id: toastId,
        });
      }
    },
  });

  return (
    <Card {...props} className="w-full max-w-md bg-[#0A0A0B] border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">
          SKILL<span className="text-purple-500">BRIDGE</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="space-y-4">
            {/* EMAIL FIELD WITH REGEX */}
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Email is required";
                  // Standard Email Regex
                  const emailRegex = /^\S+@\S+\.\S+$/;
                  if (!emailRegex.test(value)) return "Invalid email format";
                  return undefined;
                },
              }}
              children={(field) => (
                <Field>
                  <FieldLabel 
                    htmlFor={field.name} 
                    className="text-[10px] uppercase font-bold tracking-widest text-gray-500"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="email"
                    className="bg-white/5 border-white/10 focus:border-purple-500 h-12 text-white"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <em className="text-[10px] text-red-500 uppercase font-bold mt-1 block">
                      {field.state.meta.errors.join(", ")}
                    </em>
                  )}
                </Field>
              )}
            />

            {/* PASSWORD FIELD WITH REGEX */}
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Password is required";
                  // Regex for minimum 6 characters
                  if (value.length < 6) return "Password must be at least 6 characters";
                  return undefined;
                },
              }}
              children={(field) => (
                <Field>
                  <FieldLabel 
                    htmlFor={field.name} 
                    className="text-[10px] uppercase font-bold tracking-widest text-gray-500"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    className="bg-white/5 border-white/10 focus:border-purple-500 h-12 text-white"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <em className="text-[10px] text-red-500 uppercase font-bold mt-1 block">
                      {field.state.meta.errors.join(", ")}
                    </em>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          form="login-form" 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 font-bold uppercase tracking-widest py-6"
        >
          Authorize Login
        </Button>
      </CardFooter>
    </Card>
  );
}