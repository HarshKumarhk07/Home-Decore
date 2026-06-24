"use client";

import { useState, useEffect } from "react";
import { 
  getServiceCategories, 
  saveServiceCategory, 
  deleteServiceCategory, 
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
  FileImage,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ServicesClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoadingCats(true);
    try {
      const res = await getServiceCategories();
      if (res.success) {
        setCategories(res.categories || []);
      } else {
        toast.error(res.message || "Failed to load categories.");
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      toast.error("Failed to fetch service categories.");
    } finally {
      setIsLoadingCats(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "cat" | number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";

    setUploadingImage(target === "cat" ? "cat" : `sub-${target}`);
    const toastId = toast.loading("Uploading image to cloud storage...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadImageAction(formData);

      if (res.success && res.url) {
        if (target === "cat") {
          setEditingCategory((prev: any) => ({ ...prev, image: res.url }));
        } else {
          setEditingCategory((prev: any) => {
            const subs = [...(prev.subcategories || [])];
            subs[target] = { ...subs[target], image: res.url };
            return { ...prev, subcategories: subs };
          });
        }
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error(res.message || "Failed to upload image.", { id: toastId });
      }
    } catch (err) {
      toast.error("Image upload failed.", { id: toastId });
    } finally {
      setUploadingImage(null);
    }
  };

  const startNewCategory = () => {
    setEditingCategory({
      name: "",
      slug: "",
      image: "",
      description: "",
      features: "",
      subcategories: []
    });
    setIsCategoryEditing(true);
  };

  const startEditCategory = (cat: any) => {
    setEditingCategory({
      ...cat,
      features: Array.isArray(cat.features) ? cat.features.join(", ") : cat.features || ""
    });
    setIsCategoryEditing(true);
  };

  const handleAddSubcategory = () => {
    if (!editingCategory) return;
    const newSub = {
      name: "",
      desc: "",
      image: "",
      thickness: "",
      warranty: "",
      specification: ""
    };
    setEditingCategory((prev: any) => ({
      ...prev,
      subcategories: [...(prev.subcategories || []), newSub]
    }));
  };

  const handleRemoveSubcategory = (index: number) => {
    if (!editingCategory) return;
    setEditingCategory((prev: any) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubcategoryChange = (index: number, field: string, value: string) => {
    if (!editingCategory) return;
    setEditingCategory((prev: any) => {
      const subs = [...(prev.subcategories || [])];
      subs[index] = { ...subs[index], [field]: value };
      return { ...prev, subcategories: subs };
    });
  };

  const handleSaveCategory = async () => {
    if (!editingCategory?.name) {
      toast.error("Category name is required.");
      return;
    }
    if (!editingCategory.description) {
      toast.error("Category description is required.");
      return;
    }
    if (!editingCategory.image) {
      toast.error("Category image is required.");
      return;
    }

    const payload = {
      ...editingCategory,
      features: typeof editingCategory.features === "string"
        ? editingCategory.features.split(",").map((f: string) => f.trim()).filter(Boolean)
        : editingCategory.features || []
    };

    const res = await saveServiceCategory(payload);
    if (res.success) {
      toast.success(res.message || "Category saved successfully!");
      setIsCategoryEditing(false);
      setEditingCategory(null);
      loadCategories();
    } else {
      toast.error(res.message || "Failed to save category.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This will delete all its subcategories and cannot be undone.")) {
      return;
    }
    const res = await deleteServiceCategory(id);
    if (res.success) {
      toast.success(res.message || "Category deleted successfully!");
      loadCategories();
    } else {
      toast.error(res.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg">
        {isCategoryEditing ? (
          // EDITING/CREATION STATE
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingCategory._id ? "Edit Service Category" : "Create New Service Category"}
              </h3>
              <Button
                type="button"
                onClick={() => {
                  setIsCategoryEditing(false);
                  setEditingCategory(null);
                }}
                className="bg-red-950/40 hover:bg-red-950 text-red-400 border border-red-900 rounded-none px-4 py-1.5 text-xs flex items-center space-x-1.5"
              >
                <X className="w-3.5 h-3.5" /> <span>Cancel</span>
              </Button>
            </div>

            {/* Category Fields */}
            <div className="space-y-4 bg-slate-950 p-6 border border-slate-800 rounded-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Name *</label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory((prev: any) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. Waterproofing Systems"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">URL Slug (leave empty to auto-generate)</label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory((prev: any) => ({ ...prev, slug: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="e.g. waterproofing"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category Main Image *</label>
                <div className="flex items-center space-x-4">
                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-none px-5 py-2.5 text-xs font-semibold cursor-pointer flex items-center space-x-2">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage === "cat" ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage === "cat"}
                      onChange={(e) => handleImageUpload(e, "cat")}
                    />
                  </label>
                  {editingCategory.image && (
                    <span className="text-xs text-slate-400 italic truncate max-w-xs">{editingCategory.image.split("/").pop()}</span>
                  )}
                </div>
                {editingCategory.image && (
                  <div className="relative w-20 h-20 border border-slate-800 mt-2 rounded-none overflow-hidden bg-slate-900">
                    <Image src={editingCategory.image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description *</label>
                <textarea
                  rows={3}
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Enter a brief premium description of the services category..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Features (comma separated)</label>
                <input
                  type="text"
                  value={editingCategory.features}
                  onChange={(e) => setEditingCategory((prev: any) => ({ ...prev, features: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-none px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder="e.g. Roof & Slab Waterproofing, Bathroom Treatment, 10-Year Warranty"
                />
              </div>
            </div>

            {/* Subcategories Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-serif text-base font-bold text-white">Subcategories & Services</h4>
              <Button
                type="button"
                onClick={handleAddSubcategory}
                className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-none px-4 py-1.5 text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" /> <span>Add Subcategory</span>
              </Button>
            </div>

            {/* Subcategories list */}
            <div className="space-y-4">
              {(!editingCategory.subcategories || editingCategory.subcategories.length === 0) ? (
                <p className="text-xs text-slate-500 italic py-2">No subcategories added yet. Click 'Add Subcategory' to populate.</p>
              ) : (
                editingCategory.subcategories.map((sub: any, subIdx: number) => (
                  <div key={subIdx} className="bg-slate-950 p-4 border border-slate-800 rounded-none space-y-3 relative animate-fade-in">
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(subIdx)}
                      className="absolute right-4 top-4 text-red-500 hover:text-red-400 p-1"
                      title="Remove subcategory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="font-bold text-xs text-accent uppercase tracking-wider">
                      Subcategory #{subIdx + 1}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Subcategory Name *</label>
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleSubcategoryChange(subIdx, "name", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="e.g. Roof & Slab Waterproofing"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Subcategory Image *</label>
                        <div className="flex items-center space-x-2">
                          <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-none px-3 py-2 text-[10px] font-semibold cursor-pointer flex items-center space-x-1">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{uploadingImage === `sub-${subIdx}` ? "Uploading..." : "Upload File"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingImage === `sub-${subIdx}`}
                              onChange={(e) => handleImageUpload(e, subIdx)}
                            />
                          </label>
                          {sub.image && (
                            <span className="text-[10px] text-slate-400 italic truncate max-w-[120px]">{sub.image.split("/").pop()}</span>
                          )}
                        </div>
                        {sub.image && (
                          <div className="relative w-12 h-12 border border-slate-800 mt-1 rounded-none overflow-hidden bg-slate-900">
                            <Image src={sub.image} alt="Preview" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Subcategory Description *</label>
                      <textarea
                        rows={2}
                        value={sub.desc}
                        onChange={(e) => handleSubcategoryChange(subIdx, "desc", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="Complete service treatment details..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Thickness (Flooring)</label>
                        <input
                          type="text"
                          value={sub.thickness || ""}
                          onChange={(e) => handleSubcategoryChange(subIdx, "thickness", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="e.g. 5mm to 12mm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Warranty (e.g. 10 Years)</label>
                        <input
                          type="text"
                          value={sub.warranty || ""}
                          onChange={(e) => handleSubcategoryChange(subIdx, "warranty", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="e.g. 10 Years warranty"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Specification (PVC)</label>
                        <input
                          type="text"
                          value={sub.specification || ""}
                          onChange={(e) => handleSubcategoryChange(subIdx, "specification", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent"
                          placeholder="e.g. Commercial Grade"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Save Category */}
            <div className="pt-4 border-t border-slate-800 text-right">
              <Button
                type="button"
                onClick={handleSaveCategory}
                className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-none px-8 py-3 text-sm flex items-center space-x-2 ml-auto"
              >
                <Save className="w-4 h-4" /> <span>Save Category Configurations</span>
              </Button>
            </div>
          </div>
        ) : (
          // LIST STATE
          <div className="space-y-4">
            {/* Header — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-accent shrink-0" />
                  Service Categories &amp; Subcategories
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Configure public service cards and subcategories dynamically.</p>
              </div>
              <Button
                type="button"
                onClick={startNewCategory}
                className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-none px-4 py-2 text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add New Category
              </Button>
            </div>

            {isLoadingCats ? (
              <div className="flex justify-center py-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mr-3 text-accent" />
                <span>Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-slate-500 italic">
                No categories found. Click &apos;Add New Category&apos; to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-slate-950 border border-slate-800 rounded-none overflow-hidden"
                  >
                    {/* Card top: image + info */}
                    <div className="flex gap-4 p-4">
                      {cat.image ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 border border-slate-800 rounded-none overflow-hidden bg-slate-900 shrink-0">
                          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border border-slate-800 rounded-none bg-slate-900 flex items-center justify-center shrink-0">
                          <FileImage className="w-7 h-7 text-slate-600" />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-white truncate">{cat.name}</h4>
                        <div className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md inline-block font-mono">
                          /{cat.slug}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mt-1">
                          {cat.description}
                        </p>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1">
                            {cat.subcategories.map((s: any) => (
                              <span key={s.name} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                {s.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card actions: always full-width at bottom */}
                    <div className="border-t border-slate-800 flex">
                      <Button
                        type="button"
                        onClick={() => startEditCategory(cat)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-none py-2 text-xs flex items-center justify-center gap-1.5 border-r border-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Category
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="flex-1 bg-red-950/20 hover:bg-red-950 text-red-500 rounded-none py-2 text-xs flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
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
