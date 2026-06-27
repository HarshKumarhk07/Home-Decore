"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QuoteSchema } from "@/lib/schemas";
import { submitQuoteRequest } from "@/actions/leadActions";
import { toast } from "sonner";
import { Loader2, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuoteFormValues = z.infer<typeof QuoteSchema>;

const timeSlots = [
  "09:00 AM - 11:30 AM",
  "11:30 AM - 02:00 PM",
  "02:00 PM - 04:30 PM",
  "04:30 PM - 07:00 PM",
];

const defaultSubServices: Record<string, string[]> = {
  "Waterproofing": [
    "Roof & Slab Waterproofing",
    "Terrace Waterproofing",
    "Bathroom Seepage Waterproofing",
    "Basement & Retaining Wall Grouting",
    "Underground & Overhead Water Tanks",
  ],
  "Wooden Flooring": [
    "SPC Click-Lock Flooring",
    "Premium Laminate Flooring",
    "Engineered Wood Flooring",
    "Luxury Vinyl Flooring (LVP)",
  ],
  "PVC (Polyvinyl Chloride)": [
    "SPC Click-Lock Flooring",
    "Luxury Vinyl Planks (LVP) / Tiles (LVT)",
    "Roll & Sheet PVC Flooring",
    "Anti-Static (ESD) PVC Flooring",
    "PVC Wall Panels & Cladding",
  ],
};

export default function QuoteForm() {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(QuoteSchema) as any,
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      service: "Waterproofing",
      subService: "",
      propertyType: "Residential",
      area: 0,
      budget: 0,
      preferredDate: "",
      preferredTime: timeSlots[0],
      message: "",
    },
  });

  const selectedService = watch("service");

  useEffect(() => {
    async function loadCategories() {
      try {
        const { getServiceCategories } = await import("@/actions/cmsActions");
        const res = await getServiceCategories();
        if (res.success && res.categories && res.categories.length > 0) {
          setCategories(res.categories);
          setValue("service", res.categories[0].name);
        }
      } catch (error) {
        console.error("Error loading categories for form:", error);
      }
    }
    loadCategories();
  }, []);

  // Derive subcategories from selected category
  const getSubcategories = (): string[] => {
    if (categories.length > 0) {
      const cat = categories.find((c: any) => c.name === selectedService);
      return cat?.subcategories?.map((s: any) => s.name).filter(Boolean) || [];
    }
    return defaultSubServices[selectedService] || [];
  };

  const subCategories = getSubcategories();

  useEffect(() => {
    if (subCategories && subCategories.length > 0) {
      setValue("subService", subCategories[0]);
    } else {
      setValue("subService", "");
    }
  }, [selectedService, categories]);

  const onSubmit = (data: QuoteFormValues) => {
    startTransition(async () => {
      try {
        // Build FormData to send text fields to the Server Action
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
          formData.append(key, (val ?? "").toString());
        });

        const result = await submitQuoteRequest(formData);

        if (result.success) {
          toast.success(
            <div className="flex flex-col space-y-1">
              <span className="font-bold">Quote Submitted!</span>
              <span className="text-xs">Lead ID: {result.leadId}</span>
            </div>,
            { duration: 6000 }
          );
          reset();
        } else {
          toast.error(result.message || "Failed to submit quote request.");
        }
      } catch (error) {
        toast.error("Submission failed. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Group 1: Name, Phone, Email */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="customerName" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="customerName"
            type="text"
            disabled={isPending}
            placeholder="John Doe"
            {...register("customerName")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.customerName ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.customerName && <p className="text-xs text-red-500 font-semibold">{errors.customerName.message}</p>}
        </div>

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
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Email <span className="text-slate-400 normal-case font-medium">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            disabled={isPending}
            placeholder="john@example.com"
            {...register("email")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
        </div>
      </div>

      {/* Group 2: City, Required Service */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="city" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            City
          </label>
          <input
            id="city"
            type="text"
            disabled={isPending}
            placeholder="Noida / Delhi / Gurugram"
            {...register("city")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.city ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.city && <p className="text-xs text-red-500 font-semibold">{errors.city.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="service" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Required Service
          </label>
          <select
            id="service"
            disabled={isPending}
            {...register("service")}
            className="w-full border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 bg-white transition-all duration-200"
          >
            {categories.length > 0
              ? categories.map((cat: any) => (
                  <option key={cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              : (
                <>
                  <option value="Waterproofing">Waterproofing Solutions</option>
                  <option value="Wooden Flooring">Wooden Flooring</option>
                  <option value="PVC (Polyvinyl Chloride)">PVC (Polyvinyl Chloride)</option>
                </>
              )
            }
          </select>
        </div>
      </div>

      {/* Group 3: Preferred Date/Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="preferredDate" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Preferred Date
          </label>
          <input
            id="preferredDate"
            type="date"
            disabled={isPending}
            min={new Date().toISOString().split("T")[0]}
            {...register("preferredDate")}
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.preferredDate ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.preferredDate && <p className="text-xs text-red-500 font-semibold">{errors.preferredDate.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="preferredTime" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Preferred Time Slot
          </label>
          <select
            id="preferredTime"
            disabled={isPending}
            {...register("preferredTime")}
            className="w-full border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 bg-white transition-all duration-200"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary-hover text-white rounded-none py-4 font-bold text-sm shadow-md transition-colors cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting Request...
          </>
        ) : (
          <>
            <FileCheck2 className="w-4 h-4 mr-2 text-accent" /> Submit Quote Request
          </>
        )}
      </Button>
    </form>
  );
}
