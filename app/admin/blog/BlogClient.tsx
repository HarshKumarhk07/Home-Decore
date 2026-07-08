"use client";

import { useState, useTransition, useRef } from "react";
import { saveBlogPost, removeBlogPost, uploadImageAction } from "@/actions/cmsActions";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  UploadCloud, 
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
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogClientProps {
  initialPosts: any[];
}

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "waterproofing", label: "Waterproofing" },
  { value: "wooden-flooring", label: "Wooden Flooring" },
  { value: "pvc", label: "PVC & Cladding" },
  { value: "home-renovation", label: "Home Renovation" },
  { value: "tips-guides", label: "Tips & Guides" },
];

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Editing state
  const [editingPost, setEditingPost] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("general");
  const [status, setStatus] = useState("Draft");
  const [tags, setTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Live Read Time Calculation
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const estReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        // Bind URL display to preview or update later on submit
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      // In New mode, auto-generate slug
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;
    setContent(text.substring(0, start) + replacement + text.substring(end));
    
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const clearForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setCategory("general");
    setStatus("Draft");
    setTags("");
    setCoverImageUrl("");
    setCoverImageAlt("");
    setContent("");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setImageFile(null);
    setPreviewUrl(null);
    setEditingPost(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openNew = () => {
    clearForm();
    setIsOpen(true);
  };

  const openEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title || "");
    setSlug(post.slug || "");
    setExcerpt(post.excerpt || "");
    setCategory(post.category || "general");
    setStatus(post.status || "Draft");
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    
    if (typeof post.coverImage === "string") {
      setCoverImageUrl(post.coverImage);
      setCoverImageAlt("");
    } else {
      setCoverImageUrl(post.coverImage?.url || "");
      setCoverImageAlt(post.coverImage?.altText || "");
    }
    
    setContent(post.content || "");
    setMetaTitle(post.seoMeta?.metaTitle || "");
    setMetaDescription(post.seoMeta?.metaDescription || "");
    setMetaKeywords(Array.isArray(post.seoMeta?.metaKeywords) ? post.seoMeta.metaKeywords.join(", ") : "");
    
    setPreviewUrl(null);
    setImageFile(null);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent, forcedStatus?: string) => {
    e.preventDefault();
    const finalStatus = forcedStatus || status;

    if (!title.trim()) {
      toast.error("Please fill in the article title.");
      return;
    }
    if (!content.trim()) {
      toast.error("Please write content for the article.");
      return;
    }
    if ((imageFile || coverImageUrl.trim()) && !coverImageAlt.trim()) {
      toast.error("Alt text is required when a cover image is specified.");
      return;
    }

    startTransition(async () => {
      try {
        let finalCoverImageUrl = coverImageUrl.trim();
        
        // Upload image file if selected
        if (imageFile) {
          const uploadForm = new FormData();
          uploadForm.append("file", imageFile);
          const uploadRes = await uploadImageAction(uploadForm);

          if (!uploadRes.success || !uploadRes.url) {
            toast.error(uploadRes.message || "Failed to upload cover image.");
            return;
          }
          finalCoverImageUrl = uploadRes.url;
        }

        const payload = {
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          category,
          status: finalStatus,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          coverImage: {
            url: finalCoverImageUrl,
            altText: coverImageAlt.trim(),
          },
          content,
          seoMeta: {
            metaTitle: metaTitle.trim(),
            metaDescription: metaDescription.trim(),
            metaKeywords: metaKeywords.split(",").map(k => k.trim()).filter(Boolean),
          },
        };

        const res = await saveBlogPost(payload, editingPost ? editingPost.slug : undefined);
        
        if (res.success) {
          toast.success(editingPost ? "Blog article updated!" : "Blog article created!");
          
          const updatedPost = res.post;
          if (editingPost) {
            setPosts((prev) => prev.map((p) => p.slug === editingPost.slug ? updatedPost : p));
          } else {
            setPosts((prev) => [updatedPost, ...prev]);
          }

          clearForm();
          setIsOpen(false);
        } else {
          if (res.status === 409) {
            toast.error("Conflict: Slug already exists. Please choose a unique slug.");
          } else {
            toast.error(res.message || "Failed to save blog article.");
          }
        }
      } catch (error) {
        toast.error("An error occurred during submission.");
      }
    });
  };

  const handleDelete = (postSlug: string) => {
    if (!confirm("Are you sure you want to permanently delete this blog post?")) return;
    startTransition(async () => {
      const res = await removeBlogPost(postSlug);
      if (res.success) {
        toast.success("Blog post deleted!");
        setPosts((prev) => prev.filter((p) => p.slug !== postSlug));
      } else {
        toast.error(res.message || "Failed to delete article.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">SEO Blog Articles</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage rich text content and custom SEO properties for public pages</p>
        </div>
        <Button
          onClick={openNew}
          className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </Button>
      </div>

      {/* Editor slide-over panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); clearForm(); }}
          />
          <div className="relative z-10 w-full sm:w-[760px] h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden">
            
            {/* Slide Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <PenLine className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {editingPost ? "Edit Article" : "Write New Article"}
                  </h2>
                  <p className="text-[10px] text-slate-450 uppercase tracking-wider">
                    Est. read time: {estReadTime} min
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

            {/* Slide Content Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form id="blog-form" onSubmit={(e) => handleSubmit(e)} className="space-y-5">
                
                {/* Section 1 — Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-800 pb-1">
                    Basic Info
                  </h3>
                  
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Best Terrace Waterproofing in Bhiwani"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Slug <span className="text-red-400">*</span>{" "}
                        <span className="text-[10px] text-slate-500 font-normal lowercase">
                          {!editingPost ? "(auto-generated — click to edit)" : ""}
                        </span>
                      </label>
                      {editingPost && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold" title="Changing the slug will break existing links to this post.">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Slug warning</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="best-terrace-waterproofing-bhiwani"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]+/g, "-"))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition font-mono"
                    />
                    {editingPost && (
                      <p className="text-[10px] text-slate-450 italic mt-0.5">
                        Warning: Changing the slug will break existing links to this post.
                      </p>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Excerpt (Summary)
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Excerpt {excerpt.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Provide a short, punchy summary of this article..."
                      value={excerpt}
                      onChange={(e) => {
                        if (e.target.value.length <= 160) {
                          setExcerpt(e.target.value);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition resize-none"
                    />
                  </div>
                </div>

                {/* Section 2 — Category & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent transition"
                    >
                      {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Section 3 — Tags & Cover Image */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-800 pb-1">
                    Taxonomy & Assets
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Tags */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="waterproofing, terrace, haryana"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                      />
                    </div>

                    {/* Cover Image Upload & Input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Cover Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste image URL or upload..."
                          value={coverImageUrl}
                          onChange={(e) => setCoverImageUrl(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3 rounded-xl border border-slate-700 transition"
                        >
                          Upload
                        </button>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>
                  </div>

                  {/* Upload Preview & Alt text */}
                  {(previewUrl || coverImageUrl.trim()) && (
                    <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="relative w-28 h-16 rounded-lg overflow-hidden border border-slate-800 shrink-0">
                          <img 
                            src={previewUrl || coverImageUrl} 
                            alt="Cover preview" 
                            className="w-full h-full object-cover" 
                          />
                          {previewUrl && (
                            <button
                              type="button"
                              onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Cover Image Alt Text <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Descriptive text of the cover image..."
                            value={coverImageAlt}
                            onChange={(e) => setCoverImageAlt(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 4 — SEO META (Visual Box) */}
                <div className="bg-slate-950/40 p-5 border border-slate-800/80 rounded-2xl relative space-y-4">
                  <div className="absolute top-3 right-3 text-[8px] font-bold tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    SEO META
                  </div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Search Engine Optimization
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
                      placeholder="defaults to Post Title if blank"
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
                      placeholder="defaults to Excerpt if blank"
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
                      placeholder="waterproofing, flooring, bhiwani"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-accent transition"
                    />
                  </div>
                </div>

                {/* Section 5 — Content */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-wider border-b border-slate-800 pb-1">
                    Article Content
                  </h3>
                  
                  {/* Markdown Helper Toolbar */}
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
                      onClick={() => insertMarkdown("![alt text](", ")")}
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
                        setContent(text.substring(0, start) + stripped + text.substring(end));
                      }}
                      title="Clear Markdown Formatting"
                      className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <RemoveFormatting className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Textarea */}
                  <textarea
                    ref={textareaRef}
                    rows={12}
                    placeholder={"### Use markdown headers\n\nWrite detailed paragraphs here...\n- Add bullet listings if required."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
              
              {/* Save Draft */}
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "Draft")}
                disabled={isPending}
                variant="outline"
                className="border-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
              >
                Save Draft
              </Button>

              {/* Publish */}
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, "Published")}
                disabled={isPending}
                className="bg-accent hover:bg-accent-hover text-dark font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                ) : (
                  <>Publish Post</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
          <div className="p-4 bg-slate-800/60 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-500" />
          </div>
          <div>
            <p className="text-white font-semibold">No articles published yet</p>
            <p className="text-slate-500 text-sm mt-1">Click &ldquo;Write Article&rdquo; to publish your first blog post.</p>
          </div>
          <Button
            onClick={openNew}
            className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" /> Write First Article
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Cover</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                  {posts.map((post) => {
                    const coverUrl = typeof post.coverImage === "string" 
                      ? post.coverImage 
                      : (post.coverImage?.url || "");
                    
                    return (
                      <tr key={post.slug} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-slate-800 shadow-sm">
                            {coverUrl ? (
                              <img src={coverUrl} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-650">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-white max-w-xs">
                          <span className="line-clamp-2">{post.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5 truncate">
                            /{post.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-750 whitespace-nowrap">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider whitespace-nowrap ${
                            post.status === "Published"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : post.status === "Archived"
                              ? "bg-slate-800 text-slate-450 border border-slate-700"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {post.status || "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              onClick={() => openEdit(post)}
                              size="icon"
                              variant="ghost"
                              className="text-accent hover:bg-accent/10 border border-transparent rounded-xl cursor-pointer"
                            >
                              <PenLine className="w-4 h-4" />
                            </Button>
                            {post.slug && (
                              <Button
                                onClick={() => handleDelete(post.slug)}
                                size="icon"
                                variant="ghost"
                                className="text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {posts.map((post) => {
              const coverUrl = typeof post.coverImage === "string" 
                ? post.coverImage 
                : (post.coverImage?.url || "");

              return (
                <div key={post.slug} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow flex flex-col p-4 space-y-3">
                  <div className="flex gap-4">
                    <div className="relative h-16 w-20 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                      {coverUrl ? (
                        <img src={coverUrl} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-950 flex items-center justify-center text-slate-650">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm line-clamp-2">{post.title}</p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5 truncate">
                        /{post.slug}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-850 pt-2 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-750">
                        {post.category}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded whitespace-nowrap ${
                        post.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : post.status === "Archived"
                          ? "bg-slate-800 text-slate-450 border border-slate-700"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {post.status || "Draft"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => openEdit(post)}
                        size="icon"
                        variant="ghost"
                        className="text-accent hover:bg-accent/10 border border-transparent rounded-xl cursor-pointer"
                      >
                        <PenLine className="w-4 h-4" />
                      </Button>
                      {post.slug && (
                        <Button
                          onClick={() => handleDelete(post.slug)}
                          size="icon"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10 border border-transparent rounded-xl cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
