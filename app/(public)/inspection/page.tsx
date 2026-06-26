import InspectionForm from "@/components/forms/InspectionForm";
import { ShieldCheck, Flame, Compass, Wrench } from "lucide-react";

export const metadata = {
  title: "Book Free Site Inspection | Homesdecorator",
  description: "Schedule a free technical inspection of your property to analyze seepage, wood flooring bases, or wall shade requirements.",
};

export default function InspectionPage() {
  const valueProps = [
    { icon: <ShieldCheck className="w-5 h-5 text-accent" />, title: "Moisture Tests", desc: "No guesses. We check structural slabs with thermal scanning meters." },
    { icon: <Compass className="w-5 h-5 text-accent" />, title: "Expert Engineers", desc: "Inspection is executed by qualified waterproofing & civil professionals." },
    { icon: <Wrench className="w-5 h-5 text-accent" />, title: "Written Advice", desc: "Receive a detailed evaluation report and chemical specifications free of cost." },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Details Sidebar */}
          <div className="space-y-8 lg:col-span-1">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-primary-light px-3 py-1 rounded-none text-primary">
                Free Service
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                Schedule Site Inspection
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter your details to request a professional inspection. Our field engineer will visit your property with scanning devices to diagnose seepage or evaluate wood flooring bases.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-200">
              {valueProps.map((prop, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-white p-4 rounded-none border border-slate-100 shadow-sm">
                  <div className="p-2 bg-primary-light rounded-none text-primary shrink-0">
                    {prop.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{prop.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{prop.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-none p-6 sm:p-10 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-primary mb-6">Inspection Details</h3>
            <InspectionForm />
          </div>
        </div>
      </div>
    </div>
  );
}
