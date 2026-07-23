import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import Testimonial from "@/models/Testimonial";
import FAQ from "@/models/FAQ";
import WebsiteSettings from "@/models/WebsiteSettings";
import HomeClient from "./HomeClient";
import { fallbackProjects, fallbackFaqs } from "@/lib/fallbackData";
import { getServiceCategories } from "@/actions/cmsActions";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema, faqSchema } from "@/lib/seo";

// Always render fresh so admin content changes (images, projects, services) reflect immediately.
export const dynamic = "force-dynamic";

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

    // Fetch the 3 most recently added projects from admin
    const dbProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    featuredProjects = dbProjects.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      completionDate: p.completionDate?.toISOString() || null,
      createdAt: p.createdAt?.toISOString() || null,
      updatedAt: p.updatedAt?.toISOString() || null,
    }));

    // Fetch approved testimonials
    const dbTestimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .lean();
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
    console.error(
      "⚠️ Failed to fetch homepage data from database, using fallbacks:",
      error,
    );
  }

  // Fallback items in case database is empty or not yet seeded
  if (featuredProjects.length === 0) {
    featuredProjects = fallbackProjects;
  }

  if (faqs.length === 0) {
    faqs = fallbackFaqs;
  }

  const settingsPlain = settings ? JSON.parse(JSON.stringify(settings)) : null;

  // Organization / LocalBusiness / WebSite schema are emitted globally in the
  // root layout (single Bhiwani entity). Here we add page-scoped WebPage and
  // FAQPage schema so the homepage FAQs are eligible for rich results and AI
  // answer extraction.
  const homeSchema = [
    webPageSchema({
      path: "/",
      name: "Homes Decorator | Waterproofing, Flooring & Interior Contractor in Haryana & Delhi NCR",
      description:
        "Homes Decorator, Bhiwani — expert waterproofing, wooden & SPC flooring, PVC/WPC wall panels, false ceiling, interior design and home renovation across Haryana and Delhi NCR.",
    }),
    ...(faqs.length > 0
      ? [
          faqSchema(
            faqs.map((f: any) => ({
              question: f.question,
              answer: f.answer,
            })),
          ),
        ]
      : []),
  ];

  return (
    <>
      <JsonLd data={homeSchema} />
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
