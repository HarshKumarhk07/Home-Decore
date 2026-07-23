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
  Waterproofing: [
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

export interface InspectionFormProps {
  // Lead attribution — set on SEO landing pages so admins know which
  // service/city page generated the lead.
  source?: string;
  sourceUrl?: string;
  sourceSlug?: string;
  // Optional prefill for landing pages.
  defaultService?: string;
  defaultCity?: string;
}

export default function InspectionForm({
  source,
  sourceUrl,
  sourceSlug,
  defaultService,
  defaultCity,
}: InspectionFormProps = {}) {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<any[]>([]);

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
      city: defaultCity || "",
      address: "",
      service: defaultService || "Waterproofing",
      subService: "",
      preferredDate: "",
      preferredTime: timeSlots[0],
      remarks: "",
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
          // Preserve a landing-page-provided service; otherwise default to
          // the first category, matching it to a real category name if possible.
          if (defaultService) {
            const match = res.categories.find(
              (c: any) => c.name.toLowerCase() === defaultService.toLowerCase(),
            );
            setValue("service", match ? match.name : res.categories[0].name);
          } else {
            setValue("service", res.categories[0].name);
          }
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
    // Fallback to hardcoded defaults
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

  const onSubmit = (data: InspectionFormValues) => {
    startTransition(async () => {
      try {
        const result = await submitInspectionBooking({
          ...data,
          source: source || "Website",
          sourceUrl,
          sourceSlug,
        });
        if (result.success) {
          toast.success(
            result.message ||
              "Inspection scheduled successfully! Our team will contact you very soon. Thank you for choosing us.",
          );
          reset();

          // Send all booking details to admin on WhatsApp
          const queryNumber = result.leadId || "N/A";
          const waMessage = [
            `🔔 *New Inspection Booking Received!*`,
            `📋 *Query No:* ${queryNumber}`,
            ``,
            `1️⃣ *Name:* ${data.name}`,
            `2️⃣ *Phone:* ${data.phone}`,
            `3️⃣ *Email:* ${data.email || "—"}`,
            `4️⃣ *City:* ${data.city || "—"}`,
            `5️⃣ *Address:* ${data.address}`,
            `6️⃣ *Service:* ${data.service}`,
            ...(data.subService ? [`7️⃣ *Treatment:* ${data.subService}`] : []),
            `${data.subService ? `8` : `7`}️⃣ *Preferred Date:* ${data.preferredDate || "—"}`,
            `${data.subService ? `9` : `8`}️⃣ *Preferred Time:* ${data.preferredTime || "—"}`,
            `${data.subService ? `🔟` : `9️⃣`} *Remarks:* ${data.remarks || "—"}`,
            ...(source ? [`📍 *Lead Source:* ${source}`] : []),
            ``,
            `_Please confirm the inspection slot._`,
          ].join("\n");

          window.open(
            `https://wa.me/918295524045?text=${encodeURIComponent(waMessage)}`,
            "_blank"
          );
        } else {
          toast.error(result.message || "Failed to book inspection.");
        }
      } catch (error) {
        toast.error("Failed to submit request. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Name */}
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider"
          >
            Full Name
          </label>
          <input
            suppressHydrationWarning
            id="name"
            type="text"
            disabled={isPending}
            placeholder="Enter Your Name"
            {...register("name")}
            className={`w-full border rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
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
            suppressHydrationWarning
            id="phone"
            type="tel"
            disabled={isPending}
            placeholder="Enter Your Phone Number"
            {...register("phone")}
            className={`w-full border rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
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

      {/* City */}
      <div className="space-y-1">
        <label
          htmlFor="city"
          className="text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          City
        </label>
        <input
          suppressHydrationWarning
          id="city"
          type="text"
          disabled={isPending}
          placeholder="e.g. Bhiwani, Rohtak, Gurgaon..."
          {...register("city")}
          className={`w-full border rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 transition-all duration-200 ${
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

      {/* Service selection */}
      <div className="space-y-1">
        <label
          htmlFor="service"
          className="text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          Required Service
        </label>
        <select
          suppressHydrationWarning
          id="service"
          disabled={isPending}
          {...register("service")}
          className="w-full border border-slate-200 rounded-none px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:ring-offset-0.5 bg-white transition-all duration-200"
        >
          {categories.length > 0 ? (
            categories.map((cat: any) => (
              <option key={cat._id || cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))
          ) : (
            <>
              <option value="Waterproofing">Waterproofing Solutions</option>
              <option value="Wooden Flooring">Wooden Flooring</option>
              <option value="PVC (Polyvinyl Chloride)">
                PVC (Polyvinyl Chloride)
              </option>
            </>
          )}
        </select>
        {errors.service && (
          <p className="text-xs text-red-500 font-semibold">
            {errors.service.message}
          </p>
        )}
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
