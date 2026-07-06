"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Layers, Paintbrush, Hammer, ZoomIn, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { removeGalleryPhoto } from "@/actions/cmsActions";
import { toast } from "sonner";

interface GalleryClientProps {
  initialItems: any[];
  isAdmin?: boolean;
}

export default function GalleryClient({ initialItems, isAdmin = false }: GalleryClientProps) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  const handleDeleteImage = (id: string, title: string) => {
    if (!confirm(`Delete "${title}" from gallery?`)) return;

    startTransition(async () => {
      try {
        const res = await removeGalleryPhoto(id);
        if (res.success) {
          toast.success("Photo deleted successfully!");
          setItems((prev) => prev.filter((item) => item._id !== id));
        } else {
          toast.error(res.message || "Failed to delete photo");
        }
      } catch (error) {
        toast.error("An error occurred while deleting");
      }
    });
  };

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((item) => item.category === filter);

  const tabs = [
    { id: "all", label: "All Photos", icon: <Grid className="w-4 h-4" /> },
    { id: "waterproofing", label: "Waterproofing", icon: <Layers className="w-4 h-4" /> },
    { id: "wooden-flooring", label: "Wooden Flooring", icon: <Hammer className="w-4 h-4" /> },
    { id: "pvc", label: "PVC (Polyvinyl Chloride)", icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary">
            Site Work Gallery
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Inspect close-up photographs of our actual waterproofing chemical coats, wood joints, and interior texture completions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                variant={isActive ? "default" : "outline"}
                className={`rounded-full px-5 py-2 font-medium flex items-center space-x-2 transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id || idx}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm aspect-4/3"
              >
                {/* Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500 cursor-pointer"
                  sizes="(max-width: 768px) 100vw, 400px"
                  onClick={() => setSelectedImage(item.imageUrl)}
                />

                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  {/* Admin Delete Button */}
                  {isAdmin && item._id && (
                    <div className="flex justify-end">
                      <Button
                        onClick={() => handleDeleteImage(item._id, item.title)}
                        disabled={isPending}
                        size="icon"
                        className="bg-red-500/90 hover:bg-red-650 text-white rounded-lg h-8 w-8 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Bottom Details */}
                  <div
                    className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(item.imageUrl)}
                  >
                    <span className="text-[10px] bg-accent text-dark px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                      {item.category.replace("-", " ")}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center text-xs text-accent font-semibold pt-2">
                      <ZoomIn className="w-4 h-4 mr-1" /> Tap to zoom photo
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl mt-10">
            <p className="text-slate-500 font-medium">No gallery items found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[92vw] w-[92vw] h-[88vh] p-3 bg-black/95 outline-none shadow-2xl flex items-center justify-center ring-2 ring-white/50 rounded-2xl [&>[data-slot='dialog-close']]:bg-gray-900/90 [&>[data-slot='dialog-close']]:text-white [&>[data-slot='dialog-close']]:hover:bg-gray-800 [&>[data-slot='dialog-close']]:border [&>[data-slot='dialog-close']]:border-white/40 [&>[data-slot='dialog-close']]:z-50">
          {selectedImage && (
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <DialogTitle className="sr-only">Zoomed image</DialogTitle>
              <Image
                src={selectedImage}
                alt="Zoomed Site Work Preview"
                fill
                className="object-contain"
                sizes="92vw"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
