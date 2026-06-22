import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Restrict search engines from admin panel and api routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
