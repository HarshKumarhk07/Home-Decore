import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  status: "Draft" | "Published" | "Archived";
  tags?: string[];
  coverImage: {
    url?: string;
    altText?: string;
  } | string;
  content: string;
  seoMeta?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  readTimeMinutes?: number;
  author?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, maxlength: 160, trim: true },
    category: { type: String, default: "General" },
    status: { type: String, enum: ["Draft", "Published", "Archived"], default: "Draft" },
    tags: [{ type: String, trim: true }],
    coverImage: {
      type: Schema.Types.Mixed,
      required: true,
    },
    content: { type: String, required: true },
    seoMeta: {
      metaTitle: { type: String, maxlength: 60, trim: true },
      metaDescription: { type: String, maxlength: 160, trim: true },
      metaKeywords: [{ type: String, trim: true }]
    },
    readTimeMinutes: { type: Number },
    author: { type: String, default: "Homes Decorator Team" },
  },
  { timestamps: true }
);

// Pre-save hook: auto-generate slug if empty, and calculate readTimeMinutes
BlogPostSchema.pre("save", function (next: any) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  
  if (this.content) {
    const words = this.content.trim().split(/\s+/).filter(Boolean).length;
    this.readTimeMinutes = Math.max(1, Math.ceil(words / 200));
  } else {
    this.readTimeMinutes = 1;
  }
  
  next();
});

const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
