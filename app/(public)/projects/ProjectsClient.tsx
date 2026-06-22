"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ShieldCheck, Grid, Layers, Paintbrush, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsClientProps {
  initialProjects: any[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredProjects =
    filter === "all"
      ? initialProjects
      : initialProjects.filter((p) => p.category === filter);

  const tabs = [
    { id: "all", label: "All Projects", icon: <Grid className="w-4 h-4" /> },
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
            Our Project Portfolio
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Inspect our portfolio of waterproofing, wood flooring installations, and PVC installations executed by our specialized engineering squads.
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

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <Link href={`/projects/${proj.slug}`} className="group flex flex-col h-full">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={proj.images[0]}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-dark px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow">
                      {proj.category.replace("-", " ")}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-bold text-primary group-hover:text-accent transition-colors duration-200 line-clamp-1">
                        {proj.title}
                      </h3>
                      <div className="flex items-center text-slate-500 text-xs space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proj.location}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-primary border-t border-slate-100 pt-4 mt-auto">
                      <span>Area: {proj.areaCovered}</span>
                      <span className="flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent mr-1 shrink-0" />
                        {proj.warranty.split(" ")[0]} Yrs Warranty
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl mt-10">
            <p className="text-slate-500 font-medium">No projects found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
