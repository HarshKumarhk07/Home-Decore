import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceCategories } from "@/actions/cmsActions";

export const dynamic = "force-dynamic"; // Always fresh so admin image changes reflect immediately

export const metadata = {
  title: "Professional Home Services | Homesdecorator",
  description: "Explore our specialized home improvement services: scientific waterproofing, premium wooden flooring, and PVC cladding/flooring.",
};

export default async function ServicesPage() {
  const categoriesRes = await getServiceCategories();
  const categories = categoriesRes.success ? categoriesRes.categories : [];

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
            We focus exclusively on these services to deliver premium quality craftsmanship, utilizing brand-certified products and specialized execution teams.
          </p>
        </div>

        {/* Services Grid (2x2 on mobile, 3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {categories.map((svc: any) => (
            <div
              key={svc.slug}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Section */}
              <div className="relative h-32 sm:h-48 md:h-56 w-full overflow-hidden shrink-0">
                <Image
                  src={svc.image}
                  alt={svc.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
                <h2 className="absolute bottom-2 left-2 sm:bottom-4 sm:left-6 text-white font-serif text-sm sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                  {svc.name}
                </h2>
              </div>

              {/* Content Section */}
              <div className="p-3 sm:p-5 md:p-6 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-4">
                  <p className="text-slate-600 text-[10px] sm:text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                    {svc.description}
                  </p>

                  <div className="hidden sm:block space-y-1.5 sm:space-y-2">
                    {svc.features.slice(0, 5).map((feat: string) => (
                      <div key={feat} className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <Button asChild className="flex-grow bg-slate-900 hover:bg-primary text-white font-bold rounded-xl py-1.5 sm:py-3 text-[10px] sm:text-xs h-auto transition-all duration-300">
                    <Link href={`/services/${svc.slug}`}>
                      Explore
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-grow border-slate-200 hover:bg-slate-50 rounded-xl py-1.5 sm:py-3 text-[10px] sm:text-xs text-slate-700 font-bold h-auto transition-all duration-300">
                    <Link href="/quote">Quote</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
