"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const servicesList = [
  { name: "Waterproofing", href: "/services/waterproofing" },
  { name: "Wooden Flooring", href: "/services/wooden-flooring" },
  { name: "PVC (Polyvinyl Chloride)", href: "/services/pvc" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const pathname = usePathname();

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
      className="fixed top-0 left-0 right-0 z-50 bg-white opacity-100 border-b border-slate-200 shadow-md py-3 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 bg-primary rounded-lg text-white group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-primary">
                Home <span className="text-accent">Decorater</span>
              </span>
              <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-gray-500 -mt-1">
                Waterproofing & Flooring
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname === "/" ? "text-primary font-semibold" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname === "/about" ? "text-primary font-semibold" : "text-gray-700"
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-accent ${
                  pathname.startsWith("/services") ? "text-primary font-semibold" : "text-gray-700"
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute left-0 mt-2 w-52 rounded-xl bg-white shadow-xl ring-1 ring-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50">
                <div className="py-2 px-1">
                  {servicesList.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className={`block px-4 py-2 text-sm rounded-lg hover:bg-primary-light hover:text-primary transition-colors ${
                        pathname === service.href ? "bg-primary-light text-primary font-semibold" : "text-gray-700"
                      }`}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  pathname === link.href ? "text-primary font-semibold" : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="tel:+919999999999" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              <div className="p-2 bg-primary-light rounded-full text-primary">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-semibold">+91 99999 99999</span>
            </Link>
            <Button asChild className="bg-primary hover:bg-primary-hover text-white font-semibold shadow-md border border-primary/20 rounded-xl px-5">
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
          isOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"
        } overflow-hidden bg-white border-t border-gray-100 shadow-inner`}
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
            <div className={`pl-4 space-y-1 transition-all duration-200 overflow-hidden ${activeDropdown ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
              {servicesList.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === service.href ? "text-primary font-bold bg-primary-light/50" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.name}
              href={link.href}
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
