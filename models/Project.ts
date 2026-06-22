import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: "waterproofing" | "wooden-flooring" | "pvc";
  location: string;
  completionDate: Date;
  areaCovered: string; // e.g., "1,500 Sq Ft"
  materialsUsed: string[]; // e.g., ["Epoxy Grout", "Polyurethane Membrane"]
  duration: string; // e.g., "7 Days"
  warranty: string; // e.g., "5 Years"
  clientName?: string;
  images: string[]; // Portfolio images
  videos?: string[]; // YouTube embeds or video links
  beforeAfter?: {
    before: string; // Image URL
    after: string; // Image URL
  };
  description: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["waterproofing", "wooden-flooring", "pvc"],
      required: true,
    },
    location: { type: String, required: true },
    completionDate: { type: Date, required: true },
    areaCovered: { type: String, required: true },
    materialsUsed: [{ type: String }],
    duration: { type: String, required: true },
    warranty: { type: String, required: true },
    clientName: { type: String },
    images: [{ type: String, required: true }],
    videos: [{ type: String }],
    beforeAfter: {
      before: { type: String },
      after: { type: String },
    },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
