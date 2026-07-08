import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceLocationPage from "@/models/ServiceLocationPage";
import Project from "@/models/Project";
import { getSettings } from "@/actions/cmsActions";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Phone, MapPin, Clock, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate every minute

interface PageProps {
  params: Promise<{ slug: string; locationSlug: string }>;
}

// Fetch helper to avoid duplicate fetch code
async function getPageData(serviceSlug: string, locationSlug: string) {
  await connectToDatabase();
  const page = await ServiceLocationPage.findOne({
    serviceSlug,
    locationSlug,
  }).lean();

  if (!page || page.status !== "Published") {
    return null;
  }
  return page;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locationSlug } = await params;
  const page = await getPageData(slug, locationSlug);

  if (!page) {
    notFound();
  }

  const title = page.seoMeta?.metaTitle || page.h1Heading;
  const description = page.seoMeta?.metaDescription || "";
  const keywords = page.seoMeta?.metaKeywords?.join(", ") || "";
  const coverUrl = page.images?.[0]?.url || "/waterproofing.jpg";
  const coverAlt = page.images?.[0]?.altText || title;

  const domain = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";
  const cleanDomain = domain.replace(/\/$/, "");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${cleanDomain}/services/${slug}/${locationSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${cleanDomain}/services/${slug}/${locationSlug}`,
      type: "article",
      images: [
        {
          url: coverUrl,
          alt: coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverUrl],
    },
  };
}

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const pages = await ServiceLocationPage.find({ status: "Published" })
      .select("serviceSlug locationSlug")
      .lean();

    return pages.map((page: any) => ({
      slug: page.serviceSlug,
      locationSlug: page.locationSlug,
    }));
  } catch (error) {
    console.error("Error generating static params for service-locations:", error);
    return [];
  }
}

export default async function ServiceLocationDetailPage({ params }: PageProps) {
  const { slug, locationSlug } = await params;
  const pageResult = await getPageData(slug, locationSlug);

  if (!pageResult) {
    notFound();
  }

  // Serialize Mongoose doc
  const page = {
    ...pageResult,
    _id: pageResult._id.toString(),
    images: pageResult.images?.map((img: any) => ({
      url: img.url,
      altText: img.altText,
      _id: img._id?.toString(),
    })) || [],
    createdAt: pageResult.createdAt?.toISOString() || null,
    updatedAt: pageResult.updatedAt?.toISOString() || null,
  };

  const settingsRes = await getSettings();
  const settings = settingsRes.success ? settingsRes.settings : null;

  // Query location-relevant projects dynamically
  let locationProjects: any[] = [];
  try {
    const projectCategoryMap: Record<string, string> = {
      "terrace-waterproofing": "waterproofing",
      "bathroom-waterproofing": "waterproofing",
      "basement-waterproofing": "waterproofing",
      "wooden-flooring-installation": "wooden-flooring",
      "spc-vinyl-flooring": "pvc",
      "pvc-wall-panels-cladding": "pvc",
    };

    const query: any = {
      location: { $regex: new RegExp(page.location, "i") },
    };

    if (slug === "wooden-flooring-installation") {
      query.category = "wooden-flooring";
      query.title = { $not: /spc|vinyl/i };
    } else if (slug === "spc-vinyl-flooring") {
      query.$or = [
        { category: "pvc", location: { $regex: new RegExp(page.location, "i") } },
        { category: "wooden-flooring", location: { $regex: new RegExp(page.location, "i") }, title: /spc|vinyl/i }
      ];
    } else {
      query.category = projectCategoryMap[slug] || "waterproofing";
    }

    const rawProjects = await Project.find(query).lean();

    locationProjects = rawProjects.map((proj: any) => ({
      ...proj,
      _id: proj._id.toString(),
      completionDate: proj.completionDate?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query location specific projects:", err);
  }

  const coverUrl = page.images?.[0]?.url || "/waterproofing.jpg";
  const coverAlt = page.images?.[0]?.altText || page.h1Heading;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb navigation */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-bold truncate max-w-[200px]">
            {page.service} in {page.location}
          </span>
        </nav>

        {/* Hero Section Banner */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md">
          <Image
            src={coverUrl}
            alt={coverAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-10 space-y-3">
            <span className="bg-accent text-dark px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
              {page.service}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {page.h1Heading}
            </h1>
          </div>
        </div>

        {/* Main Content & CTA Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Detailed Body Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary border-b border-slate-100 pb-3">
                Professional Service Overview
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {page.bodyContent}
              </div>
            </div>

            {/* Conditionally Render Location-Specific Projects */}
            {locationProjects.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-serif text-xl font-bold text-primary">
                  Completed Projects in {page.location}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {locationProjects.map((project) => (
                    <div key={project.slug} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow transition duration-200">
                      <div className="relative h-40 w-full">
                        <Image
                          src={project.images?.[0] || "/waterproofing.jpg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                      <div className="p-5 space-y-3">
                        <h4 className="font-bold text-primary text-sm sm:text-base line-clamp-1">
                          {project.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50 text-[10px] text-slate-450 font-bold uppercase">
                          <span>Area: {project.areaCovered}</span>
                          <span>•</span>
                          <span>Warranty: {project.warranty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area Serve & Contact Widget */}
          <div className="space-y-8">
            
            {/* Service & Contact info */}
            <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="p-3 bg-white/10 rounded-2xl w-fit">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-serif text-xl font-bold leading-snug">
                Need Service in {page.location}?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Contact our expert field engineer team serving {page.location} and surrounding areas for on-site scanning and assessments.
              </p>
              
              <div className="space-y-3.5 border-t border-white/10 pt-4 text-xs sm:text-sm">
                {settings?.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <span>Call: {settings.phoneNumber}</span>
                  </div>
                )}
                {settings?.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="leading-snug">Service Area: {page.location} (from {settings.companyName} HQ in {settings.address})</span>
                  </div>
                )}
                {settings?.businessHours && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-accent shrink-0" />
                    <span>Hours: {settings.businessHours}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <Button asChild className="w-full bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl py-3.5 text-sm">
                  <Link href="/inspection">Book Free Site Audit</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary rounded-xl py-3.5 text-sm">
                  <Link href="/quote">Request Free Estimate</Link>
                </Button>
              </div>
            </div>

            {/* Simple Leaflet/Map card (static indicator) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h4 className="font-serif font-bold text-primary text-base">Service Coverage Area</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our engineers regularly visit sites in {page.location} for industrial, commercial, and residential projects. Schedule a slot today.
              </p>
              <div className="bg-slate-100 h-24 rounded-xl flex items-center justify-center text-slate-400 font-mono text-[10px] uppercase border border-slate-200">
                <MapPin className="w-5 h-5 text-slate-400 mr-1.5" />
                <span>Coverage Map Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
