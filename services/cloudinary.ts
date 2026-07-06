import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

// Configure Cloudinary SDK with validated credentials
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Streams a File object to Cloudinary using its upload_stream API.
 * This runs entirely in-memory and is optimized for serverless environments.
 * @param file The browser-submitted File object from a Server Action
 * @returns The secure URL of the uploaded image
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  try {
    console.log("🔄 Starting Cloudinary upload...", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Convert browser-provided file buffer to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "home-decorater-leads",
          resource_type: "auto",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload failure:", {
              errorMsg: error.message,
              errorCode: error.http_code,
              errorDetails: error,
            });
            reject(new Error(error.message || "Failed to upload image to Cloudinary."));
          } else if (result) {
            console.log("✅ Cloudinary upload success:", {
              publicId: result.public_id,
              secureUrl: result.secure_url,
            });
            resolve(result.secure_url);
          } else {
            console.error("❌ No result from Cloudinary");
            reject(new Error("Cloudinary did not return an upload result."));
          }
        }
      );

      // Handle stream errors
      uploadStream.on("error", (err) => {
        console.error("❌ Stream error:", err);
        reject(new Error("Upload stream error: " + err.message));
      });

      // Write the buffer to the write stream and close it
      uploadStream.end(buffer);
    });
  } catch (err: any) {
    console.error("❌ Error in uploadToCloudinary:", err);
    throw err;
  }
}
