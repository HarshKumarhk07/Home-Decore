"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import WebsiteSettings from "@/models/WebsiteSettings";
import Project from "@/models/Project";
import Gallery from "@/models/Gallery";
import FAQ from "@/models/FAQ";
import BlogPost from "@/models/BlogPost";
import ServiceCategory from "@/models/ServiceCategory";
import Testimonial from "@/models/Testimonial";
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

// --------------------------------------------------------
// SERVICE CATEGORIES CRUD (Super Admin Only for modifications)
// --------------------------------------------------------

const defaultCategoriesSeed = [
  {
    name: "Waterproofing",
    slug: "waterproofing",
    image: "/waterproofing.jpg",
    description: "Complete structural protection against dampness, wall seepage, bathroom leaks, and terrace flooding. We use advanced polyurethane, chemical grouting, and waterproofing membranes.",
    features: [
      "Roof & Terrace Waterproofing",
      "Basement Pressure Grouting",
      "Bathroom Seepage Treatment",
      "Underground Water Tank Sealant",
      "External Wall Dampness Coating"
    ],
    subcategories: [
      {
        name: "Roof & Slab Waterproofing",
        desc: "Provides structural sealing of slab surfaces. We scrape away old coatings, grout structural joints, and install elastic elastomeric overlays that expand and contract with temperature changes.",
        image: "/roof and slab waterproofing.jpg"
      },
      {
        name: "Terrace Waterproofing",
        desc: "Exposed terraces suffer severe thermal expansion and rain beating. We apply heavy-duty multi-layer liquid polyurethane membranes with embedded fiberglass mesh to absorb structural stresses.",
        image: "/Terrace Waterproofing.jpg"
      },
      {
        name: "Bathroom Seepage Waterproofing",
        desc: "Fixes dampness and pipe-joint leaks behind tiled bathroom walls. We apply cementitious waterproofing compounds underneath tiled floors, avoiding floor breaking using advanced grouting methods.",
        image: "/waterproofing.jpg"
      },
      {
        name: "Basement & Retaining Wall Grouting",
        desc: "Stops positive and negative side groundwater penetration. We inject low-viscosity PU resins and chemical grouts under high pressure to fill internal voids, voids, and micro-cracks in walls.",
        image: "/Basement & Retaining Wall Grouting.jpg"
      },
      {
        name: "Underground & Overhead Water Tanks",
        desc: "Seals water tanks from the inside using non-toxic food-grade epoxy coatings. Prevents contamination, structural corrosion, and outward leakage.",
        image: "/Underground & Overhead Water Tanks.jpg"
      }
    ]
  },
  {
    name: "Wooden Flooring",
    slug: "wooden-flooring",
    image: "/wooden flooring.jpg",
    description: "Premium wood installations using European click-lock technologies. Highly stable, scratch-resistant, and elegant floor options tailored to residential homes and retail interiors.",
    features: [
      "Heavy-duty SPC Flooring",
      "Premium Laminate Wood Flooring",
      "Luxury Vinyl Planks (LVP)",
      "Veneered Engineered Wood Flooring",
      "Premium Underlayment & Skirting"
    ],
    subcategories: [
      {
        name: "SPC Click-Lock Flooring",
        desc: "Stone Plastic Composite (SPC) flooring is 100% waterproof, fire-resistant, and highly dent-resistant. Its click-lock installation system requires no glue, making it ideal for high-humidity areas like kitchens, washrooms, and commercial spaces.",
        thickness: "5mm to 6.5mm",
        warranty: "15 Years wear warranty",
        image: "/SPC Click-Lock Flooring.jpg"
      },
      {
        name: "Premium Laminate Flooring",
        desc: "Made of high-density fiberboard (HDF) with a wear protection layer. Provides the authentic look and feel of real hardwood planks at a fraction of the cost. Scratch-resistant, making it perfect for bedrooms and living rooms.",
        thickness: "8mm to 12mm",
        warranty: "10 Years residential warranty",
        image: "/wooden flooring.jpg"
      },
      {
        name: "Engineered Wood Flooring",
        desc: "Combines real hardwood veneer as the top layer with multiple plywood core layers beneath. It can be sanded and polished over time, offering unmatched organic timber aesthetics and high structural value to premium homes.",
        thickness: "14mm to 15mm",
        warranty: "25 Years structural warranty",
        image: "/Engineered Wood Flooring.jpeg"
      },
      {
        name: "Luxury Vinyl Flooring (LVP)",
        desc: "Flexible, budget-friendly vinyl flooring that mimics wood grains and textures. LVP provides soft underfoot cushioning, sound dampening properties, and excellent durability for retail outlets and office layouts.",
        thickness: "2mm to 3mm",
        warranty: "7 Years wear warranty",
        image: "/wooden flooring.jpg"
      }
    ]
  },
  {
    name: "PVC (Polyvinyl Chloride)",
    slug: "pvc",
    image: "/PVC (Polyvinyl Chloride).jpg",
    description: "Premium Polyvinyl Chloride (PVC) installations including stone plastic composite (SPC) flooring and interlocking wall cladding. Highly resistant, water-resistant, and zero maintenance.",
    features: [
      "SPC Click-Lock Flooring",
      "Luxury Vinyl Planks (LVP)",
      "Roll & Sheet PVC Flooring",
      "Anti-Static ESD Flooring",
      "PVC Wall Panels & Cladding"
    ],
    subcategories: [
      {
        name: "SPC Click-Lock Flooring",
        desc: "Stone Plastic Composite (SPC) flooring is 100% waterproof, fire-resistant, and click-lock installed. Perfect for bathrooms, kitchens, and offices.",
        specification: "5mm to 6.5mm Stone-Polymer Base",
        image: "/SPC Click-Lock Flooring.jpg"
      },
      {
        name: "Luxury Vinyl Planks (LVP) / Tiles (LVT)",
        desc: "Resilient, quiet, scratchproof flooring mimicking natural wood or stone textures, with soft underfoot feel.",
        specification: "3mm to 4.5mm Dryback/Click Vinyl",
        image: "/PVC (Polyvinyl Chloride).jpg"
      },
      {
        name: "Roll & Sheet PVC Flooring",
        desc: "Seamless sheet flooring ideal for hospitals, schools, and laboratories requiring high hygiene, anti-microbial coatings, and joint welding.",
        specification: "2.0mm Commercial Anti-Bacterial",
        image: "/Roll & Sheet PVC Flooring.jpg"
      },
      {
        name: "Anti-Static (ESD) PVC Flooring",
        desc: "Specialized conductive flooring designed to prevent electrostatic discharge in server rooms, laboratories, and electronics factories.",
        specification: "2mm ESD Tile/Sheet with Copper Grid",
        image: "/Anti-Static (ESD) PVC Flooring.jpg"
      },
      {
        name: "PVC Wall Panels & Cladding",
        desc: "Water-resistant, termite-proof decorative panels for moisture-prone interior walls and ceilings.",
        specification: "Interlocking Hollow-Core/Solid PVC Sheets",
        image: "/PVC Wall Panels & Cladding.jpg"
      }
    ]
  }
];

export async function getServiceCategories() {
  try {
    await connectToDatabase();
    let categories = await ServiceCategory.find().lean();
    
    if (!categories || categories.length === 0) {
      console.log("No categories found in database, seeding defaults...");
      const seeded = await ServiceCategory.insertMany(defaultCategoriesSeed);
      categories = seeded.map(c => c.toObject());
    }

    return {
      success: true,
      categories: JSON.parse(JSON.stringify(categories)),
    };
  } catch (error: any) {
    console.error("Error in getServiceCategories:", error);
    return { success: false, message: error.message || "Failed to load categories" };
  }
}

export async function getServiceCategoryBySlug(slug: string) {
  try {
    await connectToDatabase();
    const category = await ServiceCategory.findOne({ slug }).lean();
    if (!category) {
      const count = await ServiceCategory.countDocuments();
      if (count === 0) {
        await getServiceCategories();
        const recheck = await ServiceCategory.findOne({ slug }).lean();
        if (recheck) {
          return { success: true, category: JSON.parse(JSON.stringify(recheck)) };
        }
      }
      return { success: false, message: "Category not found" };
    }
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
  } catch (error: any) {
    console.error("Error in getServiceCategoryBySlug:", error);
    return { success: false, message: error.message || "Failed to get category" };
  }
}

export async function saveServiceCategory(data: any) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Access Denied: Super Admin only.");
    }

    const sanitizedData = sanitizeInput(data);
    await connectToDatabase();

    const categoryData = {
      name: sanitizedData.name,
      slug: sanitizedData.slug || sanitizedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      image: sanitizedData.image,
      description: sanitizedData.description,
      features: Array.isArray(sanitizedData.features) 
        ? sanitizedData.features 
        : typeof sanitizedData.features === "string" 
          ? sanitizedData.features.split(",").map((f: string) => f.trim()).filter(Boolean)
          : [],
      subcategories: sanitizedData.subcategories || [],
    };

    let result;
    if (sanitizedData._id) {
      result = await ServiceCategory.findByIdAndUpdate(sanitizedData._id, categoryData, { new: true });
    } else {
      result = await ServiceCategory.create(categoryData);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/services/${categoryData.slug}`);

    return { success: true, message: "Category saved successfully!", category: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    console.error("Error saving service category:", error);
    return { success: false, message: error.message || "Failed to save category" };
  }
}

export async function deleteServiceCategory(id: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Access Denied: Super Admin only.");
    }

    await connectToDatabase();
    const category = await ServiceCategory.findById(id);
    if (!category) throw new Error("Category not found");

    const slug = category.slug;
    await ServiceCategory.findByIdAndDelete(id);

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath(`/services/${slug}`);

    return { success: true, message: "Category deleted successfully!" };
  } catch (error: any) {
    console.error("Error deleting service category:", error);
    return { success: false, message: error.message || "Failed to delete category" };
  }
}

// --------------------------------------------------------
// TESTIMONIALS (Super Admin Only)
// --------------------------------------------------------

export async function getTestimonials() {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
    return { success: true, testimonials: JSON.parse(JSON.stringify(testimonials)) };
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return { success: false, message: error.message || "Failed to fetch testimonials" };
  }
}

export async function saveTestimonial(data: any) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Access Denied: Super Admin only.");
    }

    await connectToDatabase();

    let result;
    if (data._id) {
      result = await Testimonial.findByIdAndUpdate(
        data._id,
        {
          clientName: sanitizeInput(data.clientName),
          serviceReceived: data.serviceReceived,
          rating: Number(data.rating),
          feedbackText: sanitizeInput(data.feedbackText),
          avatar: data.avatar,
          isApproved: data.isApproved !== undefined ? data.isApproved : true,
        },
        { new: true }
      );
    } else {
      result = await Testimonial.create({
        clientName: sanitizeInput(data.clientName),
        serviceReceived: data.serviceReceived,
        rating: Number(data.rating),
        feedbackText: sanitizeInput(data.feedbackText),
        avatar: data.avatar,
        isApproved: data.isApproved !== undefined ? data.isApproved : true,
      });
    }

    revalidatePath("/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial saved successfully!", testimonial: JSON.parse(JSON.stringify(result)) };
  } catch (error: any) {
    console.error("Error saving testimonial:", error);
    return { success: false, message: error.message || "Failed to save testimonial" };
  }
}

export async function removeTestimonial(id: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "super_admin") {
      throw new Error("Access Denied: Super Admin only.");
    }

    await connectToDatabase();
    await Testimonial.findByIdAndDelete(id);

    revalidatePath("/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial removed successfully!" };
  } catch (error: any) {
    console.error("Error removing testimonial:", error);
    return { success: false, message: error.message || "Failed to remove testimonial" };
  }
}
