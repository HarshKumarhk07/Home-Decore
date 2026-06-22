"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Layers, Paintbrush, Hammer, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface GalleryClientProps {
  initialItems: any[];
}

export default function GalleryClient({ initialItems }: GalleryClientProps) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems =
    filter === "all"
      ? initialItems
      : initialItems.filter((item) => item.category === filter);

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
                className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm aspect-4/3 cursor-pointer"
                onClick={() => setSelectedImage(item.imageUrl)}
              >
                {/* Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
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
        <DialogContent className="max-w-4xl p-1 bg-transparent border-none outline-none shadow-none flex items-center justify-center">
          {selectedImage && (
            <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden">
              <DialogTitle className="sr-only">Zoomed image</DialogTitle>
              <Image
                src={selectedImage}
                alt="Zoomed Site Work Preview"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
