import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Testimonial from "@/models/Testimonial";
import FAQ from "@/models/FAQ";
import WebsiteSettings from "@/models/WebsiteSettings";
import HomeClient from "./HomeClient";
import { fallbackProjects, fallbackTestimonials, fallbackFaqs } from "@/lib/fallbackData";
import { getServiceCategories } from "@/actions/cmsActions";

// Force dynamic or incremental revalidation (ISR) to pull new lead-updated dashboard items.
export const revalidate = 60; // Revalidate page every 60 seconds

export default async function HomePage() {
  let featuredProjects: any[] = [];
  let testimonials: any[] = [];
  let faqs: any[] = [];
  let settings: any = null;
  let categories: any[] = [];

  try {
    await connectToDatabase();

    // Fetch settings
    settings = await WebsiteSettings.findOne().lean();

    // Fetch categories
    const categoriesRes = await getServiceCategories();
    categories = categoriesRes.success ? categoriesRes.categories : [];

    // Fetch featured projects
    const dbProjects = await Project.find({ isFeatured: true }).limit(3).lean();
    featuredProjects = dbProjects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      completionDate: p.completionDate?.toISOString() || null,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));

    // Fetch approved testimonials
    const dbTestimonials = await Testimonial.find({ isApproved: true }).limit(3).lean();
    testimonials = dbTestimonials.map((t: any) => ({
      ...t,
      _id: t._id.toString(),
      createdAt: t.createdAt?.toISOString() || null,
      updatedAt: t.updatedAt?.toISOString() || null,
    }));

    // Fetch general FAQs
    const dbFaqs = await FAQ.find({ category: "general" }).limit(4).lean();
    faqs = dbFaqs.map((f: any) => ({
      ...f,
      _id: f._id.toString(),
      createdAt: f.createdAt?.toISOString() || null,
      updatedAt: f.updatedAt?.toISOString() || null,
    }));
  } catch (error) {
    console.error("⚠️ Failed to fetch homepage data from database, using fallbacks:", error);
  }

  // Fallback items in case database is empty or not yet seeded
  if (featuredProjects.length === 0) {
    featuredProjects = fallbackProjects;
  }

  // Combine database testimonials with fallback/demo testimonials
  testimonials = [...testimonials, ...fallbackTestimonials];

  if (faqs.length === 0) {
    faqs = fallbackFaqs;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": settings?.companyName || "Home Decorater",
    "image": settings?.logoUrl || `${baseUrl}/favicon.ico`,
    "@id": `${baseUrl}/#organization`,
    "url": baseUrl,
    "telephone": settings?.phoneNumber || "+91 99999 99999",
    "email": settings?.email || "info@homedecorater.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "Plot 42, Sector 62, Noida, UP, India",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "addressCountry": "IN"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:30"
    },
    "sameAs": settings?.socialLinks
      ? Object.values(settings.socialLinks).filter(Boolean)
      : []
  };

  const settingsPlain = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        projects={featuredProjects}
        testimonials={testimonials}
        faqs={faqs}
        settings={settingsPlain}
        categories={categories}
      />
    </>
  );
}
