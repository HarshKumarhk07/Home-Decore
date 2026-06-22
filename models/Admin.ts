import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  email: string;
  password?: string; // Optional because we might exclude it in queries
  role: "super_admin" | "manager" | "employee";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "manager", "employee"],
      default: "employee",
    },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating model on hot-reload
const Admin: Model<IAdmin> = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
