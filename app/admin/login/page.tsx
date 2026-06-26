"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  securityPin: z.string().length(4, "PIN must be exactly 4 digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", securityPin: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          securityPin: data.securityPin,
          redirect: false,
        });

        if (result?.error) {
          setErrorMsg("Invalid email or password. Please try again.");
          toast.error("Authentication failed.");
        } else {
          toast.success("Logged in successfully! Redirecting...");
          router.push("/admin/dashboard");
          router.refresh();
        }
      } catch (error) {
        setErrorMsg("An unexpected error occurred.");
        toast.error("Login failed.");
      }
    });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-none p-8 sm:p-10 shadow-2xl space-y-6 text-white">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-primary/25 border border-primary/20 rounded-none w-fit mx-auto text-accent">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight block pt-2">
            Admin <span className="text-accent">Portal</span>
          </span>
          <p className="text-xs text-slate-400 uppercase tracking-widest">
            Homes CRM
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-none flex items-center space-x-2 text-xs font-semibold">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                disabled={isPending}
                placeholder="admin@homedecorater.in"
                {...register("email")}
                className={`w-full bg-slate-950/80 border rounded-none pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent ${
                  errors.email ? "border-red-500" : "border-slate-800"
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-400 font-semibold">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type="password"
                disabled={isPending}
                placeholder="••••••••"
                {...register("password")}
                className={`w-full bg-slate-950/80 border rounded-none pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent ${
                  errors.password ? "border-red-500" : "border-slate-800"
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-red-400 font-semibold">{errors.password.message}</p>}
          </div>

          {/* Security PIN */}
          <div className="space-y-1">
            <label htmlFor="securityPin" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Security PIN
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <input
                id="securityPin"
                type="password"
                maxLength={4}
                disabled={isPending}
                placeholder="••••"
                {...register("securityPin")}
                className={`w-full bg-slate-950/80 border rounded-none pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent ${
                  errors.securityPin ? "border-red-500" : "border-slate-800"
                }`}
              />
            </div>
            {errors.securityPin && <p className="text-[11px] text-red-400 font-semibold">{errors.securityPin.message}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-accent hover:bg-accent-hover text-dark font-bold rounded-none py-3 text-sm transition-all duration-300 mt-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Authenticating...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
