import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  clientName: string;
  serviceReceived: "Waterproofing" | "Wooden Flooring" | "PVC (Polyvinyl Chloride)" | "General";
  rating: number; // 1 to 5
  feedbackText: string;
  avatar?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true },
    serviceReceived: {
      type: String,
      enum: ["Waterproofing", "Wooden Flooring", "PVC (Polyvinyl Chloride)", "General"],
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedbackText: { type: String, required: true },
    avatar: { type: String },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
