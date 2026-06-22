import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const InspectionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(10, "Please enter your complete site address"),
  service: z.enum(["Waterproofing", "Wooden Flooring", "PVC (Polyvinyl Chloride)"], {
    message: "Please select a valid service",
  }),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time slot"),
  remarks: z.string().optional(),
});

export const QuoteSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  city: z.string().min(2, "Please enter your city"),
  address: z.string().min(10, "Please enter your complete address"),
  service: z.enum(["Waterproofing", "Wooden Flooring", "PVC (Polyvinyl Chloride)"], {
    message: "Please select a service",
  }),
  propertyType: z.enum(["Residential", "Commercial", "Industrial"], {
    message: "Please select a property type",
  }),
  area: z.coerce.number().min(1, "Please enter a valid area in Sq Ft"),
  budget: z.coerce.number().min(1, "Please enter a valid budget amount"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time slot"),
  message: z.string().optional(),
});
