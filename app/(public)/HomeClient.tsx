"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Phone,
  ArrowRight,
  Award,
  Sparkles,
  Layers,
  Wrench,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { FaWhatsapp } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import InspectionForm from "@/components/forms/InspectionForm";

function Counter({
  value,
  duration = 1.5,
  suffix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  // once:true so the count-up runs reliably the first time it enters view and then stays put
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let rafId: number;
    let startTime: number | null = null;
    const durationMs = duration * 1000;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / durationMs, 1);
      // easeOutCubic for a fast-then-settle feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setCount(value);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

interface HomeClientProps {
  projects: any[];
  testimonials: any[];
  faqs: any[];
  settings?: any;
  categories?: any[];
}

export default function HomeClient({
  projects,
  testimonials,
  faqs,
  settings,
  categories = [],
}: HomeClientProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // Show popup on initial mount if not seen this session
    const hasSeen = sessionStorage.getItem("hasSeenPopup");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsPopupOpen(true);
        sessionStorage.setItem("hasSeenPopup", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const services =
    categories && categories.length > 0
      ? categories.map((cat: any) => ({
          title: cat.name,
          href: `/services/${cat.slug}`,
          desc: cat.description,
          items: cat.subcategories.slice(0, 5).map((sub: any) => sub.name),
          bg: cat.image,
        }))
      : [
          {
            title: "Waterproofing",
            href: "/services/waterproofing",
            desc: "Scientific waterproofing solutions to seal structural leakage, damp walls, and roof cracks. Up to 10 years warranty.",
            items:
              settings?.waterproofingSubcategories &&
              settings.waterproofingSubcategories.length > 0
                ? settings.waterproofingSubcategories
                : [
                    "Roof Waterproofing",
                    "Terrace Waterproofing",
                    "Bathroom Waterproofing",
                    "Basement Waterproofing",
                    "Water Tank Waterproofing",
                  ],
            bg: "/waterproofing.jpg",
          },
          {
            title: "Wooden Flooring",
            href: "/services/wooden-flooring",
            desc: "Premium wood and vinyl planks laid with scratch-resistant German technology. 100% moisture-proof options.",
            items:
              settings?.flooringSubcategories &&
              settings.flooringSubcategories.length > 0
                ? settings.flooringSubcategories
                : [
                    "Laminate Flooring",
                    "Vinyl Flooring",
                    "SPC Click-lock Flooring",
                    "Engineered Wood Flooring",
                  ],
            bg: "/wooden flooring.jpg",
          },
          {
            title: "PVC (Polyvinyl Chloride)",
            href: "/services/pvc",
            desc: "Premium water-resistant PVC wall cladding panels and SPC flooring solutions designed for long-lasting structural hygiene and elegance.",
            items:
              settings?.pvcSubcategories && settings.pvcSubcategories.length > 0
                ? settings.pvcSubcategories
                : [
                    "SPC Click Flooring",
                    "LVT / LVP Planks",
                    "Roll & Sheet PVC",
                    "ESD Anti-Static PVC",
                    "PVC Wall Cladding",
                  ],
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
    {
      num: "01",
      title: "Free Site Inspection",
      desc: "Book an inspection. Our expert arrives with scanning meters to examine leaks and flooring bases.",
    },
    {
      num: "02",
      title: "Customized Quotation",
      desc: "Receive a transparent pricing breakdown with material specifications, warranties, and timelines.",
    },
    {
      num: "03",
      title: "Expert Project Execution",
      desc: "Our skilled workforce protects your assets, applies waterproof membranes, lays flooring, or paints walls.",
    },
    {
      num: "04",
      title: "Quality Audit & Handover",
      desc: "Final inspection, cleaning, structural validation, and handover of your warranty certificate.",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-dark text-white pt-12 pb-24 sm:pt-20">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8">
            {/* Left Column: Copy & CTAs */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-8"
            >
              {/* Top Label */}
              <motion.div variants={itemVariants} className="space-y-2">
                <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-300 uppercase">
                  TRUSTED WATERPROOFING SPECIALISTS
                </p>
                <div className="w-16 h-[2px] bg-[#D4AF37]" />
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] text-white tracking-tight"
              >
                Protect Every Corner of Your <br />
                <span className="text-[#D4AF37] italic">Dream Home.</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm md:text-base text-slate-350 max-w-2xl leading-relaxed font-light"
              >
                Advanced waterproofing, premium flooring, wall painting, and PVC
                solutions delivered by certified experts using industry-leading
                materials backed by long-term warranties.
              </motion.p>

              {/* Quick Service Cards — horizontally scrollable */}
              <motion.div variants={itemVariants}>
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {services.slice(0, 4).map((svc, idx) => (
                    <Link
                      key={idx}
                      href={svc.href}
                      className="snap-start shrink-0 w-32 sm:w-40 rounded-xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm hover:border-[#D4AF37]/40 transition-all duration-300 group"
                    >
                      <div className="relative h-20 sm:h-24 w-full overflow-hidden">
                        <Image
                          src={svc.bg}
                          alt={svc.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-3 py-2">
                        <span className="text-xs sm:text-sm font-semibold text-white leading-tight line-clamp-2">
                          {svc.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4 pt-2"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary-hover text-white px-8 py-6 rounded-lg font-bold shadow-lg border border-primary/20 text-base cursor-pointer transition-all duration-300"
                  >
                    <Link href="/quote">Get Free Quote</Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 hover:border-white hover:bg-white/10 text-white px-8 py-6 rounded-lg font-bold text-base transition-all duration-300 cursor-pointer"
                  >
                    <Link href="/inspection">Book Site Inspection</Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Statistics Row */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-stretch justify-between gap-y-6 gap-x-4 py-8 border-y border-white/10 my-4"
              >
                <div className="flex-1 min-w-[120px] flex flex-col justify-center text-left">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    <Counter value={2500} suffix="+" />
                  </span>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                    Projects Completed
                  </p>
                </div>

                <div className="hidden md:block w-[1px] bg-white/10 self-stretch" />

                <div className="flex-1 min-w-[120px] flex flex-col justify-center text-left md:pl-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    <Counter value={10} suffix="+" />
                  </span>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                    Years Experience
                  </p>
                </div>

                <div className="hidden md:block w-[1px] bg-white/10 self-stretch" />

                <div className="flex-1 min-w-[120px] flex flex-col justify-center text-left md:pl-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    <Counter value={98} suffix="%" />
                  </span>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                    Customer Satisfaction
                  </p>
                </div>
              </motion.div>

              {/* Trust Strip */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold tracking-wider text-slate-300 py-2"
              >
                <span>Certified Applicators</span>
                <span className="text-[#D4AF37]">•</span>
                <span>ISO Quality Materials</span>
                <span className="text-[#D4AF37]">•</span>
                <span>PAN India Service</span>
                <span className="text-[#D4AF37]">•</span>
                <span>Free Site Inspection</span>
              </motion.div>

              {/* Contact Strip */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10 text-xs sm:text-sm text-slate-400"
              >
                <div className="flex flex-col space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Call Us
                  </span>
                  <a
                    href="tel:+917743040191"
                    className="text-white hover:text-[#D4AF37] font-bold text-sm transition-colors"
                  >
                    +91 7743040191
                  </a>
                </div>

                <div className="flex flex-col space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    WhatsApp Support
                  </span>
                  <a
                    href="https://wa.me/917743040191?text=Hi!%20I%20want%20to%20know%20more%20about%20Home%20Decorater%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#D4AF37] font-bold text-sm transition-colors"
                  >
                    Chat with Experts
                  </a>
                </div>

                <div className="flex flex-col space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Available
                  </span>
                  <span className="text-white font-bold text-sm">Mon–Sat</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Embedded Form Card */}
            <div className="lg:col-span-5 w-full mt-8 lg:-mt-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-none px-6 sm:px-8 pt-4 sm:pt-5 pb-6 sm:pb-8 shadow-[0_20px_50px_rgba(30,64,175,0.18)] text-slate-900 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(30,64,175,0.25)]"
              >
                <div className="mb-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-1">
                    Book Free Site Inspection
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Get moisture scan & site survey from certified specialists.
                  </p>
                </div>
                <InspectionForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SUMMARY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              Our Elite Service Categories
            </h2>
            <p className="text-slate-600">
              We operate exclusively in Waterproofing, Flooring, and PVC,
              allowing our engineering teams to maintain deep domain expertise.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
          >
            {services.map((svc, idx) => (
              <motion.div key={idx} variants={itemVariants} className="h-full">
                <Card className="group relative overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full bg-white rounded-2xl pt-0 pb-0 gap-0">
                  <div className="relative aspect-square sm:aspect-auto sm:h-48 md:h-56 w-full overflow-hidden">
                    <Image
                      src={svc.bg}
                      alt={svc.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <h3 className="absolute bottom-2 left-2 sm:bottom-4 sm:left-6 text-white font-serif text-sm sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                      {svc.title}
                    </h3>
                  </div>
                  <CardContent className="p-3 sm:p-5 md:p-6 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
                    <div className="space-y-2 sm:space-y-4">
                      <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 leading-relaxed line-clamp-2 md:line-clamp-none">
                        {svc.desc}
                      </p>
                      <ul className="hidden sm:block space-y-2">
                        {svc.items.map((it: string, itemIdx: number) => (
                          <li
                            key={itemIdx}
                            className="flex items-center space-x-2 text-sm text-slate-700 font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                            <span className="truncate">{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-1">
                      <Button
                        asChild
                        className="w-full bg-slate-900 hover:bg-primary text-white font-bold rounded-xl py-1.5 sm:py-3 text-[10px] sm:text-xs h-auto transition-all duration-300"
                      >
                        <Link href={svc.href}>
                          <span>Explore</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="bg-slate-50 border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={itemVariants}>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
                <Counter value={10} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">
                Years Experience
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
                <Counter value={2500} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">
                Projects Completed
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
                <Counter value={98} suffix="%" />
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">
                Satisfaction Rate
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary">
                <Counter value={10} suffix="-Yr" />
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">
                Stamp-Sealed Warranty
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Heading, description, action links */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6"
            >
              <span className="text-sm font-semibold tracking-wider text-primary uppercase block">
                Why HomesDecorator?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
                Why <span className="text-primary">Homes</span>
                <span className="text-[#D4AF37]">Decorator</span> is the
                Standard
              </h2>
              <p className="text-slate-650 text-sm sm:text-base leading-relaxed">
                We do not believe in short-cuts. We analyze the chemical
                properties of structural leakage and substrates to perform
                long-lasting modifications.
              </p>

              <div className="w-16 h-[2px] bg-accent"></div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
                <Link
                  href="/quote"
                  className="inline-flex items-center text-sm font-bold text-primary hover:text-accent group transition-colors duration-200"
                >
                  <span>Get Free Quote</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/inspection"
                  className="inline-flex items-center text-sm font-bold text-primary hover:text-accent group transition-colors duration-200"
                >
                  <span>Book a Service</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: 2-column features grid with line dividers */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-10 md:gap-y-12 relative"
            >
              {/* Left feature column */}
              <div className="space-y-10">
                {/* Feature 1 */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4 sm:space-x-5 group pb-8 border-b border-slate-300"
                >
                  <div className="relative w-14 h-14 rounded-none overflow-hidden shrink-0 border border-slate-200/80 shadow-sm group-hover:scale-105 transition-all duration-350 bg-white">
                    <Image
                      src="/Scientific Moisture Testing logo.jpg"
                      alt={whyChooseUs[0].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-primary tracking-tight leading-snug">
                      {whyChooseUs[0].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {whyChooseUs[0].desc}
                    </p>
                  </div>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4 sm:space-x-5 group"
                >
                  <div className="relative w-14 h-14 rounded-none overflow-hidden shrink-0 border border-slate-200/80 shadow-sm group-hover:scale-105 transition-all duration-350 bg-white">
                    <Image
                      src="/Written Long-term Warranty.jpg"
                      alt={whyChooseUs[1].title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-primary tracking-tight leading-snug">
                      {whyChooseUs[1].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {whyChooseUs[1].desc}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Vertical line divider on tablet/desktop */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-300 -translate-x-1/2" />

              {/* Right feature column */}
              <div className="space-y-10 md:pl-6 lg:pl-8">
                {/* Feature 3 */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4 sm:space-x-5 group pb-8 border-b border-slate-300"
                >
                  <div className="relative w-14 h-14 rounded-none overflow-hidden shrink-0 border border-slate-200/80 shadow-sm group-hover:scale-105 transition-all duration-350 bg-white">
                    <Image
                      src="/Expert Trained Crews.jpg"
                      alt={whyChooseUs[2].title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-primary tracking-tight leading-snug">
                      {whyChooseUs[2].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {whyChooseUs[2].desc}
                    </p>
                  </div>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-start space-x-4 sm:space-x-5 group"
                >
                  <div className="relative w-14 h-14 rounded-none overflow-hidden shrink-0 border border-slate-200/80 shadow-sm group-hover:scale-105 transition-all duration-350 bg-white">
                    <Image
                      src="/transparent-billing.jpg"
                      alt={whyChooseUs[3].title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-primary tracking-tight leading-snug">
                      {whyChooseUs[3].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {whyChooseUs[3].desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {projects.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                  Featured Client Projects
                </h2>
                <p className="text-slate-600 max-w-xl">
                  Inspect some of our premium residential and commercial
                  assignments completed across the metropolitan area.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center text-sm font-bold text-primary hover:text-accent mt-4 sm:mt-0 transition-colors"
              >
                View All Projects <ExternalLink className="w-4 h-4 ml-1.5" />
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {projects.slice(0, 3).map((proj) => (
                <motion.div
                  key={proj.slug}
                  variants={itemVariants}
                  className="h-full flex flex-col"
                >
                  <Link
                    href={`/projects/${proj.slug}`}
                    className="group flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-square sm:aspect-auto sm:h-60 w-full overflow-hidden">
                      <Image
                        src={proj.images[0]}
                        alt={proj.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-accent/90 backdrop-blur-sm text-dark px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-bold uppercase tracking-wider shadow">
                        {proj.category.replace("-", " ")}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="font-serif text-sm sm:text-lg font-bold text-primary group-hover:text-accent transition-colors duration-200 line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 flex items-center">
                          <span className="font-semibold text-slate-700">
                            Location:
                          </span>{" "}
                          &nbsp;{proj.location}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                          {proj.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-primary border-t border-slate-100 pt-3 sm:pt-4 mt-auto">
                        <span>Area: {proj.areaCovered}</span>
                        <span>Warranty: {proj.warranty.split(" ")[0]} Yrs</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* WORK PROCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
              Our Step-by-Step Process
            </h2>
            <p className="text-slate-600">
              We make home improvement clean, organized, and stress-free. Here
              is what to expect when you partner with us.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 relative"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(30,64,175,0.05)] hover:-translate-y-1.5"
              >
                <span className="font-serif text-6xl font-black bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent group-hover:from-accent/30 group-hover:to-accent/10 transition-all duration-300 block mb-5 select-none">
                  {step.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-slate-200/60 z-10 group-hover:bg-accent/40 transition-colors duration-300" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-4"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                What Our Clients Say
              </h2>
              <p className="text-slate-400">
                Thousands of homeowners, apartments, and corporate complexes
                rely on our durability standards.
              </p>
            </motion.div>
          </div>

          <div className="relative overflow-hidden w-full py-8">
            {/* Left & Right gradient overlays for smooth fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-900 via-slate-900/40 to-transparent z-10 pointer-events-none"></div>

            <div className="flex space-x-6 w-max animate-marquee-ltr hover:[animation-play-state:paused] py-2">
              {[...testimonials, ...testimonials, ...testimonials].map(
                (t, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] sm:w-[400px] shrink-0 dark-glassmorphism p-8 rounded-2xl flex flex-col justify-between h-[280px] space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex space-x-1 text-accent">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i} className="text-xl">
                            &#9733;
                          </span>
                        ))}
                      </div>
                      <p className="text-sm sm:text-base text-slate-300 italic leading-relaxed">
                        &ldquo;{t.feedbackText}&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 border-t border-slate-800/80 pt-4">
                      {t.avatar && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-accent/25">
                          <Image
                            src={t.avatar}
                            alt={t.clientName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif font-bold text-white text-sm sm:text-base">
                          {t.clientName}
                        </h4>
                        <p className="text-[11px] text-accent uppercase tracking-wider font-semibold">
                          {t.serviceReceived}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      {faqs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600">
                Find answers to general questions about our processes,
                warranties, and inspection protocols.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              {faqs.map((faq, idx) => {
                const isSelected = activeFaq === idx;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="border border-slate-100 rounded-xl overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <button
                      suppressHydrationWarning
                      onClick={() => setActiveFaq(isSelected ? null : idx)}
                      className="flex items-center justify-between w-full p-5 text-left font-serif font-bold text-primary hover:bg-slate-50 transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${isSelected ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`transition-all duration-300 overflow-hidden ${isSelected ? "max-h-96" : "max-h-0"}`}
                    >
                      <div className="p-5 border-t border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50/50">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8"
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Ready to Protect & Beautify Your Home?
          </h2>
          <p className="text-slate-200 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Schedule your 100% free structural site moisture assessment. Get a
            warranty-locked quotation from our specialized engineers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-accent hover:bg-accent-hover text-dark px-8 py-6 rounded-xl font-bold text-base shadow-lg"
            >
              <Link href="/inspection">Book Site Inspection</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-6 rounded-xl font-bold text-base"
            >
              <Link href="/quote">Get Free Estimate</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Pop-up Site Inspection Form on website load */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="sm:max-w-md p-6 max-h-[90vh] overflow-y-auto bg-white border border-slate-200/60 rounded-none shadow-2xl">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-serif text-2xl font-bold text-primary">
              Book Free Site Inspection
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs sm:text-sm">
              Schedule your 100% free moisture assessment and structural scan
              today.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <InspectionForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
