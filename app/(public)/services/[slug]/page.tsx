import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle, ArrowRight, Wrench, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServiceCategoryBySlug, getServiceCategories } from "@/actions/cmsActions";

interface Props {
  params: Promise<{ slug: string }>;
}

// Always render fresh so admin image/content changes reflect immediately.
export const dynamic = "force-dynamic";

// Pre-generate slugs for known categories at build time; new ones are server-rendered on demand
export async function generateStaticParams() {
  try {
    const res = await getServiceCategories();
    if (res.success && res.categories) {
      return res.categories.map((cat: any) => ({ slug: cat.slug }));
    }
  } catch {
    // Silently fallback
  }
  return [
    { slug: "waterproofing" },
    { slug: "wooden-flooring" },
    { slug: "pvc" },
  ];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const res = await getServiceCategoryBySlug(slug);
  if (!res.success || !res.category) {
    return { title: "Service Not Found | Homesdecorator" };
  }
  const cat = res.category;
  return {
    title: `${cat.name} | Homesdecorator`,
    description: cat.description || `Professional ${cat.name} services by Homesdecorator.`,
  };
}

export default async function DynamicServicePage({ params }: Props) {
  const { slug } = await params;
  const res = await getServiceCategoryBySlug(slug);

  if (!res.success || !res.category) {
    notFound();
  }

  const category = res.category;
  const subcategories: any[] = category.subcategories || [];
  const features: string[] = Array.isArray(category.features) ? category.features : [];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-primary to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-16 overflow-hidden shadow-xl animate-fade-in">
          {category.image && (
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-slate-900/90" />
            </div>
          )}
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/20 px-3 py-1 rounded-full text-accent font-semibold text-xs uppercase tracking-wider">
              <Wrench className="w-4 h-4 mr-1 text-accent" />
              Professional Service
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {category.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                <Link href="/inspection">Book Free Inspection</Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-400 text-white hover:bg-white hover:text-dark font-bold rounded-xl px-6 py-5 text-sm sm:text-base">
                <Link href="/quote">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features List */}
        {features.length > 0 && (
          <div className="mb-16 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-accent" />
              Core Features &amp; Benefits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-sm text-slate-700 font-medium bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subcategories Grid */}
        {subcategories.length > 0 && (
          <div className="space-y-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary border-l-4 border-accent pl-4">
              Our {category.name} Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {subcategories.map((sub: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                >
                  {sub.image && (
                    <div className="relative h-48 w-full shrink-0">
                      <Image
                        src={sub.image}
                        alt={sub.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <h3 className="absolute bottom-4 left-6 text-white font-serif text-lg font-bold leading-tight">
                        {sub.name}
                      </h3>
                    </div>
                  )}
                  {!sub.image && (
                    <div className="p-6 pb-0">
                      <h3 className="font-serif text-lg font-bold text-primary">{sub.name}</h3>
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    {sub.desc && (
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sub.desc}</p>
                    )}
                    <div className="space-y-2">
                      {(sub.thickness || sub.warranty || sub.specification) && (
                        <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                          {sub.thickness && (
                            <span className="bg-primary-light text-primary px-2 py-1 rounded-lg">
                              Thickness: {sub.thickness}
                            </span>
                          )}
                          {sub.warranty && (
                            <span className="bg-accent/10 text-accent px-2 py-1 rounded-lg">
                              Warranty: {sub.warranty}
                            </span>
                          )}
                          {sub.specification && (
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                              {sub.specification}
                            </span>
                          )}
                        </div>
                      )}
                      <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white font-bold rounded-xl py-2 text-xs">
                        <Link href="/inspection">Book Free Inspection</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No subcategories placeholder */}
        {subcategories.length === 0 && (
          <div className="text-center py-16 text-slate-400 italic">
            <Wrench className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Detailed service information coming soon.</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md space-y-6 mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
            Ready to Get Started with {category.name}?
          </h2>
          <p className="text-slate-200 text-sm max-w-xl mx-auto leading-relaxed">
            Our expert team will assess your requirements and provide a customized solution with the best materials and execution quality.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-8 py-6 text-base">
              <Link href="/inspection">Book Free Site Audit</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-400 text-white hover:bg-white hover:text-dark font-bold rounded-xl px-8 py-6 text-base">
              <Link href="/quote">Get Free Estimate <ArrowRight className="ml-2 w-4 h-4 inline" /></Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
