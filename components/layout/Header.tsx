"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const pathname = usePathname();

  const servicesList = categories && categories.length > 0
    ? categories.map((cat: any) => ({
        name: cat.name,
        href: `/services/${cat.slug}`,
        subcategories: cat.subcategories.map((sub: any) => sub.name)
      }))
    : [
        { name: "Waterproofing", href: "/services/waterproofing", subcategories: settings?.waterproofingSubcategories || [] },
        { name: "Wooden Flooring", href: "/services/wooden-flooring", subcategories: settings?.flooringSubcategories || [] },
        { name: "PVC (Polyvinyl Chloride)", href: "/services/pvc", subcategories: settings?.pvcSubcategories || [] },
      ];

  useEffect(() => {
    async function loadData() {
      try {
        const { getSettings, getServiceCategories } = await import("@/actions/cmsActions");
        const res = await getSettings();
        if (res.success) {
          setSettings(res.settings);
        }
        const catsRes = await getServiceCategories();
        if (catsRes.success) {
          setCategories(catsRes.categories);
        }
      } catch (error) {
        console.error("Error loading header data:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white",
        isScrolled
          ? "border-slate-200/80 shadow-lg py-1"
          : "border-slate-100 shadow-sm py-2"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <Image
              src="/logo.PNG"
              alt="Homesdecorator Logo"
              width={160}
              height={160}
              className={cn(
                "w-auto object-contain transition-all duration-300 group-hover:scale-105",
                isScrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
              )}
              priority
            />
            <span className="font-sans font-extrabold text-black uppercase tracking-tight leading-none text-sm sm:text-sm lg:text-sm whitespace-nowrap">
              HomesDecorator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              href="/"
              className={cn(
                "relative py-1.5 text-sm font-semibold transition-colors duration-200 hover:text-primary group/nav",
                pathname === "/" ? "text-primary" : "text-slate-600"
              )}
            >
              <span>Home</span>
              <span className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                pathname === "/" ? "w-full" : "w-0 group-hover/nav:w-full"
              )} />
            </Link>
            <Link
              href="/about"
              className={cn(
                "relative py-1.5 text-sm font-semibold transition-colors duration-200 hover:text-primary group/nav",
                pathname === "/about" ? "text-primary" : "text-slate-600"
              )}
            >
              <span>About Us</span>
              <span className={cn(
                "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                pathname === "/about" ? "w-full" : "w-0 group-hover/nav:w-full"
              )} />
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className={cn(
                  "relative py-1.5 flex items-center space-x-1 text-sm font-semibold transition-colors duration-200 hover:text-primary group/nav",
                  pathname.startsWith("/services") ? "text-primary" : "text-slate-600"
                )}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                  pathname.startsWith("/services") ? "w-full" : "w-0 group-hover/nav:w-full"
                )} />
              </button>

              <div className="absolute left-0 mt-3 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="py-1 divide-y divide-slate-100">
                  {servicesList.map((service) => {
                    const subList = service.subcategories;

                    return (
                      <div key={service.name} className="py-2 first:pt-0 last:pb-0 px-1">
                        <Link
                          href={service.href}
                          className={`block px-3 py-1.5 text-sm font-bold rounded-xl hover:bg-primary-light hover:text-primary transition-colors ${
                            pathname === service.href ? "bg-primary-light text-primary" : "text-slate-800"
                          }`}
                        >
                          {service.name}
                        </Link>
                        {subList && subList.length > 0 && (
                          <div className="mt-1 pl-3 space-y-0.5 border-l border-slate-100 ml-3">
                            {subList.map((sub: string) => (
                              <Link
                                key={sub}
                                href={service.href}
                                className="text-[11px] text-slate-500 hover:text-primary hover:font-semibold transition-colors cursor-pointer truncate py-0.5 block"
                                title={sub}
                              >
                                • {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                prefetch={link.href === "/testimonials" ? false : undefined}
                className={cn(
                  "relative py-1.5 text-sm font-semibold transition-colors duration-200 hover:text-primary group/nav",
                  pathname === link.href ? "text-primary" : "text-slate-600"
                )}
              >
                <span>{link.name}</span>
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover/nav:w-full"
                )} />
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-5">
            <Link href="tel:+919999999999" className="flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-primary group transition-colors duration-200">
              <div className="p-2 bg-primary-light group-hover:bg-primary group-hover:text-white rounded-full text-primary transition-all duration-300">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-bold">+91 99999 99999</span>
            </Link>
            <Button asChild className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white font-bold shadow-[0_4px_14px_rgba(30,64,175,0.25)] hover:shadow-[0_4px_20px_rgba(30,64,175,0.35)] hover:-translate-y-0.5 active:translate-y-0 rounded-xl px-5 py-2.5 transition-all duration-300 cursor-pointer">
              <Link href="/quote">Get Free Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[85vh] opacity-100 visible overflow-y-auto"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        } bg-white border-t border-gray-100 shadow-inner`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-xl text-base font-medium ${
              pathname === "/" ? "bg-primary-light text-primary font-bold" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`block px-3 py-2 rounded-xl text-base font-medium ${
              pathname === "/about" ? "bg-primary-light text-primary font-bold" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            About Us
          </Link>

          {/* Mobile Services Collapse */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveDropdown(!activeDropdown)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown ? "rotate-180" : ""}`} />
            </button>
            <div className={`pl-4 space-y-1 transition-all duration-300 overflow-hidden ${activeDropdown ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
              {servicesList.map((service) => {
                const subList = service.subcategories;

                return (
                  <div key={service.name} className="py-1">
                    <Link
                      href={service.href}
                      className={`block px-3 py-1.5 rounded-xl text-sm font-semibold ${
                        pathname === service.href ? "text-primary bg-primary-light/50 font-bold" : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {service.name}
                    </Link>
                    {subList && subList.length > 0 && (
                      <div className="pl-6 mt-0.5 space-y-0.5 border-l border-slate-100 ml-3">
                        {subList.map((sub: string) => (
                          <Link
                            key={sub}
                            href={service.href}
                            className="text-[11px] text-slate-500 hover:text-primary hover:font-semibold transition-colors py-0.5 block"
                          >
                            • {sub}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={link.href === "/testimonials" ? false : undefined}
              className={`block px-3 py-2 rounded-xl text-base font-medium ${
                pathname === link.href ? "bg-primary-light text-primary font-bold" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <Link href="tel:+919999999999" className="flex items-center space-x-3 px-3 py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors">
              <Phone className="w-5 h-5 text-primary" />
              <span>+91 99999 99999</span>
            </Link>
            <div className="px-3">
              <Button asChild className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-3 font-semibold shadow-md">
                <Link href="/quote">Get Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
