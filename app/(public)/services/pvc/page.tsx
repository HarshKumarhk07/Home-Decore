import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, Layers, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/actions/cmsActions";

const defaultPvcServices = [
  {
    name: "SPC Click-Lock Flooring",
    desc: "Stone Plastic Composite (SPC) flooring is 100% waterproof, fire-resistant, and click-lock installed. Perfect for bathrooms, kitchens, and offices.",
    specification: "5mm to 6.5mm Stone-Polymer Base",
    image: "/SPC Click-Lock Flooring.jpg",
  },
  {
    name: "Luxury Vinyl Planks (LVP) / Tiles (LVT)",
    desc: "Resilient, quiet, scratchproof flooring mimicking natural wood or stone textures, with soft underfoot feel.",
    specification: "3mm to 4.5mm Dryback/Click Vinyl",
    image: "/PVC (Polyvinyl Chloride).jpg",
  },
  {
    name: "Roll & Sheet PVC Flooring",
    desc: "Seamless sheet flooring ideal for hospitals, schools, and laboratories requiring high hygiene, anti-microbial coatings, and joint welding.",
    specification: "2.0mm Commercial Anti-Bacterial",
    image: "/Roll & Sheet PVC Flooring.jpg",
  },
  {
    name: "Anti-Static (ESD) PVC Flooring",
    desc: "Specialized conductive flooring designed to prevent electrostatic discharge in server rooms, laboratories, and electronics factories.",
    specification: "2mm ESD Tile/Sheet with Copper Grid",
    image: "/Anti-Static (ESD) PVC Flooring.jpg",
  },
  {
    name: "PVC Wall Panels & Cladding",
    desc: "Water-resistant, termite-proof decorative panels for moisture-prone interior walls and ceilings.",
    specification: "Interlocking Hollow-Core/Solid PVC Sheets",
    image: "/PVC Wall Panels & Cladding.jpg",
  },
];

export const metadata = {
  title: "PVC (Polyvinyl Chloride) Solutions | Home Decorater",
  description: "Premium Polyvinyl Chloride (PVC) flooring and wall cladding installations. Waterproof, termite-proof, and commercial-grade SPC flooring.",
};

export default async function PvcPage() {
  const settingsRes = await getSettings();
  const settings = settingsRes.success ? settingsRes.settings : null;
  const subcategoriesList = settings?.pvcSubcategories || [];

  const servicesToRender = subcategoriesList.length > 0
    ? subcategoriesList.map((name: string) => {
        const found = defaultPvcServices.find(p => p.name.toLowerCase() === name.toLowerCase());
        return {
          name,
          desc: found?.desc || `Professional grade PVC/SPC installation of ${name} with heavy-wear protection, water resistance, and smooth polymer finishes.`,
          specification: found?.specification || "Custom Thickness & Spec",
          image: found?.image || "/PVC (Polyvinyl Chloride).jpg",
        };
      })
    : defaultPvcServices;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homedecorater.in";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "PVC (Polyvinyl Chloride) Solutions",
    "description": "Premium Polyvinyl Chloride (PVC) flooring and wall cladding installations. Waterproof, termite-proof, and commercial-grade SPC flooring.",
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "name": "Home Decorater",
      "url": baseUrl
    },
    "serviceType": "PVC Flooring and Cladding",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Delhi NCR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "PVC Services Catalog",
      "itemListElement": servicesToRender.map((svc) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": svc.name,
          "description": svc.desc
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
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/20 px-3 py-1 rounded-full text-accent font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" /> 100% Waterproof & Termite-Proof
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                PVC (Polyvinyl Chloride) Solutions
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Upgrade your spaces with our durable, water-resistant Polyvinyl Chloride (PVC) floorings and wall panel cladding solutions. Engineered for high performance, hygiene, and low maintenance.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                  <Link href="/quote">Book Free Site Visit</Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-400 text-white hover:bg-white hover:text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                  <Link href="tel:+919999999999">Call Now: +91 99999 99999</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Highlight points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
              <Layers className="w-6 h-6 text-accent shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Resilient & Waterproof</h4>
                <p className="text-xs text-slate-500">Ideal for wet areas & high footfall</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">10-Year Wear Warranty</h4>
                <p className="text-xs text-slate-500">Covers structural warping or cracking</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center space-x-3 shadow-sm">
              <Award className="w-6 h-6 text-accent shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Flame & Termite Resistant</h4>
                <p className="text-xs text-slate-500">Self-extinguishing polymer standard</p>
              </div>
            </div>
          </div>

          {/* PVC Services List */}
          <div className="space-y-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-8 border-l-4 border-accent pl-4">
              Our Premium PVC & SPC Installations
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {servicesToRender.map((svc, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={svc.image}
                      alt={svc.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <h3 className="absolute bottom-4 left-6 text-white font-serif text-lg font-bold">{svc.name}</h3>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {svc.desc}
                    </p>
                    <div className="text-xs font-bold text-slate-500 border-t border-slate-100 pt-4">
                      Specification: <span className="text-primary font-bold">{svc.specification}</span>
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
