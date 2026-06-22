import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  imageUrl: string;
  category: "waterproofing" | "wooden-flooring" | "pvc";
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ["waterproofing", "wooden-flooring", "pvc"],
      required: true,
    },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
