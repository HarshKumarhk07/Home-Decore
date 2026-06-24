import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubcategory {
  name: string;
  desc: string;
  image: string;
  thickness?: string;
  warranty?: string;
  specification?: string;
}

export interface IServiceCategory extends Document {
  name: string;
  slug: string;
  image: string;
  description: string;
  features: string[];
  subcategories: ISubcategory[];
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  thickness: { type: String, default: "" },
  warranty: { type: String, default: "" },
  specification: { type: String, default: "" },
});

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    subcategories: { type: [SubcategorySchema], default: [] },
  },
  { timestamps: true }
);

const ServiceCategory: Model<IServiceCategory> =
  mongoose.models.ServiceCategory ||
  mongoose.model<IServiceCategory>("ServiceCategory", ServiceCategorySchema);

export default ServiceCategory;
