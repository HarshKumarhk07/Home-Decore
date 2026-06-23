"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import WebsiteSettings from "@/models/WebsiteSettings";
import Project from "@/models/Project";
import Gallery from "@/models/Gallery";
import FAQ from "@/models/FAQ";
import BlogPost from "@/models/BlogPost";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/services/cloudinary";
import { sanitizeInput } from "@/lib/security";

// --------------------------------------------------------
// WEBSITE SETTINGS (Super Admin Only)
// --------------------------------------------------------

export async function getSettings() {
  try {
    await connectToDatabase();
    let settings = await WebsiteSettings.findOne().lean();
    if (!settings) {
      // Create default settings if empty
      settings = await WebsiteSettings.create({
        companyName: "Home Decorater",
        phoneNumber: "+91 99999 99999",
        whatsappNumber: "919999999999",
        email: "info@homedecorater.in",
        address: "Plot 42, Sector 62, Noida, UP, India",
        businessHours: "Mon - Sat: 9:00 AM - 6:30 PM",
        socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" },
        seoMetadata: { title: "Home Decorater", description: "Waterproofing and Flooring", keywords: "waterproofing" },
        waterproofingSubcategories: [
          "Roof & Slab Waterproofing",
          "Terrace Waterproofing",
          "Bathroom Seepage Waterproofing",
          "Basement & Retaining Wall Grouting",
          "Underground & Overhead Water Tanks"
        ],
        flooringSubcategories: [
          "SPC Click-Lock Flooring",
          "Premium Laminate Flooring",
          "Engineered Wood Flooring",
          "Luxury Vinyl Flooring (LVP)"
        ],
        pvcSubcategories: [
          "SPC Click-Lock Flooring",
          "Luxury Vinyl Planks (LVP) / Tiles (LVT)",
          "Roll & Sheet PVC Flooring",
          "Anti-Static (ESD) PVC Flooring",
          "PVC Wall Panels & Cladding"
        ],
      });
    }
    return {
      success: true,
      settings: {
        ...settings,
        _id: settings._id.toString(),
        createdAt: settings.createdAt?.toISOString() || null,
        updatedAt: settings.updatedAt?.toISOString() || null,
      },
    };
  } catch (error: any) {
    console.error("Error fetching website settings:", error);
    return { success: false, message: error.message || "Failed to load settings." };
  }
}

export async function updateWebsiteSettings(data: any) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Access Denied: Super Admin only.");
    }

    const sanitizedData = sanitizeInput(data);
    await connectToDatabase();
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings(sanitizedData);
    } else {
      Object.assign(settings, sanitizedData);
    }
    
    await settings.save();
    
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    
    return { success: true, message: "Website configurations saved successfully!" };
  } catch (error: any) {
    console.error("Error saving website settings:", error);
    return { success: false, message: error.message || "Failed to save settings." };
  }
}

// --------------------------------------------------------
// PROJECTS CRUD (Super Admin & Manager)
// --------------------------------------------------------

export async function saveProject(data: any, existingSlug?: string) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    const sanitizedData = sanitizeInput(data);
    await connectToDatabase();

    // Generate URL friendly slug from title
    const slug = sanitizedData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const projectData = { ...sanitizedData, slug };

    if (existingSlug) {
      await Project.findOneAndUpdate({ slug: existingSlug }, projectData);
    } else {
      await Project.create(projectData);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    revalidatePath("/");

    return { success: true, message: "Project saved successfully!" };
  } catch (error: any) {
    console.error("Error saving project:", error);
    return { success: false, message: error.message || "Failed to save project." };
  }
}

export async function removeProject(slug: string) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    await connectToDatabase();
    await Project.deleteOne({ slug });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, message: "Project deleted successfully!" };
  } catch (error: any) {
    console.error("Error removing project:", error);
    return { success: false, message: error.message || "Failed to delete project." };
  }
}

// --------------------------------------------------------
// GALLERY CRUD (Super Admin & Manager)
// --------------------------------------------------------

export async function addGalleryPhoto(data: { title: string; category: string; imageUrl: string }) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    const sanitizedData = sanitizeInput(data);
    await connectToDatabase();
    await Gallery.create(sanitizedData as any);

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: "Photo added to gallery!" };
  } catch (error: any) {
    console.error("Error adding gallery photo:", error);
    return { success: false, message: error.message || "Failed to add photo." };
  }
}

export async function removeGalleryPhoto(id: string) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    await connectToDatabase();
    await Gallery.findByIdAndDelete(id);

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true, message: "Photo deleted from gallery!" };
  } catch (error: any) {
    console.error("Error removing gallery photo:", error);
    return { success: false, message: error.message || "Failed to delete photo." };
  }
}

// --------------------------------------------------------
// FAQs CRUD (Super Admin & Manager)
// --------------------------------------------------------

export async function addFaq(data: { question: string; answer: string; category: string }) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    const sanitizedData = sanitizeInput(data);
    await connectToDatabase();
    await FAQ.create(sanitizedData as any);

    revalidatePath("/admin/faqs");
    revalidatePath("/faq");
    revalidatePath("/");

    return { success: true, message: "FAQ created successfully!" };
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return { success: false, message: error.message || "Failed to create FAQ." };
  }
}

export async function removeFaq(id: string) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    await connectToDatabase();
    await FAQ.findByIdAndDelete(id);

    revalidatePath("/admin/faqs");
    revalidatePath("/faq");
    revalidatePath("/");

    return { success: true, message: "FAQ deleted successfully!" };
  } catch (error: any) {
    console.error("Error removing FAQ:", error);
    return { success: false, message: error.message || "Failed to delete FAQ." };
  }
}

// --------------------------------------------------------
// BLOG CRUD (Super Admin & Manager)
// --------------------------------------------------------

export async function saveBlogPost(data: any, existingSlug?: string) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    const sanitizedData = sanitizeInput(data);
    await connectToDatabase();

    const slug = sanitizedData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const postData = { ...sanitizedData, slug, author: session.user.name || "Home Decorater Team" };

    if (existingSlug) {
      await BlogPost.findOneAndUpdate({ slug: existingSlug }, postData);
    } else {
      await BlogPost.create(postData);
    }

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/");

    return { success: true, message: "Blog article saved!" };
  } catch (error: any) {
    console.error("Error saving blog article:", error);
    return { success: false, message: error.message || "Failed to save article." };
  }
}

export async function removeBlogPost(slug: string) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== "super_admin" && session.user.role !== "manager")) {
      throw new Error("Access Denied.");
    }

    await connectToDatabase();
    await BlogPost.deleteOne({ slug });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, message: "Blog article deleted!" };
  } catch (error: any) {
    console.error("Error removing blog article:", error);
    return { success: false, message: error.message || "Failed to delete article." };
  }
}

export async function uploadImageAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const url = await uploadToCloudinary(file);
    return { success: true, url };
  } catch (err: any) {
    console.error("Error in uploadImageAction:", err);
    return { success: false, message: err.message || "Failed to upload image" };
  }
}
