import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

// Force environment variable validation during startup
import "@/lib/env";
import { cn } from "@/lib/utils";

import { getSettings } from "@/actions/cmsActions";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, organizationSchema, localBusinessSchema, websiteSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const result = await getSettings();
  const settings = result.success ? result.settings : null;

  const title =
    settings?.seoMetadata?.title ||
    "Homes Decorator | Waterproofing, Wooden & SPC Flooring, Interior Contractor in Haryana & Delhi NCR";
  const description =
    settings?.seoMetadata?.description ||
    "Homes Decorator, Bhiwani — expert waterproofing, wooden & SPC flooring, PVC/WPC wall panels, false ceiling, interior design and home renovation across Haryana and Delhi NCR.";

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: title,
      template: "%s | Homes Decorator",
    },
    description,
    keywords: settings?.seoMetadata?.keywords || undefined,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      url: SITE.url,
      locale: "en_IN",
      images: [{ url: SITE.logo }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE.logo],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800;900&family=Geist:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd
          data={[organizationSchema(), localBusinessSchema(), websiteSchema()]}
        />
        {children}

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K2NZ7PVVX7"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K2NZ7PVVX7');
          `}
        </Script>
      </body>
    </html>
  );
}
