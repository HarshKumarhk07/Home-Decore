import type { Metadata } from "next";

import "./globals.css";

// Force environment variable validation during startup
import "@/lib/env";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Homesdecorator | Waterproofing, PVC & Wooden Flooring Specialists",
  description: "Homesdecorator offers premium waterproofing, PVC (Polyvinyl Chloride), and wooden flooring services. High durability, expert craftsmanship, and lifetime warranty options.",
};

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
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-K2NZ7PVVX7"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-K2NZ7PVVX7');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
