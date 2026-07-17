"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ContactSchema } from "@/lib/schemas";
import { submitContactInquiry } from "@/actions/leadActions";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type ContactFormValues = z.infer<typeof ContactSchema>;

const defaultServices = ["Waterproofing", "Wooden Flooring", "PVC (Polyvinyl Chloride)"];

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [services, setServices] = useState<string[]>(defaultServices);

  useEffect(() => {
    async function loadServices() {
      try {
        const { getServiceCategories } = await import("@/actions/cmsActions");
        const res = await getServiceCategories();
        if (res.success && res.categories && res.categories.length > 0) {
          setServices(res.categories.map((c: any) => c.name));
        }
      } catch {}
    }
    loadServices();
  }, []);

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
      city: "",
      service: "Waterproofing",
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

          const waText = encodeURIComponent(
            `Hello Homesdecorator,\n\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nCity: ${data.city}\nService Required: ${data.service}\n\nMessage: ${data.message}`
          );
          window.open(`https://wa.me/918295524045?text=${waText}`, "_blank");
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
          <label
            htmlFor="name"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            disabled={isPending}
            placeholder="Enter Your Name"
            {...register("name")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-semibold">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label
            htmlFor="phone"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            disabled={isPending}
            placeholder="Enter Your Phone Number"
            {...register("phone")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200"
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 font-semibold">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Email, City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            disabled={isPending}
            placeholder="example@example.com"
            {...register("email")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 font-semibold">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="city"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            disabled={isPending}
            placeholder="Noida / Delhi / Gurugram"
            {...register("city")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.city
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200"
            }`}
          />
          {errors.city && (
            <p className="text-xs text-red-500 font-semibold">
              {errors.city.message}
            </p>
          )}
        </div>
      </div>

      {/* Required Service */}
      <div className="space-y-1">
        <label
          htmlFor="service"
          className="text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          Required Service
        </label>
        <select
          id="service"
          disabled={isPending}
          {...register("service")}
          className="w-full border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 bg-white transition-all duration-200"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.service && (
          <p className="text-xs text-red-500 font-semibold">
            {errors.service.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1">
        <label
          htmlFor="message"
          className="text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          disabled={isPending}
          placeholder="Tell us about your requirements..."
          {...register("message")}
          className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
            errors.message
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-200"
          }`}
        />
        {errors.message && (
          <p className="text-xs text-red-500 font-semibold">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary-hover text-white rounded-none py-3 font-semibold text-sm transition-colors duration-300 cursor-pointer"
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
