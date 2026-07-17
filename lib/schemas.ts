import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  city: z.string().min(2, "Please enter your city"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const InspectionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.union([z.string().email("Please enter a valid email address"), z.literal("")]).optional(),
  city: z.string().min(2, "Please enter your city"),
  address: z.string().optional(),
  service: z.string().min(1, "Please select a valid service"),
  subService: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  remarks: z.string().optional(),
});

export const QuoteSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  city: z.string().min(2, "Please enter your city"),
  address: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  subService: z.string().optional(),
  propertyType: z.string().optional(),
  area: z.coerce.number().optional(),
  budget: z.coerce.number().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  message: z.string().optional(),
});
