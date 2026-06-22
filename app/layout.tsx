import type { Metadata } from "next";
import { Outfit, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";

// Force environment variable validation during startup
import "@/lib/env";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Home Decorater | Waterproofing, PVC & Wooden Flooring Specialists",
  description: "Home Decorater offers premium waterproofing, PVC (Polyvinyl Chloride), and wooden flooring services. High durability, expert craftsmanship, and lifetime warranty options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", outfit.variable, playfair.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
