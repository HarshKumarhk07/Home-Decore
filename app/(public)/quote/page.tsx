import QuoteForm from "@/components/forms/QuoteForm";
import { ShieldCheck, Sparkles, Clock, Coins } from "lucide-react";

export const metadata = {
  title: "Get Free Quote | Home Decorater",
  description: "Request a detailed square-foot quote for PVC (Polyvinyl Chloride), structural waterproofing, or floor installations.",
};

export default function QuotePage() {
  const trustMetrics = [
    { icon: <Coins className="w-5 h-5 text-accent" />, text: "Detailed material & Sq Ft breakdown" },
    { icon: <Clock className="w-5 h-5 text-accent" />, text: "Sent within 24 hours of site check" },
    { icon: <ShieldCheck className="w-5 h-5 text-accent" />, text: "Includes stamped warranty details" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-primary-light px-3 py-1 rounded-full text-primary">
            Request Callback
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            Request a Free Estimate
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Fill out the form below detailing your area specifications, service requirements, and budget parameters. We will evaluate your data and schedule a site call.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <QuoteForm />
        </div>

        {/* Bottom Trust Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
          {trustMetrics.map((metric, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-2 bg-primary-light rounded-xl text-primary shrink-0">
                {metric.icon}
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-snug">{metric.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
