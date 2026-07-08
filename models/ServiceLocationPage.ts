import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServiceLocationPage extends Document {
  service: string;
  serviceSlug: string;
  location: string;
  locationSlug: string;
  h1Heading: string;
  bodyContent: string;
  images: { url: string; altText: string }[];
  seoMeta: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
  };
  sourceNotes?: string;
  status: "Draft" | "Published";
  createdAt: Date;
  updatedAt: Date;
}

const ServiceLocationPageSchema = new Schema<IServiceLocationPage>(
  {
    service: { type: String, required: true },
    serviceSlug: { type: String, required: true },
    location: { type: String, required: true },
    locationSlug: { type: String, required: true },
    h1Heading: { type: String, required: true },
    bodyContent: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, required: true },
      },
    ],
    seoMeta: {
      metaTitle: { type: String, maxlength: 60, required: true },
      metaDescription: { type: String, maxlength: 160, required: true },
      metaKeywords: { type: [String], default: [] },
    },
    sourceNotes: { type: String },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
  },
  { timestamps: true }
);

// Compound unique index on (serviceSlug, locationSlug)
ServiceLocationPageSchema.index({ serviceSlug: 1, locationSlug: 1 }, { unique: true });

const ServiceLocationPage: Model<IServiceLocationPage> =
  mongoose.models.ServiceLocationPage ||
  mongoose.model<IServiceLocationPage>("ServiceLocationPage", ServiceLocationPageSchema);

export default ServiceLocationPage;
