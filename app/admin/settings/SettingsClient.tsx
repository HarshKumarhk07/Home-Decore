"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  updateWebsiteSettings 
} from "@/actions/cmsActions";
import { toast } from "sonner";
import { 
  Loader2, 
  Save, 
  Building, 
  Clock, 
  Share2, 
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

interface SettingsClientProps {
  initialSettings: any;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [isPending, startTransition] = useTransition();

  // Basic settings form
  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...initialSettings,
      waterproofingSubcategories: initialSettings?.waterproofingSubcategories?.join(", ") || "",
      flooringSubcategories: initialSettings?.flooringSubcategories?.join(", ") || "",
      pvcSubcategories: initialSettings?.pvcSubcategories?.join(", ") || "",
    },
  });

  const onSubmitSettings = (data: any) => {
    startTransition(async () => {
      const payload = {
        companyName: data.companyName,
        phoneNumber: data.phoneNumber,
        whatsappNumber: data.whatsappNumber,
        email: data.email,
        address: data.address,
        businessHours: data.businessHours,
        googleMapsEmbed: data.googleMapsEmbed,
        socialLinks: {
          facebook: data.socialLinks?.facebook || "",
          instagram: data.socialLinks?.instagram || "",
          twitter: data.socialLinks?.twitter || "",
          linkedin: data.socialLinks?.linkedin || "",
        },
        seoMetadata: {
          title: data.seoMetadata?.title || "",
          description: data.seoMetadata?.description || "",
          keywords: data.seoMetadata?.keywords || "",
        },
        waterproofingSubcategories: typeof data.waterproofingSubcategories === "string"
          ? data.waterproofingSubcategories.split(",").map((s: string) => s.trim()).filter(Boolean)
          : data.waterproofingSubcategories || [],
        flooringSubcategories: typeof data.flooringSubcategories === "string"
          ? data.flooringSubcategories.split(",").map((s: string) => s.trim()).filter(Boolean)
          : data.flooringSubcategories || [],
        pvcSubcategories: typeof data.pvcSubcategories === "string"
          ? data.pvcSubcategories.split(",").map((s: string) => s.trim()).filter(Boolean)
          : data.pvcSubcategories || [],
      };

      const res = await updateWebsiteSettings(payload);
      if (res.success) {
        toast.success(res.message || "Settings updated successfully!");
      } else {
        toast.error(res.message || "Failed to update settings.");
      }
    });
  };



  return (
    <div className="space-y-6 max-w-5xl">
      <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-8">
        
        {/* 1. Company Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Building className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-white">Company Information</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                disabled={isPending}
                {...register("companyName")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                disabled={isPending}
                {...register("email")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telephone Phone</label>
              <input
                type="text"
                disabled={isPending}
                {...register("phoneNumber")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Number</label>
              <input
                type="text"
                disabled={isPending}
                {...register("whatsappNumber")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Headquarters Address</label>
            <textarea
              rows={3}
              disabled={isPending}
              {...register("address")}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* 2. Hours & Maps */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Clock className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-white">Business Hours & Location Map</h2>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Operating Hours</label>
            <input
              type="text"
              disabled={isPending}
              {...register("businessHours")}
              placeholder="Mon - Sat: 9:00 AM - 6:30 PM"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Maps Embed link (Iframe Src)</label>
            <textarea
              rows={4}
              disabled={isPending}
              {...register("googleMapsEmbed")}
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* 3. Socials */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Share2 className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-white">Social Media Links</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Facebook Link</label>
              <input
                type="text"
                disabled={isPending}
                {...register("socialLinks.facebook")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instagram Link</label>
              <input
                type="text"
                disabled={isPending}
                {...register("socialLinks.instagram")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Twitter Link</label>
              <input
                type="text"
                disabled={isPending}
                {...register("socialLinks.twitter")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">LinkedIn Link</label>
              <input
                type="text"
                disabled={isPending}
                {...register("socialLinks.linkedin")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        </div>

        {/* 4. SEO Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
            <Search className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-white">SEO Configuration</h2>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Meta Title</label>
            <input
              type="text"
              disabled={isPending}
              {...register("seoMetadata.title")}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Meta Description</label>
            <textarea
              rows={3}
              disabled={isPending}
              {...register("seoMetadata.description")}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Default Meta Keywords (comma separated)</label>
            <input
              type="text"
              disabled={isPending}
              {...register("seoMetadata.keywords")}
              placeholder="waterproofing, wooden flooring, pvc"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Unified Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-accent hover:bg-accent-hover text-dark font-bold px-8 py-3.5 rounded-xl text-sm flex items-center space-x-2 transition-all duration-200 hover:scale-[1.02]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Save All Settings</span>
                <Save className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
