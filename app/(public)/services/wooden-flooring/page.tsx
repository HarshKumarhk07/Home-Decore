import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Flame, Droplet, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings, getServiceCategoryBySlug } from "@/actions/cmsActions";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceLocationPage from "@/models/ServiceLocationPage";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const defaultFloorTypes = [
  {
    name: "SPC Click-Lock Flooring",
    desc: "Stone Plastic Composite (SPC) flooring is 100% waterproof, fire-resistant, and highly dent-resistant. Its click-lock installation system requires no glue, making it ideal for high-humidity areas like kitchens, washrooms, and commercial spaces.",
    thickness: "5mm to 6.5mm",
    warranty: "15 Years wear warranty",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Premium Laminate Flooring",
    desc: "Made of high-density fiberboard (HDF) with a wear protection layer. Provides the authentic look and feel of real hardwood planks at a fraction of the cost. Scratch-resistant, making it perfect for bedrooms and living rooms.",
    thickness: "8mm to 12mm",
    warranty: "10 Years residential warranty",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Engineered Wood Flooring",
    desc: "Combines real hardwood veneer as the top layer with multiple plywood core layers beneath. It can be sanded and polished over time, offering unmatched organic timber aesthetics and high structural value to premium homes.",
    thickness: "14mm to 15mm",
    warranty: "25 Years structural warranty",
    image: "/Engineered Wood Flooring.jpeg",
  },
  {
    name: "Luxury Vinyl Flooring (LVP)",
    desc: "Flexible, budget-friendly vinyl flooring that mimics wood grains and textures. LVP provides soft underfoot cushioning, sound dampening properties, and excellent durability for retail outlets and office layouts.",
    thickness: "2mm to 3mm",
    warranty: "7 Years wear warranty",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600",
  },
];

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Premium Wooden Flooring Services",
  description: "Homes Decorator laminate, vinyl, SPC, and engineered wood floor installations with European click-lock joints and wear warranties across Haryana & Delhi NCR. Book a site visit today.",
  alternates: { canonical: "/services/wooden-flooring" },
};

export default async function WoodenFlooringPage() {
  const settingsRes = await getSettings();
  const settings = settingsRes.success ? settingsRes.settings : null;

  const catRes = await getServiceCategoryBySlug("wooden-flooring");
  const category = catRes.success ? catRes.category : null;

  let servedAreas: any[] = [];
  try {
    await connectToDatabase();
    const dbPages = await ServiceLocationPage.find({
      status: "Published",
      serviceSlug: "wooden-flooring-installation",
    })
      .select("service location serviceSlug locationSlug")
      .lean();
    servedAreas = dbPages.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
    }));
  } catch (err) {
    console.error("Failed to query served areas:", err);
  }

  const floorTypesToRender = category && category.subcategories && category.subcategories.length > 0
    ? category.subcategories
    : defaultFloorTypes;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.homesdecorator.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Premium Flooring Installations",
    "description": "Laminate, vinyl, SPC, and engineered wood floor installations with European click-lock joints and wear warranties. Book a site visit today.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Homes Decorator",
      "url": baseUrl
    },
    "serviceType": "Wooden Flooring",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Delhi NCR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Flooring Services Catalog",
      "itemListElement": floorTypesToRender.map((floor: any) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": floor.name,
          "description": floor.desc
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
          <div className="mb-8">
            <Breadcrumbs
              crumbs={[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Wooden Flooring", path: "/services/wooden-flooring" },
              ]}
            />
          </div>
          {/* Banner Section */}
          <div className="bg-gradient-to-r from-primary to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 relative overflow-hidden shadow-xl animate-fade-in">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/20 px-3 py-1 rounded-full text-accent font-semibold text-xs uppercase tracking-wider">
                <Star className="w-4 h-4 mr-1 text-accent" /> Premium European Standards
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Premium Flooring Installations
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Elevate your home with our collection of water-resistant, scratchproof, and sound-insulated wooden floors. Lay out herringbone, diagonal, or standard plank layouts executed by certified installers.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                  <Link href="/quote">Get Free Estimate & Sample Kit</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-400 text-white hover:bg-white hover:text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                  <Link href="/inspection">Book Free Site Audit</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 animate-fade-in">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-primary-light rounded-xl text-primary shrink-0">
                <Droplet className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Water Resistant</h4>
                <p className="text-xs text-slate-500 mt-0.5">100% moisture barrier protection</p>
              </div>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-primary-light rounded-xl text-primary shrink-0">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Fire Retardant</h4>
                <p className="text-xs text-slate-500 mt-0.5">Self-extinguishing technology</p>
              </div>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-primary-light rounded-xl text-primary shrink-0">
                <ShieldCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">Heavy Wear Rating</h4>
                <p className="text-xs text-slate-500 mt-0.5">AC3 to AC5 commercial ratings</p>
              </div>
            </div>
          </div>

          {/* Floor Types List */}
          <div className="space-y-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-8 border-l-4 border-accent pl-4">
              Explore Flooring Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {floorTypesToRender.map((floor: any, idx: number) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden shrink-0 shadow">
                    <Image 
                      src={floor.image} 
                      alt={floor.name} 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 640px) 100vw, 200px"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-primary">{floor.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">{floor.desc}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-xs font-semibold border-t border-slate-100 pt-4 text-slate-500">
                        <div>Thickness: <span className="text-primary font-bold">{floor.thickness}</span></div>
                        <div>Warranty: <span className="text-primary font-bold">{floor.warranty}</span></div>
                      </div>
                      <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-bold rounded-xl py-1.5 px-4 cursor-pointer text-xs">
                        <Link href="/quote">Get Flooring Estimate</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Areas We Serve Section */}
          {servedAreas && servedAreas.length > 0 && (
            <div className="mt-16 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-primary mb-4">
                Areas We Serve
              </h3>
              <p className="text-slate-650 text-xs sm:text-sm mb-6 leading-relaxed">
                We offer professional wooden flooring installation services across major cities in Haryana and Delhi NCR. Explore our location-specific services:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {servedAreas.map((area: any) => (
                  <Link
                    key={area._id}
                    href={`/services/${area.serviceSlug}/${area.locationSlug}`}
                    className="text-xs sm:text-sm text-slate-600 hover:text-accent font-semibold transition-colors bg-slate-50 hover:bg-accent/5 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center justify-center text-center"
                  >
                    {area.service} in {area.location}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA Section */}
          <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md space-y-6 mt-16">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
              Request Your Free Site Audit & Sample Selection
            </h2>
            <p className="text-slate-200 text-sm max-w-xl mx-auto leading-relaxed">
              We bring sample catalogs directly to your site and evaluate your subfloor base moisture levels.
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
