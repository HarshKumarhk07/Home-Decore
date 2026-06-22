import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Calendar, Phone, Award, Layers, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const subServices = [
  {
    name: "Roof & Slab Waterproofing",
    desc: "Provides structural sealing of slab surfaces. We scrape away old coatings, grout structural joints, and install elastic elastomeric overlays that expand and contract with temperature changes.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Terrace Waterproofing",
    desc: "Exposed terraces suffer severe thermal expansion and rain beating. We apply heavy-duty multi-layer liquid polyurethane membranes with embedded fiberglass mesh to absorb structural stresses.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Bathroom Seepage Waterproofing",
    desc: "Fixes dampness and pipe-joint leaks behind tiled bathroom walls. We apply cementitious waterproofing compounds underneath tiled floors, avoiding floor breaking using advanced grouting methods.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Basement & Retaining Wall Grouting",
    desc: "Stops positive and negative side groundwater penetration. We inject low-viscosity PU resins and chemical grouts under high pressure to fill internal voids, voids, and micro-cracks in walls.",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Underground & Overhead Water Tanks",
    desc: "Seals water tanks from the inside using non-toxic food-grade epoxy coatings. Prevents contamination, structural corrosion, and outward leakage.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
  },
];

export const metadata = {
  title: "Scientific Waterproofing Services | Home Decorater",
  description: "Stop structural leaks with professional waterproofing treatments for roofs, terraces, bathrooms, and basements. Up to 10-year warranty.",
};

export default function WaterproofingPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Scientific Waterproofing Solutions",
    "description": "Stop structural leaks with professional waterproofing treatments for roofs, terraces, bathrooms, and basements. Up to 10-year warranty.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Home Decorater",
      "url": baseUrl
    },
    "serviceType": "Waterproofing",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Delhi NCR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Waterproofing Services Catalog",
      "itemListElement": subServices.map((sub) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": sub.name,
          "description": sub.desc
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-primary to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
            <Layers className="w-96 h-96" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/20 px-3 py-1 rounded-full text-accent font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 mr-1 text-accent animate-pulse" /> 10-Year Stamp Warranty
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Scientific Waterproofing Solutions
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Water seepage degrades reinforcement bars, causing concrete cancer and paint failures. Our engineers scan dampness with moisture scanners and deploy specialized waterproofing chemical systems to seal your home forever.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                <Link href="/inspection">Book Free Moisture Inspection</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-400 text-white hover:bg-white hover:text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                <Link href="tel:+919999999999">Call: +91 99999 99999</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Why it is important Alert */}
        <div className="bg-amber-50 border-l-4 border-accent p-5 rounded-2xl mb-16 flex items-start space-x-3 shadow-sm">
          <AlertCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Why waterproofing should never be delayed:</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
              Micro-cracks in walls allow moisture to reach the steel reinforcement bars. This causes the steel to rust, expand, and crack the surrounding concrete, leading to permanent structural damage and hazardous flaking plaster.
            </p>
          </div>
        </div>

        {/* Sub services Grid */}
        <div className="space-y-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-8 border-l-4 border-accent pl-4">
            Our Specialized Waterproofing Treatments
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {subServices.map((sub, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-white font-serif text-lg font-bold">{sub.name}</h3>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sub.desc}
                  </p>
                  <div className="flex items-center space-x-2 text-xs font-bold text-primary bg-primary-light p-3 rounded-xl border border-primary/10">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    <span>Includes site scan & written warranty</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
