"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InspectionSchema } from "@/lib/schemas";
import { submitInspectionBooking } from "@/actions/leadActions";
import { toast } from "sonner";
import { Loader2, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type InspectionFormValues = z.infer<typeof InspectionSchema>;

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

export default function InspectionForm() {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InspectionFormValues>({
    resolver: zodResolver(InspectionSchema) as any,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      service: "Waterproofing",
      subService: "",
      preferredDate: "",
      preferredTime: timeSlots[0],
      remarks: "",
    },
  });

  const selectedService = watch("service");

  useEffect(() => {
    async function loadSettings() {
      try {
        const { getSettings } = await import("@/actions/cmsActions");
        const res = await getSettings();
        if (res.success) {
          setSettings(res.settings);
        }
      } catch (error) {
        console.error("Error loading form settings:", error);
      }
    }
    loadSettings();
  }, []);

  const getSubcategories = () => {
    if (selectedService === "Waterproofing") {
      return settings?.waterproofingSubcategories && settings.waterproofingSubcategories.length > 0
        ? settings.waterproofingSubcategories
        : defaultSubServices["Waterproofing"];
    }
    if (selectedService === "Wooden Flooring") {
      return settings?.flooringSubcategories && settings.flooringSubcategories.length > 0
        ? settings.flooringSubcategories
        : defaultSubServices["Wooden Flooring"];
    }
    if (selectedService === "PVC (Polyvinyl Chloride)") {
      return settings?.pvcSubcategories && settings.pvcSubcategories.length > 0
        ? settings.pvcSubcategories
        : defaultSubServices["PVC (Polyvinyl Chloride)"];
    }
    return [];
  };

  const subCategories = getSubcategories();

  useEffect(() => {
    if (subCategories && subCategories.length > 0) {
      setValue("subService", subCategories[0]);
    } else {
      setValue("subService", "");
    }
  }, [selectedService, settings]);

  const onSubmit = (data: InspectionFormValues) => {
    startTransition(async () => {
      try {
        const result = await submitInspectionBooking(data);
        if (result.success) {
          toast.success(result.message || "Inspection scheduled successfully! Our team will contact you very soon. Thank you for choosing us.");
          reset();
        } else {
          toast.error(result.message || "Failed to book inspection.");
        }
      } catch (error) {
        toast.error("Failed to submit request. Please try again.");
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
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "border-slate-200"
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
            className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200"
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
          className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
            errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200"
          }`}
        />
        {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
      </div>

      {/* Service selection */}
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
          <option value="Waterproofing">Waterproofing Solutions</option>
          <option value="Wooden Flooring">Wooden Flooring</option>
          <option value="PVC (Polyvinyl Chloride)">PVC (Polyvinyl Chloride)</option>
        </select>
        {errors.service && <p className="text-xs text-red-500 font-semibold">{errors.service.message}</p>}
      </div>

      {/* Sub-Service / Treatment type selection */}
      {subCategories.length > 0 && (
        <div className="space-y-1 animate-fade-in">
          <label htmlFor="subService" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sub-Category / Treatment Type
          </label>
          <select
            id="subService"
            disabled={isPending}
            {...register("subService")}
            className="w-full border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 bg-white transition-all duration-200"
          >
            {subCategories.map((sub: string) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          {errors.subService && <p className="text-xs text-red-500 font-semibold">{errors.subService.message}</p>}
        </div>
      )}

      {/* Address */}
      <div className="space-y-1">
        <label htmlFor="address" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Site Address
        </label>
        <textarea
          id="address"
          rows={3}
          disabled={isPending}
          placeholder="Complete address of the building/site to be inspected..."
          {...register("address")}
          className={`w-full border rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
            errors.address ? "border-red-500 focus:ring-red-500" : "border-slate-200"
          }`}
        />
        {errors.address && <p className="text-xs text-red-500 font-semibold">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Preferred Date */}
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

        {/* Preferred Time */}
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
          {errors.preferredTime && <p className="text-xs text-red-500 font-semibold">{errors.preferredTime.message}</p>}
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-1">
        <label htmlFor="remarks" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Specific Remarks / Notes (Optional)
        </label>
        <textarea
          id="remarks"
          rows={2}
          disabled={isPending}
          placeholder="E.g., Seepage on drawing room ceiling, cracks on terrace floor..."
          {...register("remarks")}
          className="w-full border border-slate-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200"
        />
      </div>

      {/* Submit */}
      <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white rounded-none py-3 font-bold text-sm shadow-[0_4px_14px_rgba(30,64,175,0.25)] hover:shadow-[0_4px_20px_rgba(30,64,175,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling...
          </>
        ) : (
          <>
            <CalendarCheck2 className="w-4 h-4 mr-2" /> Book Site Inspection
          </>
        )}
      </Button>
    </form>
  );
}
