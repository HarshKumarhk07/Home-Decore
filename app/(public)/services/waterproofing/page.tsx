import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, AlertCircle, CheckCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, getServiceCategoryBySlug } from "@/actions/cmsActions";

const defaultSubServices = [
  {
    name: "Roof & Slab Waterproofing",
    desc: "Provides structural sealing of slab surfaces. We scrape away old coatings, grout structural joints, and install elastic elastomeric overlays that expand and contract with temperature changes.",
    image: "/roof and slab waterproofing.jpg",
  },
  {
    name: "Terrace Waterproofing",
    desc: "Exposed terraces suffer severe thermal expansion and rain beating. We apply heavy-duty multi-layer liquid polyurethane membranes with embedded fiberglass mesh to absorb structural stresses.",
    image: "/Terrace Waterproofing.jpg",
  },
  {
    name: "Bathroom Seepage Waterproofing",
    desc: "Fixes dampness and pipe-joint leaks behind tiled bathroom walls. We apply cementitious waterproofing compounds underneath tiled floors, avoiding floor breaking using advanced grouting methods.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Basement & Retaining Wall Grouting",
    desc: "Stops positive and negative side groundwater penetration. We inject low-viscosity PU resins and chemical grouts under high pressure to fill internal voids, voids, and micro-cracks in walls.",
    image: "/Basement & Retaining Wall Grouting.jpg",
  },
  {
    name: "Underground & Overhead Water Tanks",
    desc: "Seals water tanks from the inside using non-toxic food-grade epoxy coatings. Prevents contamination, structural corrosion, and outward leakage.",
    image: "/Underground & Overhead Water Tanks.jpg",
  },
];

export const metadata = {
  title: "Scientific Waterproofing Services | Homesdecorator",
  description: "Stop structural leaks with professional waterproofing treatments for roofs, terraces, bathrooms, and basements. Up to 10-year warranty.",
};

export default async function WaterproofingPage() {
  const settingsRes = await getSettings();
  const settings = settingsRes.success ? settingsRes.settings : null;

  const catRes = await getServiceCategoryBySlug("waterproofing");
  const category = catRes.success ? catRes.category : null;

  const servicesToRender = category && category.subcategories && category.subcategories.length > 0
    ? category.subcategories
    : defaultSubServices;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Scientific Waterproofing Solutions",
    "description": "Stop structural leaks with professional waterproofing treatments for roofs, terraces, bathrooms, and basements. Up to 10-year warranty.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Homesdecorator",
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
      "itemListElement": servicesToRender.map((sub: any) => ({
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
          <div className="bg-gradient-to-r from-primary to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden shadow-xl animate-fade-in">
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

          {/* Sub services Grid */}
          <div className="space-y-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-8 border-l-4 border-accent pl-4">
              Our Specialized Waterproofing Treatments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {servicesToRender.map((sub: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
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
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-primary bg-primary-light p-3 rounded-xl border border-primary/10">
                        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                        <span>Includes site scan & written warranty</span>
                      </div>
                      <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white font-bold rounded-xl py-2 cursor-pointer text-xs">
                        <Link href="/inspection">Book Free Inspection</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why it is important Alert */}
          <div className="bg-amber-50 border-l-4 border-accent p-5 rounded-2xl mt-16 flex items-start space-x-3 shadow-sm animate-fade-in">
            <AlertCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Why waterproofing should never be delayed:</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                Micro-cracks in walls allow moisture to reach the steel reinforcement bars. This causes the steel to rust, expand, and crack the surrounding concrete, leading to permanent structural damage and hazardous flaking plaster.
              </p>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md space-y-6 mt-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
              Request Your Free Site Audit & Moisture Assessment
            </h2>
            <p className="text-slate-200 text-sm max-w-xl mx-auto leading-relaxed">
              Our engineers visit your property, scan concrete moisture levels with professional tools, and suggest the right system.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-8 py-6 text-base cursor-pointer">
                <Link href="/inspection">
                  Book Free Site Audit
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-400 text-white hover:bg-white hover:text-dark font-bold rounded-xl px-8 py-6 text-base cursor-pointer">
                <Link href="/quote">
                  Get Free Estimate
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
