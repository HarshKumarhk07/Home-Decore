"use client";

import { useState, useTransition, useRef } from "react";
import { saveServiceLocationPage, removeServiceLocationPage } from "@/actions/cmsActions";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  X, 
  Calendar, 
  FileText, 
  PenLine, 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Quote, 
  RemoveFormatting,
  Search,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServicePagesClientProps {
  initialPages: any[];
}

const SERVICE_OPTIONS = [
  { value: "Terrace Waterproofing", label: "Terrace Waterproofing" },
  { value: "Bathroom & Washroom Waterproofing", label: "Bathroom & Washroom Waterproofing" },
  { value: "Basement Waterproofing", label: "Basement Waterproofing" },
  { value: "Wooden Flooring Installation", label: "Wooden Flooring Installation" },
  { value: "SPC / Vinyl Flooring", label: "SPC / Vinyl Flooring" },
  { value: "PVC Wall Panels & Cladding", label: "PVC Wall Panels & Cladding" },
];

const LOCATION_OPTIONS = [
  { value: "Gurugram", label: "Gurugram" },
  { value: "Delhi", label: "Delhi" },
  { value: "Noida", label: "Noida" },
  { value: "Faridabad", label: "Faridabad" },
  { value: "Rohtak", label: "Rohtak" },
  { value: "Bhiwani", label: "Bhiwani" },
];

export default function ServicePagesClient({ initialPages }: ServicePagesClientProps) {
  const [pages, setPages] = useState<any[]>(initialPages);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Editing state
  const [editingPage, setEditingPage] = useState<any | null>(null);

  // Form states
  const [service, setService] = useState("Terrace Waterproofing");
  const [location, setLocation] = useState("Gurugram");
  const [h1Heading, setH1Heading] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [sourceNotes, setSourceNotes] = useState("");
  const [status, setStatus] = useState("Draft");

  const insertMarkdown = (before: string, after: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;
    setBodyContent(text.substring(0, start) + replacement + text.substring(end));
    
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const clearForm = () => {
    setService("Terrace Waterproofing");
    setLocation("Gurugram");
    setH1Heading("");
    setBodyContent("");
    setImageUrl("");
    setImageAlt("");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setSourceNotes("");
    setStatus("Draft");
    setEditingPage(null);
  };

  const openNew = () => {
    clearForm();
    setIsOpen(true);
  };

  const openEdit = (page: any) => {
    setEditingPage(page);
    setService(page.service);
    setLocation(page.location);
    setH1Heading(page.h1Heading || "");
    setBodyContent(page.bodyContent || "");
    
    const primaryImg = page.images?.[0];
    setImageUrl(primaryImg?.url || "");
    setImageAlt(primaryImg?.altText || "");

    setMetaTitle(page.seoMeta?.metaTitle || "");
    setMetaDescription(page.seoMeta?.metaDescription || "");
    setMetaKeywords(Array.isArray(page.seoMeta?.metaKeywords) ? page.seoMeta.metaKeywords.join(", ") : "");
    setSourceNotes(page.sourceNotes || "");
    setStatus(page.status || "Draft");
    setIsOpen(true);
  };

  const handleSelectServiceOrLocation = (srv: string, loc: string) => {
    setService(srv);
    setLocation(loc);
    if (!editingPage) {
      setH1Heading(`${srv} in ${loc}`);
    }
  };

  const handleSubmit = (e: React.FormEvent, forcedStatus?: string) => {
    e.preventDefault();
    const finalStatus = forcedStatus || status;

    if (!h1Heading.trim()) {
      toast.error("H1 Heading is required.");
      return;
    }
    if (!bodyContent.trim()) {
      toast.error("Body Content is required.");
      return;
    }
    if (imageUrl.trim() && !imageAlt.trim()) {
      toast.error("Image Alt Text is required when an Image URL is provided.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          service,
          location,
          h1Heading: h1Heading.trim(),
          bodyContent: bodyContent.trim(),
          images: imageUrl.trim()
            ? [{ url: imageUrl.trim(), altText: imageAlt.trim() }]
            : [],
          seoMeta: {
            metaTitle: metaTitle.trim() || h1Heading.trim(),
            metaDescription: metaDescription.trim(),
            metaKeywords: metaKeywords.split(",").map(k => k.trim()).filter(Boolean),
          },
          sourceNotes: sourceNotes.trim(),
          status: finalStatus,
        };

        const res = await saveServiceLocationPage(payload, editingPage?._id);

        if (res.success) {
          toast.success(editingPage ? "SEO Landing Page updated!" : "SEO Landing Page created!");
          
          const updatedPage = res.page;
          if (editingPage) {
            setPages((prev) => prev.map((p) => p._id === editingPage._id ? updatedPage : p));
          } else {
            setPages((prev) => [updatedPage, ...prev]);
          }

          clearForm();
          setIsOpen(false);
        } else {
          toast.error(res.message || "Failed to save SEO landing page.");
        }
      } catch (error) {
        toast.error("An error occurred during submission.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this SEO landing page?")) return;
    startTransition(async () => {
      const res = await removeServiceLocationPage(id);
      if (res.success) {
        toast.success("SEO landing page deleted!");
        setPages((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(res.message || "Failed to delete page.");
      }
    });
  };

  // Filter pages
  const filteredPages = pages.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.service.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.h1Heading.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">SEO Service Landing Pages</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage localized service pages and meta keywords for local search listings</p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Landing Page
        </Button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-850 p-4 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by service, location, or heading..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
          Total Drafts: {pages.filter(p => p.status === "Draft").length} | Published: {pages.filter(p => p.status === "Published").length}
        </div>
      </div>

      {/* Form Slide-over panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); clearForm(); }}
          />
          <div className="relative z-10 w-full sm:w-[760px] h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <Globe className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingPage ? "Edit Landing Page" : "Add Localized Landing Page"}
                  </h2>
                  <p className="text-[10px] text-slate-450 uppercase tracking-wider">
                    Create dynamic SEO entry routes for search engines
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsOpen(false); clearForm(); }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Body Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form id="service-page-form" onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                
                {/* 1. Service & Location Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service</label>
                    <select
                      value={service}
                      onChange={(e) => handleSelectServiceOrLocation(e.target.value, location)}
                      disabled={!!editingPage}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent transition"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                    <select
                      value={location}
                      onChange={(e) => handleSelectServiceOrLocation(service, e.target.value)}
                      disabled={!!editingPage}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent transition"
                    >
                      {LOCATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Heading & Status */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      H1 Heading <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Terrace Waterproofing Services in Gurugram"
                      value={h1Heading}
                      onChange={(e) => setH1Heading(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent transition"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                {/* 3. Image URL & Alt */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-800 pb-1">
                    Image Configuration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image URL</label>
                      <input
                        type="text"
                        placeholder="/waterproofing.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Alt Text</label>
                      <input
                        type="text"
                        placeholder="Descriptive alt text for image..."
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Fact-check notes (internal) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    Fact-check notes (internal only, not published)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specify which subcategory, specifications, and warranty numbers from database were referenced..."
                    value={sourceNotes}
                    onChange={(e) => setSourceNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/20 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-amber-500 transition resize-none font-mono"
                  />
                </div>

                {/* 5. SEO META section */}
                <div className="bg-slate-950/40 p-5 border border-slate-800 rounded-2xl relative space-y-4">
                  <div className="absolute top-3 right-3 text-[8px] font-bold tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    SEO META
                  </div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Metadata Configuration
                  </h4>

                  {/* Meta Title */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Meta Title
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Meta Title {metaTitle.length}/60
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="defaults to H1 Heading if blank"
                      value={metaTitle}
                      onChange={(e) => {
                        if (e.target.value.length <= 60) {
                          setMetaTitle(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                    />
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Meta Description
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Meta Description {metaDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="A short description summarizing the location service..."
                      value={metaDescription}
                      onChange={(e) => {
                        if (e.target.value.length <= 160) {
                          setMetaDescription(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition resize-none"
                    />
                  </div>

                  {/* Meta Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Meta Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="waterproofing gurugram, roof leakage delhi"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                    />
                  </div>
                </div>

                {/* 6. Body Content */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-800 pb-1">
                    Landing Page Content
                  </h3>
                  
                  {/* Markdown Helpers */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-950 border border-slate-800 p-2 rounded-t-xl shrink-0">
                    <button
                      type="button"
                      onClick={() => insertMarkdown("**", "**")}
                      title="Bold"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("*", "*")}
                      title="Italic"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("## ")}
                      title="Heading 2"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition font-mono font-bold"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("### ")}
                      title="Heading 3"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition font-mono font-bold"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("- ")}
                      title="Bullet List"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("1. ")}
                      title="Numbered List"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("[", "](url)")}
                      title="Link"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("![alt](", ")")}
                      title="Image"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("> ")}
                      title="Blockquote"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-850 mx-1" />
                    <button
                      type="button"
                      onClick={() => {
                        const el = textareaRef.current;
                        if (!el) return;
                        const start = el.selectionStart;
                        const end = el.selectionEnd;
                        const text = el.value;
                        const selected = text.substring(start, end);
                        const stripped = selected.replace(/[\*\#_>!\[\]\(\)]/g, "");
                        setBodyContent(text.substring(0, start) + stripped + text.substring(end));
                      }}
                      title="Clear Formatting"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <RemoveFormatting className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Textarea */}
                  <textarea
                    ref={textareaRef}
                    rows={12}
                    placeholder={"### Describe the local service offerings...\n\nUse verified facts regarding materials and warranties."}
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 border-t-0 rounded-b-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent font-mono transition resize-y"
                  />
                </div>
              </form>
            </div>

            {/* Slide Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex gap-3 items-center shrink-0">
              <button
                type="button"
                onClick={() => { setIsOpen(false); clearForm(); }}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              
              <div className="flex-1" />
              
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "Draft")}
                disabled={isPending}
                variant="outline"
                className="border-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
              >
                Save Draft
              </Button>

              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "Published")}
                disabled={isPending}
                className="bg-accent hover:bg-accent-hover text-dark font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                ) : (
                  <>Publish Page</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pages table list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {filteredPages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <FileText className="w-10 h-10 mb-2.5 text-slate-650" />
            <p className="text-white font-bold text-sm">No landing pages match query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">H1 Heading</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filteredPages.map((page) => (
                  <tr key={page._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                      {page.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {page.location}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-mono text-xs">
                      {page.h1Heading}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap ${
                        page.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {page.status || "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          onClick={() => openEdit(page)}
                          size="icon"
                          variant="ghost"
                          className="text-accent hover:bg-accent/10 border border-transparent rounded-xl cursor-pointer"
                        >
                          <PenLine className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(page._id)}
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 border border-transparent rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
