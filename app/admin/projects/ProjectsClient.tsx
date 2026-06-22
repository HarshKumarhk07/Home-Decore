"use client";

import { useState, useTransition, useRef } from "react";
import { saveProject, removeProject, uploadImageAction } from "@/actions/cmsActions";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, FolderKanban, UploadCloud, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProjectsClientProps {
  initialProjects: any[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [projects, setProjects] = useState<any[]>(initialProjects);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("waterproofing");
  const [location, setLocation] = useState("");
  const [areaCovered, setAreaCovered] = useState("");
  const [duration, setDuration] = useState("");
  const [warranty, setWarranty] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearForm = () => {
    setTitle("");
    setCategory("waterproofing");
    setLocation("");
    setAreaCovered("");
    setDuration("");
    setWarranty("");
    setDescription("");
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !areaCovered.trim() || !duration.trim() || !warranty.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload a main showcase image.");
      return;
    }

    startTransition(async () => {
      try {
        // 1. Upload project image to Cloudinary
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await uploadImageAction(uploadForm);

        if (!uploadRes.success || !uploadRes.url) {
          toast.error(uploadRes.message || "Failed to upload project image.");
          return;
        }

        // 2. Save project record
        const payload = {
          title,
          category,
          location,
          areaCovered,
          duration,
          warranty,
          description,
          images: [uploadRes.url],
          completionDate: new Date(),
        };

        const res = await saveProject(payload);
        if (res.success) {
          toast.success("Project added successfully!");
          
          setProjects((prev) => [
            { ...payload, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), createdAt: new Date().toISOString() },
            ...prev,
          ]);

          clearForm();
          setIsOpen(false);
        } else {
          toast.error(res.message || "Failed to save project.");
        }
      } catch (error) {
        toast.error("An error occurred during submission.");
      }
    });
  };

  const handleDelete = (slug: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    startTransition(async () => {
      const res = await removeProject(slug);
      if (res.success) {
        toast.success("Project deleted successfully!");
        setProjects((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        toast.error(res.message || "Failed to delete project.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">Client Projects</h3>
          <p className="text-xs text-slate-400">Manage case study articles displayed on the homepage and dynamic route groups</p>
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
              <span>Add Project</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8 max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-white">Add New Case Study Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Title</label>
                  <input
                    type="text"
                    placeholder="E.g., Grand Hyatt Terrace Sealing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent bg-slate-950"
                  >
                    <option value="waterproofing">Waterproofing</option>
                    <option value="wooden-flooring">Wooden Flooring</option>
                    <option value="pvc">PVC (Polyvinyl Chloride)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    placeholder="Sector 62, Noida"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Area Covered</label>
                  <input
                    type="text"
                    placeholder="1,500 Sq Ft"
                    value={areaCovered}
                    onChange={(e) => setAreaCovered(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    placeholder="7 Days"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warranty Info</label>
                <input
                  type="text"
                  placeholder="5 Years Coating Warranty"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Upload image */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Showcase Image</label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-dashed border-slate-800 hover:bg-slate-800/50 rounded-xl py-6 px-4 flex items-center space-x-2 text-xs text-slate-400 cursor-pointer"
                  >
                    <UploadCloud className="w-5 h-5 text-accent" />
                    <span>Upload Image</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {previewUrl && (
                  <div className="relative h-32 w-52 rounded-xl overflow-hidden border border-slate-800 mt-2 shadow group">
                    <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Description</label>
                <textarea
                  rows={4}
                  placeholder="Enter detailed scope of work description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent-hover text-dark font-bold py-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Case Study...
                  </>
                ) : (
                  "Create Case Study"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Showcase</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Parameters</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              {projects.map((p) => (
                <tr key={p.slug} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 shrink-0">
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-slate-800 shadow-sm">
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    <div>
                      <span>{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-bold text-accent">
                    {p.category.replace("-", " ")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs text-slate-400 space-y-0.5">
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" />{p.location}</span>
                      <span>Area: {p.areaCovered}</span>
                      <span>Warranty: {p.warranty.split(" ")[0]} Years</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.slug && (
                      <Button
                        onClick={() => handleDelete(p.slug)}
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium bg-slate-900 border border-slate-800">
            No projects added. Click 'Add Project' to add portfolio entries.
          </div>
        )}
      </div>
    </div>
  );
}
