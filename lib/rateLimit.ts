import { headers } from "next/headers";
import { connectToDatabase } from "./mongodb";
import mongoose, { Schema, Document, Model } from "mongoose";

interface IRateLimit extends Document {
  ip: string;
  action: string;
  timestamps: Date[];
}

const RateLimitSchema = new Schema<IRateLimit>({
  ip: { type: String, required: true },
  action: { type: String, required: true },
  timestamps: { type: [Date], default: [] },
});

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit || mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

/**
 * Checks if the request exceeds the rate limit.
 * @param action Name of the action being rate limited
 * @param limit Maximum number of requests allowed in the time window
 * @param windowMs Time window in milliseconds
 * @returns Object indicating success and remaining requests
 */
export async function checkRateLimit(
  action: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  try {
    const headersList = await headers();
    const xForwardedFor = headersList.get("x-forwarded-for");
    const ip = xForwardedFor
      ? xForwardedFor.split(",")[0].trim()
      : headersList.get("x-real-ip") || "127.0.0.1";

    await connectToDatabase();

    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    // Find or create rate limit record
    let record = await RateLimit.findOne({ ip, action });
    if (!record) {
      record = new RateLimit({ ip, action, timestamps: [] });
    }

    // Filter out old timestamps
    record.timestamps = record.timestamps.filter((ts) => ts >= windowStart);

    if (record.timestamps.length >= limit) {
      return { success: false, remaining: 0 };
    }

    // Add current timestamp
    record.timestamps.push(now);
    await record.save();

    return { success: true, remaining: limit - record.timestamps.length };
  } catch (error) {
    console.error("Rate limit check failed, defaulting to allow:", error);
    return { success: true, remaining: 1 };
  }
}
