"use client";

import { useState } from "react";
import { ChevronDown, Grid, Layers, Paintbrush, Hammer, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FaqClientProps {
  initialFaqs: any[];
}

export default function FaqClient({ initialFaqs }: FaqClientProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredFaqs =
    activeTab === "all"
      ? initialFaqs
      : initialFaqs.filter((faq) => faq.category === activeTab);

  const tabs = [
    { id: "all", label: "All Questions", icon: <Grid className="w-4 h-4" /> },
    { id: "general", label: "General", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "waterproofing", label: "Waterproofing", icon: <Layers className="w-4 h-4" /> },
    { id: "wooden-flooring", label: "Wooden Flooring", icon: <Hammer className="w-4 h-4" /> },
    { id: "pvc", label: "PVC (Polyvinyl Chloride)", icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Browse through common questions about our technical materials, written guarantees, work durations, and preparation steps.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveFaq(null);
                }}
                variant={isActive ? "default" : "outline"}
                className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition-all duration-300 ${
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

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isSelected = activeFaq === idx;
            return (
              <div
                key={faq._id || idx}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-350"
              >
                <button
                  suppressHydrationWarning
                  onClick={() => setActiveFaq(isSelected ? null : idx)}
                  className="flex items-center justify-between w-full p-5 text-left font-serif font-bold text-primary hover:bg-slate-50 transition-colors text-sm sm:text-base"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
                      isSelected ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-350 overflow-hidden ${
                    isSelected ? "max-h-96 border-t border-slate-100" : "max-h-0"
                  }`}
                >
                  <div className="p-5 text-slate-650 text-xs sm:text-sm leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl mt-10">
            <p className="text-slate-500 font-medium">No questions found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
