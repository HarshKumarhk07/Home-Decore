import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceLocationPage from "@/models/ServiceLocationPage";
import Project from "@/models/Project";
import { getSettings } from "@/actions/cmsActions";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Phone, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import InspectionForm from "@/components/forms/InspectionForm";
import {
  serviceSchema,
  webPageSchema,
  faqSchema,
  absoluteUrl,
} from "@/lib/seo";
import {
  getCityData,
  getServiceInfo,
  buildLandingFaqs,
} from "@/lib/localSeo";

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

  const canonicalPath = `/services/${slug}/${locationSlug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
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

  // Local SEO enrichment (unique per city — avoids duplicate content).
  const cityInfo = getCityData(locationSlug);
  const serviceInfo = getServiceInfo(slug);
  const faqs = buildLandingFaqs({
    service: page.service,
    city: cityInfo,
    cityName: page.location,
  });

  // Lead attribution for the embedded inspection form.
  const canonicalPath = `/services/${slug}/${locationSlug}`;
  const leadSource = `${page.service} — ${page.location}`;
  const leadSourceUrl = absoluteUrl(canonicalPath);

  // Query location-relevant projects dynamically
  let locationProjects: any[] = [];
  try {
    const query: any = {
      location: { $regex: new RegExp(page.location, "i") },
    };

    if (slug === "wooden-flooring-installation") {
      query.category = "wooden-flooring";
      query.title = { $not: /spc|vinyl/i };
    } else if (slug === "spc-vinyl-flooring") {
      query.$or = [
        { category: "pvc", location: { $regex: new RegExp(page.location, "i") } },
        { category: "wooden-flooring", location: { $regex: new RegExp(page.location, "i") }, title: /spc|vinyl/i },
      ];
    } else {
      const projectCategoryMap: Record<string, string> = {
        "terrace-waterproofing": "waterproofing",
        "bathroom-waterproofing": "waterproofing",
        "basement-waterproofing": "waterproofing",
        "pvc-wall-panels-cladding": "pvc",
      };
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

  // Breadcrumb trail (visual + BreadcrumbList schema).
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    ...(serviceInfo
      ? [{ name: serviceInfo.parentLabel, path: serviceInfo.parentSlug }]
      : []),
    { name: `${page.service} in ${page.location}`, path: canonicalPath },
  ];

  // Structured data for rich results + AI answer extraction.
  const structuredData = [
    webPageSchema({
      path: canonicalPath,
      name: page.seoMeta?.metaTitle || page.h1Heading,
      description: page.seoMeta?.metaDescription || undefined,
    }),
    serviceSchema({
      name: `${page.service} in ${page.location}`,
      description:
        page.seoMeta?.metaDescription ||
        `Professional ${page.service.toLowerCase()} by Homes Decorator in ${page.location}.`,
      serviceType: page.service,
      path: canonicalPath,
      areaServed: [page.location, ...(cityInfo?.nearbyAreas || [])],
    }),
    faqSchema(faqs),
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <JsonLd data={structuredData} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <Breadcrumbs crumbs={crumbs} />

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

        {/* Answer-first summary (GEO/AI friendly) */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            <strong className="text-primary">Homes Decorator</strong> provides
            professional {page.service.toLowerCase()} in{" "}
            <strong>{page.location}</strong>
            {cityInfo?.nearbyAreas?.length
              ? `, covering ${cityInfo.nearbyAreas.slice(0, 4).join(", ")} and surrounding areas`
              : ""}
            . {cityInfo?.intro || ""} Every project includes a free on-site
            inspection, transparent per-square-foot pricing, and a written
            warranty. Call{" "}
            <a href="tel:+918295524045" className="text-primary font-semibold underline">
              +91 8295524045
            </a>{" "}
            to book an inspection.
          </p>
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

            {/* Why local context matters (unique per city) */}
            {cityInfo && (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
                  {page.service} for {page.location} Conditions
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {cityInfo.climateNote}
                </p>
                {cityInfo.landmarks?.length > 0 && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our teams work across {page.location} — near landmarks such
                    as {cityInfo.landmarks.slice(0, 3).join(", ")} — for
                    residential, commercial and industrial clients.
                  </p>
                )}
                {cityInfo.nearbyAreas?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cityInfo.nearbyAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-light/10 border border-primary/15 px-2.5 py-1 rounded-md"
                      >
                        <CheckCircle2 className="w-3 h-3" /> {area}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Conditionally Render Location-Specific Projects */}
            {locationProjects.length > 0 && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-primary">
                  Completed Projects in {page.location}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {locationProjects.map((project) => (
                    <Link
                      href={`/projects/${project.slug}`}
                      key={project.slug}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow transition duration-200"
                    >
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
                        <h3 className="font-bold text-primary text-sm sm:text-base line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50 text-[10px] text-slate-450 font-bold uppercase">
                          <span>Area: {project.areaCovered}</span>
                          <span>•</span>
                          <span>Warranty: {project.warranty}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ cluster (visual + FAQPage schema) */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary border-b border-slate-100 pb-3">
                {page.service} in {page.location} — FAQs
              </h2>
              <div className="divide-y divide-slate-100">
                {faqs.map((faq, i) => (
                  <details key={i} className="group py-3" open={i === 0}>
                    <summary className="cursor-pointer list-none font-semibold text-slate-800 text-sm sm:text-base flex items-center justify-between gap-3">
                      {faq.question}
                      <ArrowRight className="w-4 h-4 text-accent shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            {/* Internal links — related services */}
            {serviceInfo && serviceInfo.relatedSlugs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
                <h3 className="font-serif font-bold text-primary text-base">
                  Related Services in {page.location}
                </h3>
                <ul className="space-y-2 text-sm">
                  {serviceInfo.relatedSlugs.map((rs) => {
                    const info = getServiceInfo(rs);
                    if (!info) return null;
                    return (
                      <li key={rs}>
                        <Link
                          href={`/services/${rs}/${locationSlug}`}
                          className="text-primary hover:text-accent font-medium flex items-center gap-1.5"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          {info.label} in {page.location}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      href={serviceInfo.parentSlug}
                      className="text-primary hover:text-accent font-medium flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      All {serviceInfo.parentLabel} services
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Embedded inquiry form (reuses the Home page InspectionForm) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
              <div className="space-y-1">
                <h2 className="font-serif text-lg font-bold text-primary leading-snug">
                  Book a Free Inspection in {page.location}
                </h2>
                <p className="text-xs text-slate-500">
                  Share your details and our engineer will call you back.
                </p>
              </div>
              <InspectionForm
                source={leadSource}
                sourceUrl={leadSourceUrl}
                sourceSlug={canonicalPath.replace(/^\//, "")}
                defaultCity={page.location}
              />
            </div>

            {/* Service & Contact info */}
            <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="p-3 bg-white/10 rounded-2xl w-fit">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-serif text-xl font-bold leading-snug">
                Need Service in {page.location}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Contact our expert field engineer team serving {page.location} and surrounding areas for on-site scanning and assessments.
              </p>

              <div className="space-y-3.5 border-t border-white/10 pt-4 text-xs sm:text-sm">
                {settings?.phoneNumber && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-accent shrink-0" />
                    <a href="tel:+918295524045" className="hover:text-accent">Call: {settings.phoneNumber}</a>
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
                <Button asChild variant="outline" className="w-full border-white text-white hover:bg-white hover:text-primary rounded-xl py-3.5 text-sm">
                  <Link href="/quote">Request Detailed Estimate</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
