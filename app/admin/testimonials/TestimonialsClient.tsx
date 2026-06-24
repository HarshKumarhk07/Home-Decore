"use client";

import { useState, useEffect } from "react";
import { 
  getTestimonials, 
  saveTestimonial, 
  removeTestimonial, 
  uploadImageAction 
} from "@/actions/cmsActions";
import { toast } from "sonner";
import { 
  Loader2, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  UploadCloud, 
  X,
  MessageSquare,
  Star,
  Check,
  User,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function TestimonialsClient() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await getTestimonials();
      if (res.success) {
        setTestimonials(res.testimonials || []);
      } else {
        toast.error(res.message || "Failed to load testimonials.");
      }
    } catch (err) {
      console.error("Error loading testimonials:", err);
      toast.error("Failed to fetch testimonials.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Uploading avatar to cloud storage...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadImageAction(formData);

      if (res.success && res.url) {
        setEditingTestimonial((prev: any) => ({ ...prev, avatar: res.url }));
        toast.success("Avatar uploaded successfully!", { id: toastId });
      } else {
        toast.error(res.message || "Failed to upload avatar.", { id: toastId });
      }
    } catch (err) {
      toast.error("Avatar upload failed.", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const startNewTestimonial = () => {
    setEditingTestimonial({
      clientName: "",
      serviceReceived: "Waterproofing",
      rating: 5,
      feedbackText: "",
      avatar: "",
      isApproved: true
    });
    setIsEditing(true);
  };

  const startEditTestimonial = (t: any) => {
    setEditingTestimonial({ ...t });
    setIsEditing(true);
  };

  const handleToggleApproval = async (t: any) => {
    const payload = {
      ...t,
      isApproved: !t.isApproved
    };
    const res = await saveTestimonial(payload);
    if (res.success) {
      toast.success(`Testimonial ${payload.isApproved ? "approved" : "unapproved"} successfully!`);
      loadTestimonials();
    } else {
      toast.error(res.message || "Failed to update status.");
    }
  };

  const handleSaveTestimonial = async () => {
    if (!editingTestimonial?.clientName?.trim()) {
      toast.error("Client Name is required.");
      return;
    }
    if (!editingTestimonial?.feedbackText?.trim()) {
      toast.error("Feedback text is required.");
      return;
    }

    const res = await saveTestimonial(editingTestimonial);
    if (res.success) {
      toast.success(res.message || "Testimonial saved successfully!");
      setIsEditing(false);
      setEditingTestimonial(null);
      loadTestimonials();
    } else {
      toast.error(res.message || "Failed to save testimonial.");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }
    const res = await removeTestimonial(id);
    if (res.success) {
      toast.success(res.message || "Testimonial deleted successfully!");
      loadTestimonials();
    } else {
      toast.error(res.message || "Failed to delete testimonial.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg">
        {isEditing ? (
          // EDITING/CREATION STATE
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingTestimonial._id ? "Edit Testimonial" : "Add New Testimonial"}
              </h3>
              <Button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingTestimonial(null);
                }}
                className="bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900 rounded-none px-4 py-1.5 text-xs flex items-center space-x-1.5"
              >
                <X className="w-3.5 h-3.5" /> <span>Cancel</span>
              </Button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 bg-slate-950 p-6 border border-slate-800 rounded-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Name *</label>
                  <input
                    type="text"
                    value={editingTestimonial.clientName}
                    onChange={(e) => setEditingTestimonial((prev: any) => ({ ...prev, clientName: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. Arun Verma"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Received *</label>
                  <select
                    value={editingTestimonial.serviceReceived}
                    onChange={(e) => setEditingTestimonial((prev: any) => ({ ...prev, serviceReceived: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="Waterproofing">Waterproofing</option>
                    <option value="Wooden Flooring">Wooden Flooring</option>
                    <option value="PVC (Polyvinyl Chloride)">PVC (Polyvinyl Chloride)</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating (1 to 5 Stars) *</label>
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingTestimonial((prev: any) => ({ ...prev, rating: star }))}
                        className="text-accent focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= editingTestimonial.rating
                              ? "fill-accent text-accent"
                              : "text-slate-650"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-3 rounded-none">
                  <input
                    type="checkbox"
                    id="isApproved"
                    checked={editingTestimonial.isApproved}
                    onChange={(e) => setEditingTestimonial((prev: any) => ({ ...prev, isApproved: e.target.checked }))}
                    className="w-4 h-4 rounded-none text-accent bg-slate-950 border-slate-800 accent-accent"
                  />
                  <label htmlFor="isApproved" className="text-sm font-bold text-slate-300 select-none cursor-pointer">
                    Approve/Publish Testimonial
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Avatar / Photo URL</label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={editingTestimonial.avatar}
                    onChange={(e) => setEditingTestimonial((prev: any) => ({ ...prev, avatar: e.target.value }))}
                    className="flex-grow bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="/avatar.jpg or https://..."
                  />
                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-none px-4 py-2.5 text-xs font-semibold cursor-pointer flex items-center space-x-1 shrink-0">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {editingTestimonial.avatar && (
                  <div className="relative w-16 h-16 border border-slate-800 mt-2 rounded-full overflow-hidden bg-slate-900">
                    <Image src={editingTestimonial.avatar} alt="Avatar preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feedback Text *</label>
                <textarea
                  rows={4}
                  value={editingTestimonial.feedbackText}
                  onChange={(e) => setEditingTestimonial((prev: any) => ({ ...prev, feedbackText: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Enter the customer's detailed review..."
                />
              </div>
            </div>

            {/* Save Testimonial */}
            <div className="pt-4 border-t border-slate-800 text-right">
              <Button
                type="button"
                onClick={handleSaveTestimonial}
                className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-none px-8 py-3 text-sm flex items-center space-x-2 ml-auto"
              >
                <Save className="w-4 h-4" /> <span>Save Testimonial</span>
              </Button>
            </div>
          </div>
        ) : (
          // LIST STATE
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  <span>Customer Testimonials</span>
                </h3>
                <p className="text-xs text-slate-400">View and moderate client feedback and review scores.</p>
              </div>
              <Button
                type="button"
                onClick={startNewTestimonial}
                className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-none px-4 py-2 text-xs flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" /> <span>Add Testimonial</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mr-3 text-accent" />
                <span>Loading testimonials...</span>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 text-slate-500 italic">
                No testimonials found. Click 'Add Testimonial' to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {testimonials.map((t) => (
                  <div
                    key={t._id}
                    className="bg-slate-950 border border-slate-800 p-5 rounded-none flex flex-col md:flex-row gap-6 items-start justify-between"
                  >
                    <div className="flex gap-4 items-start">
                      {t.avatar ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                          <Image src={t.avatar} alt={t.clientName} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-serif text-base font-bold text-white">{t.clientName}</h4>
                          <span className="text-[10px] bg-slate-850 text-slate-300 px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                            {t.serviceReceived}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-accent">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < t.rating ? "fill-accent text-accent" : "text-slate-850"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed italic pr-6 pt-1">
                          &ldquo;{t.feedbackText}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 pt-4 md:pt-0">
                      <Button
                        type="button"
                        onClick={() => handleToggleApproval(t)}
                        className={`rounded-none px-4 py-2 text-xs flex items-center justify-center space-x-1.5 w-full border ${
                          t.isApproved
                            ? "bg-emerald-950/20 hover:bg-emerald-950 text-emerald-500 border-emerald-950/40"
                            : "bg-amber-950/20 hover:bg-amber-950 text-amber-500 border-amber-950/40"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" /> 
                        <span>{t.isApproved ? "Approved" : "Pending"}</span>
                      </Button>
                      <div className="flex gap-2 w-full">
                        <Button
                          type="button"
                          onClick={() => startEditTestimonial(t)}
                          className="bg-slate-800 hover:bg-slate-700 text-white rounded-none px-3 py-2 text-xs flex items-center justify-center space-x-1.5 w-full border border-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t._id)}
                          className="bg-red-950/20 hover:bg-red-950 text-red-500 rounded-none px-3 py-2 text-xs flex items-center justify-center space-x-1.5 w-full border border-red-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
