"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContactSchema } from "@/lib/schemas";
import { submitContactInquiry } from "@/actions/leadActions";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type ContactFormValues = z.infer<typeof ContactSchema>;

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    startTransition(async () => {
      try {
        const result = await submitContactInquiry(data);
        if (result.success) {
          toast.success(result.message || "Message sent successfully!");
          reset();
        } else {
          toast.error(result.message || "Something went wrong.");
        }
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            disabled={isPending}
            placeholder="John Doe"
            {...register("name")}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="phone" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            disabled={isPending}
            placeholder="+91 99999 99999"
            {...register("phone")}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
            }`}
          />
          {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          disabled={isPending}
          placeholder="john@example.com"
          {...register("email")}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
            errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
          }`}
        />
        {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
      </div>

      {/* Subject */}
      <div className="space-y-1">
        <label htmlFor="subject" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          disabled={isPending}
          placeholder="Service Inquiry"
          {...register("subject")}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
            errors.subject ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
          }`}
        />
        {errors.subject && <p className="text-xs text-red-500 font-semibold">{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div className="space-y-1">
        <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          disabled={isPending}
          placeholder="Tell us about your requirements..."
          {...register("message")}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
            errors.message ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
          }`}
        />
        {errors.message && <p className="text-xs text-red-500 font-semibold">{errors.message.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-3 font-semibold text-sm transition-colors duration-300"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending Message...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" /> Send Message
          </>
        )}
      </Button>
    </form>
  );
}
