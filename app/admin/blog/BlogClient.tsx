"use client";

import { useState, useTransition, useRef } from "react";
import { saveBlogPost, removeBlogPost, uploadImageAction } from "@/actions/cmsActions";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, FileText, UploadCloud, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
      {/* Header action */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
        <div>
          <h3 className="font-serif text-lg font-bold text-white">SEO Blog Articles</h3>
          <p className="text-xs text-slate-400">Manage technical content and guidelines displayed on public blog routes</p>
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
              <span>Write Article</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8 max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg font-bold text-white">Write New Blog Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article Title</label>
                  <input
                    type="text"
                    placeholder="E.g., How to spot roof moisture cracks"
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
                    <option value="general">General</option>
                    <option value="waterproofing">Waterproofing</option>
                    <option value="wooden-flooring">Wooden Flooring</option>
                    <option value="pvc">PVC (Polyvinyl Chloride)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article Excerpt (Teaser)</label>
                <input
                  type="text"
                  placeholder="E.g., Learn about the primary causes of basement dampness and how to resolve them scientifically..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {/* Upload image */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cover Image</label>
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article Body Content (Markdown Supported)</label>
                <textarea
                  rows={6}
                  placeholder="### Use markdown headers&#10;&#10;Write detailed paragraph specifications here...&#10;- Add bullet listings if required."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent font-mono text-xs"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent-hover text-dark font-bold py-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Article"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
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
                  <td className="px-6 py-4 shrink-0">
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden border border-slate-800 shadow-sm">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    <div>
                      <span>{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-bold text-accent">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN")}
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

        {posts.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-medium bg-slate-900 border border-slate-800">
            No articles added. Click 'Write Article' to publish blog posts.
          </div>
        )}
      </div>
    </div>
  );
}
