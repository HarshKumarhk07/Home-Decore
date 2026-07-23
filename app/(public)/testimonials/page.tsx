import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import { Star, Quote, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { reviewSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Reviews & Case Studies",
  description: "Read verified feedback from home owners, building developers, and office managers who hired Homes Decorator for PVC, waterproofing, or flooring across Haryana & Delhi NCR.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  let list: any[] = [];

  try {
    await connectToDatabase();
    const dbTestimonials = await Testimonial.find({ isApproved: true }).sort({ createdAt: -1 }).lean();
    list = dbTestimonials.map((t: any) => ({
      ...t,
      _id: t._id.toString(),
      createdAt: t.createdAt?.toISOString() || null,
      updatedAt: t.updatedAt?.toISOString() || null,
    }));
  } catch (err) {
    console.error("Failed to query testimonials for page:", err);
  }

  const reviewsForSchema = list.map((r: any) => ({
    author: r.clientName,
    rating: r.rating,
    body: r.feedbackText,
    date: r.createdAt || undefined,
  }));

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      {reviewsForSchema.length > 0 && (
        <JsonLd data={reviewSchema(reviewsForSchema)} />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <Breadcrumbs
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Reviews", path: "/testimonials" },
          ]}
        />
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary">
            Customer Testimonials
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Verified reviews and case studies from homeowners and building managers. We stand by our durability commitments.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {list.map((review, idx) => (
            <div
              key={review._id || idx}
              className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow duration-300 relative space-y-6"
            >
              {/* Quote Icon overlay */}
              <div className="absolute right-6 top-6 text-slate-100 pointer-events-none">
                <Quote className="w-12 h-12 rotate-180" />
              </div>

              <div className="space-y-4 relative z-10">
                {/* Rating */}
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-accent fill-accent" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-650 leading-relaxed italic">
                  &ldquo;{review.feedbackText}&rdquo;
                </p>
              </div>

              {/* Profile card */}
              <div className="flex items-center space-x-4 border-t border-slate-100 pt-4 mt-auto">
                {review.avatar && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-accent/20">
                    <Image
                      src={review.avatar}
                      alt={review.clientName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-bold text-primary text-sm sm:text-base">
                    {review.clientName}
                  </h4>
                  <span className="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                    {review.serviceReceived}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md space-y-6">
          <ShieldCheck className="w-12 h-12 text-accent mx-auto animate-pulse" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
            Ready to Experience Professional Durability?
          </h2>
          <p className="text-slate-200 text-sm max-w-xl mx-auto leading-relaxed">
            Get your home assessed by our specialists. We locate the root causes of leakage and dampness.
          </p>
          <div className="pt-2">
            <Button asChild className="bg-accent hover:bg-accent-hover text-dark font-bold rounded-xl px-8 py-6 text-base">
              <Link href="/inspection">
                Book Site Inspection Now <ArrowRight className="w-5 h-5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
