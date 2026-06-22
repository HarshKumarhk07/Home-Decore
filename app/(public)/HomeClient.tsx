"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Phone,
  MessageSquare,
  ArrowRight,
  Award,
  Sparkles,
  Layers,
  Wrench,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import { Card, CardContent } from "@/components/ui/card";
import { FaWhatsapp } from "react-icons/fa";

interface HomeClientProps {
  projects: any[];
  testimonials: any[];
  faqs: any[];
}

export default function HomeClient({ projects, testimonials, faqs }: HomeClientProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  const services = [
    {
      title: "Waterproofing",
      href: "/services/waterproofing",
      desc: "Scientific waterproofing solutions to seal structural leakage, damp walls, and roof cracks. Up to 10 years warranty.",
      items: ["Roof Waterproofing", "Terrace Waterproofing", "Bathroom Waterproofing", "Basement Waterproofing", "Water Tank Waterproofing"],
      bg: "/waterproofing.jpg",
    },
    {
      title: "Wooden Flooring",
      href: "/services/wooden-flooring",
      desc: "Premium wood and vinyl planks laid with scratch-resistant German technology. 100% moisture-proof options.",
      items: ["Laminate Flooring", "Vinyl Flooring", "SPC Click-lock Flooring", "Engineered Wood Flooring"],
      bg: "/wooden flooring.jpg",
    },
    {
      title: "PVC (Polyvinyl Chloride)",
      href: "/services/pvc",
      desc: "Premium water-resistant PVC wall cladding panels and SPC flooring solutions designed for long-lasting structural hygiene and elegance.",
      items: ["SPC Click Flooring", "LVT / LVP Planks", "Roll & Sheet PVC", "ESD Anti-Static PVC", "PVC Wall Cladding"],
      bg: "/PVC (Polyvinyl Chloride).jpg",
    },
  ];

  const whyChooseUs = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-accent" />,
      title: "Scientific Moisture Testing",
      desc: "We scan walls with thermal moisture meters before applying any coats, fixing the root cause of paint failure.",
    },
    {
      icon: <Award className="w-8 h-8 text-accent" />,
      title: "Written Long-term Warranty",
      desc: "Sleep easy with up to 10-year stamp-sealed warranties covering leaks, dampness, and coating adhesion.",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-accent" />,
      title: "Expert Trained Crews",
      desc: "Our installers and painters are trained directly by brand teams to execute works with zero-dust dustless sanding.",
    },
    {
      icon: <ThumbsUp className="w-8 h-8 text-accent" />,
      title: "100% Transparent Billing",
      desc: "Detailed square-foot estimates, no hidden material charges, and direct brand-certified product usage.",
    },
  ];

  const steps = [
    { num: "01", title: "Free Site Inspection", desc: "Book an inspection. Our expert arrives with scanning meters to examine leaks and flooring bases." },
    { num: "02", title: "Customized Quotation", desc: "Receive a transparent pricing breakdown with material specifications, warranties, and timelines." },
    { num: "03", title: "Expert Project Execution", desc: "Our skilled workforce protects your assets, applies waterproof membranes, lays flooring, or paints walls." },
    { num: "04", title: "Quality Audit & Handover", desc: "Final inspection, cleaning, structural validation, and handover of your warranty certificate." },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-dark text-white overflow-hidden py-20">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"
            alt="Premium Home Design"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-accent/20"
            >
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-accent">
                Premium Home Transformations
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white tracking-tight"
            >
              Professional <span className="text-accent">Waterproofing</span>, Flooring & PVC
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              Protect, decorate, and elevate your space. Scientific execution, brand-certified materials, and up to 10-year written warranties.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button asChild className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-xl font-bold shadow-lg border border-primary/20 text-base">
                <Link href="/quote">Get Free Quote</Link>
              </Button>
              
              <Button asChild variant="outline" className="bg-slate-900/60 backdrop-blur-sm border-accent hover:bg-accent hover:text-dark text-white px-8 py-6 rounded-xl font-bold text-base transition-all duration-300">
                <Link href="/inspection">
                  <Calendar className="w-5 h-5 mr-2" /> Book Site Inspection
                </Link>
              </Button>
            </motion.div>

            {/* Direct Connect Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-6 text-sm text-slate-400"
            >
              <Link href="tel:+919999999999" className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                <Phone className="w-4 h-4 text-accent animate-bounce" />
                <span>Call Now: <strong>+91 99999 99999</strong></span>
              </Link>
              <a
                href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20know%20more%20about%20Home%20Decorater%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
              >
                <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: <strong>Chat with Experts</strong></span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="bg-slate-50 border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">15+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Years Experience</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">1,200+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Projects Completed</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">100%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Satisfaction Rate</p>
            </div>
            <div>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">10-Yr</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">Stamp-Sealed Warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              Why Home Decorater is the Standard
            </h2>
            <p className="text-slate-600">
              We do not believe in short-cuts. We analyze the chemical properties of structural leakage and substrates to perform long-lasting modifications.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {whyChooseUs.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="p-3 bg-primary-light rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SUMMARY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Our Elite Service Categories</h2>
            <p className="text-slate-600">
              We operate exclusively in Waterproofing, Flooring, and PVC, allowing our engineering teams to maintain deep domain expertise.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {services.map((svc, idx) => (
              <Card key={idx} className="overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white rounded-2xl">
                <div className="relative h-56 w-full">
                  <Image src={svc.bg} alt={svc.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-6 text-white font-serif text-2xl font-bold">{svc.title}</h3>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{svc.desc}</p>
                    <ul className="space-y-2">
                      {svc.items.map((it, itemIdx) => (
                        <li key={itemIdx} className="flex items-center space-x-2 text-sm text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6">
                    <Button asChild className="w-full bg-slate-900 hover:bg-primary text-white font-semibold rounded-xl transition-colors duration-300">
                      <Link href={svc.href}>
                        Explore {svc.title} <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER SHOWCASE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary-light px-3 py-1 rounded-full text-primary font-semibold text-xs uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5 mr-1 text-accent" /> Before / After Transformation
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary leading-tight">
                Inspect the Power of Scientific Restoration
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Swipe left and right to inspect the effectiveness of our structural terrace membrane treatment. We strip away loose plaster, apply high-adhesion chemical layers, and lay topcoats that make buildings completely leakproof.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Cures wall dampness and flaking paint permanently</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Stops chemical decay and reinforcement corrosion</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span>Includes written warranty certificate</span>
                </div>
              </div>
              <div className="pt-4">
                <Button asChild className="bg-primary hover:bg-primary-hover text-white rounded-xl px-6 py-5 font-semibold">
                  <Link href="/gallery">View Full Gallery</Link>
                </Button>
              </div>
            </div>
            <div className="px-1 py-4 bg-slate-50 border border-slate-100 rounded-3xl">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800"
                afterImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
                beforeLabel="Leaking Damp Concrete"
                afterLabel="Waterproof Polyurethane Finish"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {projects.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Featured Client Projects</h2>
                <p className="text-slate-600 max-w-xl">
                  Inspect some of our premium residential and commercial assignments completed across the metropolitan area.
                </p>
              </div>
              <Link href="/projects" className="inline-flex items-center text-sm font-bold text-primary hover:text-accent mt-4 sm:mt-0 transition-colors">
                View All Projects <ExternalLink className="w-4 h-4 ml-1.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {projects.map((proj) => (
                <Link key={proj.slug} href={`/projects/${proj.slug}`} className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={proj.images[0]}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-dark px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow">
                      {proj.category.replace("-", " ")}
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif text-lg font-bold text-primary group-hover:text-accent transition-colors duration-200 line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center">
                      <span className="font-semibold text-slate-700">Location:</span> &nbsp;{proj.location}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2">{proj.description}</p>
                    <div className="flex justify-between items-center text-xs font-bold text-primary border-t border-slate-100 pt-4">
                      <span>Area: {proj.areaCovered}</span>
                      <span>Warranty: {proj.warranty.split(" ")[0]} Yrs</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WORK PROCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Our Step-by-Step Process</h2>
            <p className="text-slate-600">
              We make home improvement clean, organized, and stress-free. Here is what to expect when you partner with us.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-primary/10 transition-all duration-300 shadow-sm">
                <span className="font-serif text-5xl font-black text-slate-200 group-hover:text-accent/30 transition-colors duration-300 block mb-4">
                  {step.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                What Our Clients Say
              </h2>
              <p className="text-slate-400">
                Thousands of homeowners, apartments, and corporate complexes rely on our durability standards.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {testimonials.map((t, idx) => (
                <div key={idx} className="dark-glassmorphism p-8 rounded-2xl flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex space-x-1 text-accent">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span key={i} className="text-xl">&#9733;</span>
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-slate-300 italic leading-relaxed">
                      &ldquo;{t.feedbackText}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 border-t border-slate-800/80 pt-4">
                    {t.avatar && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-accent/25">
                        <Image src={t.avatar} alt={t.clientName} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-white text-sm sm:text-base">{t.clientName}</h4>
                      <p className="text-[11px] text-accent uppercase tracking-wider font-semibold">{t.serviceReceived}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      {faqs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Frequently Asked Questions</h2>
              <p className="text-slate-600">
                Find answers to general questions about our processes, warranties, and inspection protocols.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isSelected = activeFaq === idx;
                return (
                  <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                    <button
                      onClick={() => setActiveFaq(isSelected ? null : idx)}
                      className="flex items-center justify-between w-full p-5 text-left font-serif font-bold text-primary hover:bg-slate-50 transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${isSelected ? "rotate-180" : ""}`} />
                    </button>
                    <div className={`transition-all duration-300 overflow-hidden ${isSelected ? "max-h-96" : "max-h-0"}`}>
                      <div className="p-5 border-t border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50/50">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="relative bg-primary text-white py-20 overflow-hidden">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/PVC (Polyvinyl Chloride).jpg"
            alt="Beautiful PVC Flooring"
            fill
            className="object-cover opacity-15"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Ready to Protect & Beautify Your Home?
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Schedule your 100% free structural site moisture assessment. Get a warranty-locked quotation from our specialized engineers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-accent hover:bg-accent-hover text-dark px-8 py-6 rounded-xl font-bold text-base shadow-lg">
              <Link href="/inspection">Book Site Inspection</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-6 rounded-xl font-bold text-base">
              <Link href="/quote">Get Free Estimate</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
