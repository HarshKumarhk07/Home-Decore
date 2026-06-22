import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";

  // Define the core static routes
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/services/waterproofing",
    "/services/wooden-flooring",
    "/services/pvc",
    "/projects",
    "/blog",
    "/gallery",
    "/testimonials",
    "/faq",
    "/contact",
    "/quote",
    "/inspection",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let projectRoutes: any[] = [];
  let blogRoutes: any[] = [];

  try {
    await connectToDatabase();
    
    // Fetch dynamic project routes
    const projects = await Project.find({}).select("slug updatedAt").lean();
    projectRoutes = projects.map((p: any) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // Fetch dynamic blog routes
    const blogs = await BlogPost.find({}).select("slug updatedAt").lean();
    blogRoutes = blogs.map((b: any) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Failed to fetch sitemap items:", err);
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
