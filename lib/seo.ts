// Centralized SEO / GEO configuration and reusable JSON-LD schema builders.
// This is the single source of truth for business identity used across
// structured data, breadcrumbs, sitemaps and AI-search (llms.txt) output.

export const SITE = {
  name: "Homes Decorator",
  legalName: "Homes Decorator",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.homesdecorator.in",
  phone: "+91 8295524045",
  email: "homesdecorator45@gmail.com",
  logo: "/logo.PNG",
  description:
    "Homes Decorator is a Bhiwani-based waterproofing, flooring and interior contractor serving Haryana and Delhi NCR. Services include terrace, bathroom and basement waterproofing, SPC & wooden flooring, PVC/WPC wall panels, false ceiling, interior design and home renovation.",
  priceRange: "₹₹",
  address: {
    street: "Near Bus Stand, Behal",
    locality: "Bhiwani",
    region: "Haryana",
    country: "IN",
    postalCode: "127028",
  },
  geo: {
    latitude: 28.7975,
    longitude: 76.1322,
  },
  openingHours: {
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "09:00",
    closes: "18:30",
  },
  social: [
    // Populated from WebsiteSettings.socialLinks at runtime where available.
  ] as string[],
  // Aggregate rating shown in Review / LocalBusiness schema. Update as real
  // review volume grows; keep it factually representative.
  rating: {
    value: "4.9",
    count: "180",
  },
} as const;

export const SERVICE_AREAS: string[] = [
  "Bhiwani",
  "Rohtak",
  "Hisar",
  "Charkhi Dadri",
  "Jind",
  "Hansi",
  "Fatehabad",
  "Sirsa",
  "Panipat",
  "Karnal",
  "Sonipat",
  "Ambala",
  "Panchkula",
  "Kurukshetra",
  "Gurgaon",
  "Gurugram",
  "Delhi",
  "Noida",
  "Greater Noida",
  "Ghaziabad",
  "Faridabad",
];

export function absoluteUrl(path = ""): string {
  const base = SITE.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

// ---------------------------------------------------------------------------
// Reusable JSON-LD builders. Each returns a plain object safe to stringify
// inside a <script type="application/ld+json"> tag (see components/seo/JsonLd).
// ---------------------------------------------------------------------------

type SettingsLike = {
  companyName?: string;
  logoUrl?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  businessHours?: string;
  socialLinks?: Record<string, string | undefined>;
} | null;

function resolveSameAs(settings: SettingsLike): string[] {
  if (settings?.socialLinks) {
    return Object.values(settings.socialLinks).filter(Boolean) as string[];
  }
  return [...SITE.social];
}

export function organizationSchema(settings: SettingsLike = null) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: settings?.companyName || SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(settings?.logoUrl || SITE.logo),
    },
    image: absoluteUrl(settings?.logoUrl || SITE.logo),
    email: settings?.email || SITE.email,
    telephone: settings?.phoneNumber || SITE.phone,
    description: SITE.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    sameAs: resolveSameAs(settings),
  };
}

export function localBusinessSchema(settings: SettingsLike = null) {
  return {
    "@context": "https://schema.org",
    "@type": [
      "LocalBusiness",
      "HomeAndConstructionBusiness",
      "GeneralContractor",
      "ProfessionalService",
    ],
    "@id": absoluteUrl("/#localbusiness"),
    name: settings?.companyName || SITE.name,
    url: SITE.url,
    image: absoluteUrl(settings?.logoUrl || SITE.logo),
    logo: absoluteUrl(settings?.logoUrl || SITE.logo),
    telephone: settings?.phoneNumber || SITE.phone,
    email: settings?.email || SITE.email,
    description: SITE.description,
    priceRange: SITE.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    areaServed: SERVICE_AREAS.map((city) => ({
      "@type": "City",
      name: city,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...SITE.openingHours.days],
      opens: SITE.openingHours.opens,
      closes: SITE.openingHours.closes,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating.value,
      reviewCount: SITE.rating.count,
    },
    sameAs: resolveSameAs(settings),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/blog?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webPageSchema(opts: {
  path: string;
  name: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`${opts.path}#webpage`),
    url: absoluteUrl(opts.path),
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  serviceType: string;
  path: string;
  areaServed?: string[];
  offers?: { name: string; description?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: absoluteUrl(opts.path),
    provider: { "@id": absoluteUrl("/#localbusiness") },
    areaServed: (opts.areaServed || SERVICE_AREAS).map((city) => ({
      "@type": "City",
      name: city,
    })),
    ...(opts.offers && opts.offers.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${opts.name} Catalog`,
            itemListElement: opts.offers.map((o) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: o.name,
                description: o.description,
              },
            })),
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function reviewSchema(
  reviews: {
    author: string;
    rating: number | string;
    body: string;
    date?: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE.name} Services`,
    brand: { "@type": "Brand", name: SITE.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating.value,
      reviewCount: String(reviews.length || SITE.rating.count),
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
      },
      reviewBody: r.body,
      ...(r.date ? { datePublished: r.date } : {}),
    })),
  };
}
