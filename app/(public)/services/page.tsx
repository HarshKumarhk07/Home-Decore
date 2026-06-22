import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const servicesList = [
  {
    title: "Waterproofing Systems",
    slug: "waterproofing",
    image: "/waterproofing.jpg",
    desc: "Complete structural protection against dampness, wall seepage, bathroom leaks, and terrace flooding. We use advanced polyurethane, chemical grouting, and waterproofing membranes.",
    features: [
      "Roof & Terrace Waterproofing",
      "Basement Pressure Grouting",
      "Bathroom Seepage Treatment",
      "Underground Water Tank Sealant",
      "External Wall Dampness Coating",
    ],
  },
  {
    title: "Wooden Flooring",
    slug: "wooden-flooring",
    image: "/wooden flooring.jpg",
    desc: "Premium wood installations using European click-lock technologies. Highly stable, scratch-resistant, and elegant floor options tailored to residential homes and retail interiors.",
    features: [
      "Heavy-duty SPC Flooring",
      "Premium Laminate Wood Flooring",
      "Luxury Vinyl Planks (LVP)",
      "Veneered Engineered Wood Flooring",
      "Premium Underlayment & Skirting",
    ],
  },
  {
    title: "PVC (Polyvinyl Chloride)",
    slug: "pvc",
    image: "/PVC (Polyvinyl Chloride).jpg",
    desc: "Premium Polyvinyl Chloride (PVC) installations including stone plastic composite (SPC) flooring and interlocking wall cladding. Highly resistant, water-resistant, and zero maintenance.",
    features: [
      "SPC Click-Lock Flooring",
      "Luxury Vinyl Planks (LVP)",
      "Roll & Sheet PVC Flooring",
      "Anti-Static ESD Flooring",
      "PVC Wall Panels & Cladding",
    ],
  },
];

export const metadata = {
  title: "Professional Home Services | Home Decorater",
  description: "Explore our specialized home improvement services: scientific waterproofing, premium wooden flooring, and PVC cladding/flooring.",
};

export default function ServicesPage() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-primary-light px-3 py-1 rounded-full text-primary">
            Our Expertise
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary">
            Specialized Home Engineering & Decor
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            We focus exclusively on these three services to deliver premium quality craftsmanship, utilizing brand-certified products and specialized execution teams.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-16">
          {servicesList.map((svc, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={svc.slug}
                className={`flex flex-col lg:flex-row gap-10 items-center bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image Section */}
                <div className="relative w-full lg:w-1/2 h-[280px] sm:h-[380px] rounded-2xl overflow-hidden shadow-md shrink-0">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover hover:scale-102 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="space-y-6 lg:px-4">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                    {svc.title}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {svc.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {svc.features.map((feat) => (
                      <div key={feat} className="flex items-center space-x-2 text-sm text-slate-700 font-medium">
                        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <Button asChild className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 py-5 font-semibold">
                      <Link href={`/services/${svc.slug}`}>
                        Detailed Services <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-slate-200 hover:bg-slate-50 rounded-xl px-6 py-5 font-semibold text-slate-700">
                      <Link href="/quote">Get Free Estimate</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
