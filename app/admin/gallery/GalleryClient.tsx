"use client";

import { useState, useTransition, useRef } from "react";
import { addGalleryPhoto, removeGalleryPhoto, uploadImageAction } from "@/actions/cmsActions";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, UploadCloud, X } from "lucide-react";

interface GalleryClientProps {
  initialPhotos: any[];
}

export default function GalleryClient({ initialPhotos }: GalleryClientProps) {
  const [photos, setPhotos] = useState<any[]>(initialPhotos);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("waterproofing");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setTitle("");
    setCategory("waterproofing");
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a photo title.");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload an image.");
      return;
    }

    startTransition(async () => {
      try {
        console.log("📤 Starting upload for:", title);

        // 1. Upload file to Cloudinary first
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        console.log("📋 FormData prepared with file:", imageFile.name);

        const uploadRes = await uploadImageAction(uploadForm);
        console.log("📥 Upload response:", uploadRes);

        if (!uploadRes.success || !uploadRes.url) {
          const errorMsg = uploadRes.message || "Failed to upload image.";
          console.error("❌ Upload failed:", errorMsg);
          toast.error(errorMsg);
          return;
        }

        console.log("✅ Upload successful, URL:", uploadRes.url);

        // 2. Save record in database
        const res = await addGalleryPhoto({
          title,
          category,
          imageUrl: uploadRes.url,
        });

        console.log("💾 Database save response:", res);

        if (res.success) {
          toast.success("Photo added successfully!");

          setPhotos((prev) => [
            { title, category, imageUrl: uploadRes.url, createdAt: new Date().toISOString(), _id: "temp-" + Date.now() },
            ...prev,
          ]);

          closeModal();
        } else {
          toast.error(res.message || "Failed to save photo.");
        }
      } catch (error: any) {
        console.error("❌ Error during submission:", error);
        toast.error(error.message || "An error occurred during submission.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this photo from the gallery?")) return;
    startTransition(async () => {
      const res = await removeGalleryPhoto(id);
      if (res.success) {
        toast.success("Photo deleted!");
        setPhotos((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(res.message || "Failed to delete photo.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Work Gallery</h3>
          <p className="text-xs text-slate-400">Add or manage portfolio image listings</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-4 py-2 text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          {/* Modal */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto z-50">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-lg font-bold text-white">Add Photo to Gallery</h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Photo Title</label>
                <input
                  type="text"
                  placeholder="E.g., Terrace Chemical Coating"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Category Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="waterproofing">Waterproofing</option>
                  <option value="wooden-flooring">Wooden Flooring</option>
                  <option value="pvc">PVC (Polyvinyl Chloride)</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attach Image File</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 rounded px-4 py-6 flex items-center justify-center space-x-2 text-xs text-slate-400 cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-5 h-5 text-accent shrink-0" />
                  <span>Upload Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imageFile && (
                  <p className="text-[11px] text-slate-400 truncate">
                    ✓ {imageFile.name}
                  </p>
                )}
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div className="relative h-32 w-full rounded overflow-hidden border border-slate-800 shadow">
                  <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent-hover disabled:bg-slate-700 text-dark font-bold py-2.5 rounded text-xs flex items-center justify-center cursor-pointer transition-colors mt-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading & Saving...
                  </>
                ) : (
                  "Add to Portfolio"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((p) => (
          <div key={p._id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow aspect-4/3 flex flex-col justify-end">
            <img src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4">
              {/* Top Action */}
              <div className="text-right">
                {p._id && (
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500/90 hover:bg-red-650 text-white rounded-lg h-8 w-8 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Bottom Details */}
              <div className="space-y-1">
                <span className="text-[9px] bg-accent text-dark px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  {p.category.replace("-", " ")}
                </span>
                <h4 className="font-serif font-bold text-white text-sm truncate">{p.title}</h4>
              </div>
            </div>
          </div>
        ))}

        {photos.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium bg-slate-900 border border-slate-800 rounded-2xl col-span-3">
            No gallery photos added. Click 'Add Photo' to upload images.
          </div>
        )}
      </div>
    </div>
  );
}
