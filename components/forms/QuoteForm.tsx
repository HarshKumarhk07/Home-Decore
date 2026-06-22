"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QuoteSchema } from "@/lib/schemas";
import { submitQuoteRequest } from "@/actions/leadActions";
import { toast } from "sonner";
import { Loader2, FileCheck2, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuoteFormValues = z.infer<typeof QuoteSchema>;

const timeSlots = [
  "09:00 AM - 11:30 AM",
  "11:30 AM - 02:00 PM",
  "02:00 PM - 04:30 PM",
  "04:30 PM - 07:00 PM",
];

export default function QuoteForm() {
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
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
      propertyType: "Residential",
      area: 0,
      budget: 0,
      preferredDate: "",
      preferredTime: timeSlots[0],
      message: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    // Limit to max 3 files
    if (selectedFiles.length + files.length > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file.`);
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB size limit.`);
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...validPreviews]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: QuoteFormValues) => {
    startTransition(async () => {
      try {
        // Build FormData to send text fields and binary files to the Server Action
        const formData = new FormData();
        Object.entries(data).forEach(([key, val]) => {
          formData.append(key, val.toString());
        });

        // Append files
        selectedFiles.forEach((file) => {
          formData.append("images", file);
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
          setSelectedFiles([]);
          setPreviews([]);
          if (fileInputRef.current) fileInputRef.current.value = "";
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
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.customerName ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
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
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
            }`}
          />
          {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone.message}</p>}
        </div>

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
      </div>

      {/* Group 2: City, Address */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.city ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
            }`}
          />
          {errors.city && <p className="text-xs text-red-500 font-semibold">{errors.city.message}</p>}
        </div>

        <div className="md:col-span-2 space-y-1">
          <label htmlFor="address" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Full Address
          </label>
          <input
            id="address"
            type="text"
            disabled={isPending}
            placeholder="Flat/House No, Building, Area details..."
            {...register("address")}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.address ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
            }`}
          />
          {errors.address && <p className="text-xs text-red-500 font-semibold">{errors.address.message}</p>}
        </div>
      </div>

      {/* Group 3: Service, Property Type, Area, Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label htmlFor="service" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Required Service
          </label>
          <select
            id="service"
            disabled={isPending}
            {...register("service")}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="Waterproofing">Waterproofing Solutions</option>
            <option value="Wooden Flooring">Wooden Flooring</option>
            <option value="PVC (Polyvinyl Chloride)">PVC (Polyvinyl Chloride)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="propertyType" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Property Type
          </label>
          <select
            id="propertyType"
            disabled={isPending}
            {...register("propertyType")}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="area" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Area (Sq Ft)
          </label>
          <input
            id="area"
            type="number"
            disabled={isPending}
            placeholder="1200"
            {...register("area")}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.area ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
            }`}
          />
          {errors.area && <p className="text-xs text-red-500 font-semibold">{errors.area.message}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="budget" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Est. Budget (₹)
          </label>
          <input
            id="budget"
            type="number"
            disabled={isPending}
            placeholder="50000"
            {...register("budget")}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.budget ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
            }`}
          />
          {errors.budget && <p className="text-xs text-red-500 font-semibold">{errors.budget.message}</p>}
        </div>
      </div>

      {/* Group 4: Preferred Date/Time */}
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
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${
              errors.preferredDate ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-primary"
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
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Upload Input */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Upload Site Images (Max 3, up to 5MB each)
        </label>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            type="button"
            disabled={isPending || selectedFiles.length >= 3}
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full sm:w-auto border-dashed border-slate-350 hover:bg-slate-50 rounded-xl py-6 px-6 flex items-center space-x-2 text-slate-650 cursor-pointer"
          >
            <UploadCloud className="w-5 h-5 text-accent shrink-0" />
            <span>Select Images</span>
          </Button>
          <span className="text-xs text-slate-400">
            {selectedFiles.length} of 3 files attached
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Thumbnail Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-2 max-w-md">
            {previews.map((preview, index) => (
              <div key={index} className="relative h-20 rounded-xl overflow-hidden border border-slate-100 shadow-sm group">
                <img src={preview} alt="Attached Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-650 shadow transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1">
        <label htmlFor="message" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Specific Requirements / Message (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          disabled={isPending}
          placeholder="E.g., Seepage symptoms, preferred colors, wood texture preferences..."
          {...register("message")}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-4 font-bold text-sm shadow-md transition-colors"
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
