import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  AUTH_SECRET: z.string().min(8, "AUTH_SECRET must be at least 8 characters"),
  BREVO_API_KEY: z.string().min(1, "BREVO_API_KEY is required"),
  MAIL_FROM: z.string().email("MAIL_FROM must be a valid email"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
});

const processEnv = {
  MONGODB_URI: process.env.MONGODB_URI,
  AUTH_SECRET: process.env.AUTH_SECRET,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error("❌ Invalid environment variables configuration:");
  const fieldErrors = parsed.error.flatten().fieldErrors;
  Object.entries(fieldErrors).forEach(([key, errors]) => {
    console.error(`  - ${key}: ${errors?.join(", ")}`);
  });
  throw new Error("Missing or invalid environment variables. Check logs above.");
}

export const env = parsed.data;
