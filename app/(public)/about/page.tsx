import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Award, Sparkles, Clock, Hammer, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Home Decorater",
  description: "Learn about Home Decorater's history, team dedication, and scientific moisture scanning process for waterproofing, flooring, and PVC.",
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-accent" />,
      title: "Scientific Integrity",
      desc: "We analyze structural layouts with thermal moisture scanners and concrete meters instead of guessing.",
    },
    {
      icon: <Award className="w-6 h-6 text-accent" />,
      title: "Sealed Warranties",
      desc: "Every major contract receives a stamped structural warranty document outlining specific terms.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      title: "Specialized Crews",
      desc: "Our installers and PVC technicians work exclusively in their trained disciplines to maintain quality execution.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-primary-light px-3 py-1 rounded-none text-primary">
              Our Legacy
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-primary leading-tight animate-slide-up">
              Engineering Secure & Beautiful Spaces
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              At Home Decorater, we believe home improvement is a science, not a surface fix. Established with a commitment to solve structural water seepage, we expanded our competencies to premium wooden flooring installations and PVC wall panel cladding.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We employ directly-trained workers and use brand-certified products like Dr. Fixit polyurethane membranes, premium PVC cladding panels, and premium European SPC flooring planks. This ensures that every contract is completed to the highest standards.
            </p>
          </div>
          <div className="relative h-[300px] sm:h-[400px] rounded-none overflow-hidden shadow-lg border border-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
              alt="Premium Living space"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-primary text-white rounded-none p-8 sm:p-10 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent">15+</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-350 uppercase tracking-wider mt-1">Years in Industry</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent">1,200+</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-350 uppercase tracking-wider mt-1">Projects Completed</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent">45+</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-350 uppercase tracking-wider mt-1">Trained Field Personnel</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent">100%</p>
              <p className="text-[10px] sm:text-xs font-medium text-slate-350 uppercase tracking-wider mt-1">Warranty Validation</p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary text-center">
            Our Founding Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-6 sm:p-8 rounded-none shadow-sm text-center space-y-4">
                <div className="p-3 bg-primary-light rounded-none text-primary w-fit mx-auto">
                  {value.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-primary">{value.title}</h3>
                <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Connect CTA */}
        <div className="bg-white border border-slate-100 rounded-none p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">
            Need Expert Advice on Seepage or Renovations?
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Get in touch directly with our chief inspection engineer. Schedule a free site visit to scan concrete moisture or inspect wood flooring catalogs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary-hover text-white rounded-none px-8 py-6 font-bold shadow-md cursor-pointer">
              <Link href="/inspection">Book Free Site Visit</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700 rounded-none px-8 py-6 font-bold cursor-pointer">
              <Link href="/contact">Contact Our Office</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
