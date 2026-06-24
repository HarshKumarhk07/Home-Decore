"use client";

import { useState, useTransition, useRef } from "react";
import { saveBlogPost, removeBlogPost, uploadImageAction } from "@/actions/cmsActions";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, UploadCloud, X, Calendar, FileText, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogClientProps {
  initialPosts: any[];
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
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
    setCategory("general");
    setExcerpt("");
    setContent("");
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload a cover image.");
      return;
    }

    startTransition(async () => {
      try {
        // 1. Upload cover image to Cloudinary
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await uploadImageAction(uploadForm);

        if (!uploadRes.success || !uploadRes.url) {
          toast.error(uploadRes.message || "Failed to upload cover image.");
          return;
        }

        // 2. Save blog post record
        const payload = {
          title,
          category,
          excerpt,
          content,
          coverImage: uploadRes.url,
          tags: [category],
          publishedAt: new Date(),
        };

        const res = await saveBlogPost(payload);
        if (res.success) {
          toast.success("Blog article saved successfully!");
          
          setPosts((prev) => [
            { ...payload, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), createdAt: new Date().toISOString() },
            ...prev,
          ]);

          clearForm();
          setIsOpen(false);
        } else {
          toast.error(res.message || "Failed to save blog article.");
        }
      } catch (error) {
        toast.error("An error occurred during submission.");
      }
    });
  };

  const handleDelete = (slug: string) => {
    if (!confirm("Are you sure you want to permanently delete this blog post?")) return;
    startTransition(async () => {
      const res = await removeBlogPost(slug);
      if (res.success) {
        toast.success("Blog post deleted!");
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
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
          <p className="text-xs text-slate-400 mt-0.5">Manage technical content and guidelines displayed on public blog routes</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-5 py-2.5 text-sm flex items-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </Button>
      </div>

      {/* Write Article Slide-over Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); clearForm(); }}
          />
          <div className="relative z-10 w-full sm:w-[560px] h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl">
                  <PenLine className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Write New Article</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">SEO Blog Post</p>
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

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <form id="blog-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Article Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="How to spot roof moisture cracks..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent transition"
                    >
                      <option value="general">General</option>
                      <option value="waterproofing">Waterproofing</option>
                      <option value="wooden-flooring">Wooden Flooring</option>
                      <option value="pvc">PVC (Polyvinyl Chloride)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Article Excerpt (Teaser) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="A short, compelling summary shown on the blog listing..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Cover Image <span className="text-red-400">*</span>
                  </label>
                  {previewUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow">
                      <img src={previewUrl} alt="Upload Preview" className="w-full h-40 object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors shadow"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                        <p className="text-xs text-white font-medium truncate">{imageFile?.name}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-700 hover:border-accent/50 hover:bg-slate-800/30 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-all duration-200 cursor-pointer"
                    >
                      <UploadCloud className="w-8 h-8 text-accent/60" />
                      <span className="text-sm font-medium">Click to upload cover image</span>
                      <span className="text-[10px] text-slate-600">JPG, PNG, WEBP — Max 10MB</span>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Article Body (Markdown Supported) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={9}
                    placeholder={"### Use markdown headers\n\nWrite detailed paragraphs here...\n- Add bullet listings if required."}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent font-mono transition resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-800 shrink-0 bg-slate-900">
              <Button
                type="submit"
                form="blog-form"
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent-hover text-dark font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing article...</>
                ) : (
                  <><FileText className="w-4 h-4" /> Publish Article</>
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
            onClick={() => setIsOpen(true)}
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
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                  {posts.map((post) => (
                    <tr key={post.slug} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-slate-800 shadow-sm">
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-white max-w-xs">
                        <span className="line-clamp-2">{post.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 whitespace-nowrap">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {posts.map((post) => (
              <div key={post.slug} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow flex gap-4 p-4">
                <div className="relative h-20 w-24 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm line-clamp-2">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                {post.slug && (
                  <Button
                    onClick={() => handleDelete(post.slug)}
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/10 border border-transparent rounded-xl cursor-pointer shrink-0 self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
