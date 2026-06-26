import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  content: string; // Markdown or rich text
  category: "waterproofing" | "wooden-flooring" | "pvc" | "general";
  author: string;
  tags: string[];
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["waterproofing", "wooden-flooring", "pvc", "general"],
      required: true,
    },
    author: { type: String, default: "Homesdecorator Team" },
    tags: [{ type: String }],
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
