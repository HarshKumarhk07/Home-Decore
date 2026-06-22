"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateWebsiteSettings } from "@/actions/cmsActions";
import { toast } from "sonner";
import { Loader2, Save, Building, Clock, Share2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsClientProps {
  initialSettings: any;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm({
    defaultValues: initialSettings || {},
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      // Format properties for Mongoose update
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg">
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="bg-slate-950 border border-slate-800 rounded-xl p-1 grid grid-cols-4 gap-2 mb-6">
            <TabsTrigger value="company" className="rounded-lg text-xs sm:text-sm flex items-center justify-center space-x-1.5 py-2">
              <Building className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="hours" className="rounded-lg text-xs sm:text-sm flex items-center justify-center space-x-1.5 py-2">
              <Clock className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Hours & Maps</span>
            </TabsTrigger>
            <TabsTrigger value="socials" className="rounded-lg text-xs sm:text-sm flex items-center justify-center space-x-1.5 py-2">
              <Share2 className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Socials</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-lg text-xs sm:text-sm flex items-center justify-center space-x-1.5 py-2">
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">SEO Config</span>
            </TabsTrigger>
          </TabsList>

          {/* 1. Company Tab */}
          <TabsContent value="company" className="space-y-4 pt-2">
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
          </TabsContent>

          {/* 2. Hours & Maps Tab */}
          <TabsContent value="hours" className="space-y-4 pt-2">
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
          </TabsContent>

          {/* 3. Socials Tab */}
          <TabsContent value="socials" className="space-y-4 pt-2">
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
          </TabsContent>

          {/* 4. SEO Config Tab */}
          <TabsContent value="seo" className="space-y-4 pt-2">
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
          </TabsContent>
        </Tabs>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-800 mt-6 text-right">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-accent hover:bg-accent-hover text-dark font-bold px-6 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
