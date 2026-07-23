import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote {
  text: string;
  createdAt: Date;
  createdBy: string; // Admin username or ID
}

export interface ITimelineEvent {
  status: string;
  notes: string;
  updatedAt: Date;
  updatedBy: string; // Admin username or ID
}

export interface ILead extends Document {
  leadId: string; // HD-YYYY-XXXX format
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  service: string;
  propertyType?: string;
  area?: number; // in Sq Ft
  budget?: number;
  preferredDate?: Date;
  preferredTime?: string;
  message?: string;
  images: string[]; // Cloudinary URLs
  // Attribution — where the lead originated. Populated for SEO landing pages
  // so admins can see which service/city page generated each lead.
  source?: string; // Human label, e.g. "Waterproofing Gurgaon"
  sourceUrl?: string; // Full landing page URL the lead submitted from
  sourceSlug?: string; // Landing page slug, e.g. "waterproofing/gurgaon"
  status:
    | "New"
    | "Contacted"
    | "Inspection Scheduled"
    | "Quotation Sent"
    | "Negotiation"
    | "Confirmed"
    | "Work Started"
    | "Completed"
    | "Rejected";
  notes: INote[];
  assignedEmployee?: mongoose.Types.ObjectId; // References Admin
  timeline: ITimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
});

const TimelineEventSchema = new Schema<ITimelineEvent>({
  status: { type: String, required: true },
  notes: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
});

const LeadSchema = new Schema<ILead>(
  {
    leadId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    city: { type: String },
    address: { type: String },
    service: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["Residential", "Commercial", "Industrial"],
    },
    area: { type: Number },
    budget: { type: Number },
    preferredDate: { type: Date },
    preferredTime: { type: String },
    message: { type: String },
    images: [{ type: String }],
    source: { type: String, default: "Website" },
    sourceUrl: { type: String },
    sourceSlug: { type: String },
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Inspection Scheduled",
        "Quotation Sent",
        "Negotiation",
        "Confirmed",
        "Work Started",
        "Completed",
        "Rejected",
      ],
      default: "New",
    },
    notes: [NoteSchema],
    assignedEmployee: { type: Schema.Types.ObjectId, ref: "Admin" },
    timeline: [TimelineEventSchema],
  },
  { timestamps: true }
);

const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
