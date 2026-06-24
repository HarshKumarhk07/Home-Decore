"use client";

import { useState, useTransition, useRef } from "react";
import { addGalleryPhoto, removeGalleryPhoto, uploadImageAction } from "@/actions/cmsActions";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, UploadCloud, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface GalleryClientProps {
  initialPhotos: any[];
}

export default function GalleryClient({ initialPhotos }: GalleryClientProps) {
  const [photos, setPhotos] = useState<any[]>(initialPhotos);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
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
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearForm = () => {
    setTitle("");
    setCategory("waterproofing");
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        // 1. Upload file to Cloudinary first
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await uploadImageAction(uploadForm);

        if (!uploadRes.success || !uploadRes.url) {
          toast.error(uploadRes.message || "Failed to upload image.");
          return;
        }

        // 2. Save record in database
        const res = await addGalleryPhoto({
          title,
          category,
          imageUrl: uploadRes.url,
        });

        if (res.success) {
          toast.success("Photo added successfully!");
          
          setPhotos((prev) => [
            { title, category, imageUrl: uploadRes.url, createdAt: new Date().toISOString() },
            ...prev,
          ]);

          clearForm();
          setIsOpen(false);
        } else {
          toast.error(res.message || "Failed to save photo.");
        }
      } catch (error) {
        toast.error("An error occurred during submission.");
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

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) clearForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-4 py-2 text-xs flex items-center space-x-1.5 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-none p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-white">Add Photo to Gallery</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Photo Title</label>
                <input
                  type="text"
                  placeholder="E.g., Terrace Chemical Coating"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent bg-slate-950"
                >
                  <option value="waterproofing">Waterproofing</option>
                  <option value="wooden-flooring">Wooden Flooring</option>
                  <option value="pvc">PVC (Polyvinyl Chloride)</option>
                </select>
              </div>

              {/* Upload input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attach Image File</label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-dashed border-slate-800 hover:bg-slate-800/50 rounded-none py-6 px-4 flex items-center space-x-2 text-xs text-slate-400 cursor-pointer"
                  >
                    <UploadCloud className="w-5 h-5 text-accent shrink-0" />
                    <span>Upload Image</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imageFile && (
                    <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {imageFile.name}
                    </span>
                  )}
                </div>

                {previewUrl && (
                  <div className="relative h-32 w-48 rounded-none overflow-hidden border border-slate-800 mt-2 shadow group">
                    <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent-hover text-dark font-bold py-2.5 rounded-none text-xs flex items-center justify-center cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading & Saving...
                  </>
                ) : (
                  "Add to Portfolio"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Visual Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((p) => (
          <div key={p._id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow aspect-4/3 flex flex-col justify-end">
            <img src={p.imageUrl} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4">
              {/* Top Action */}
              <div className="text-right">
                {p._id && (
                  <Button
                    onClick={() => handleDelete(p._id)}
                    size="icon"
                    className="bg-red-500/90 hover:bg-red-650 text-white rounded-lg h-8 w-8 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
