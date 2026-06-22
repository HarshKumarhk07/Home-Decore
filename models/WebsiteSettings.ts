import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsiteSettings extends Document {
  companyName: string;
  logoUrl?: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  googleMapsEmbed?: string; // Embed HTML iframe src
  businessHours: string; // e.g. "Mon - Sat: 9:00 AM - 6:00 PM"
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  seoMetadata: {
    title: string;
    description: string;
    keywords: string; // comma-separated
  };
  faviconUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    companyName: { type: String, required: true, default: "Home Decorater" },
    logoUrl: { type: String },
    phoneNumber: { type: String, required: true, default: "+91 99999 99999" },
    whatsappNumber: { type: String, required: true, default: "+91 99999 99999" },
    email: { type: String, required: true, default: "info@homedecorater.in" },
    address: { type: String, required: true, default: "New Delhi, India" },
    googleMapsEmbed: { type: String },
    businessHours: { type: String, required: true, default: "Mon - Sat: 9:00 AM - 6:30 PM" },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    seoMetadata: {
      title: { type: String, required: true, default: "Home Decorater | Waterproofing, Wooden Flooring, PVC (Polyvinyl Chloride)" },
      description: { type: String, required: true, default: "Premium home improvement services including waterproofing, wooden flooring, and PVC wall panel cladding." },
      keywords: { type: String, default: "waterproofing, wooden flooring, pvc, home decorator" },
    },
    faviconUrl: { type: String },
  },
  { timestamps: true }
);

const WebsiteSettings: Model<IWebsiteSettings> =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettings>("WebsiteSettings", WebsiteSettingsSchema);

export default WebsiteSettings;
