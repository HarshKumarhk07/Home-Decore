import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Mail, MapPin, Phone, Clock } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import { getServiceCategories } from "@/actions/cmsActions";

export default async function Footer() {
  const categoriesRes = await getServiceCategories();
  const categories = categoriesRes.success ? categoriesRes.categories : [];

  const displayCategories =
    categories.length > 0
      ? categories
      : [
          {
            name: "Waterproofing Solutions",
            slug: "waterproofing",
            subcategories: [
              { name: "Roof" },
              { name: "Terrace" },
              { name: "Basement" },
              { name: "Tanks" },
            ],
          },
          {
            name: "Wooden Flooring",
            slug: "wooden-flooring",
            subcategories: [
              { name: "Laminate" },
              { name: "Vinyl" },
              { name: "SPC" },
              { name: "Engineered" },
            ],
          },
          {
            name: "PVC (Polyvinyl Chloride)",
            slug: "pvc",
            subcategories: [
              { name: "SPC Flooring" },
              { name: "LVT Planks" },
              { name: "ESD Tiles" },
              { name: "Cladding" },
            ],
          },
        ];

  return (
    <footer className="bg-dark text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.PNG"
                alt="Homesdecorator Logo"
                width={160}
                height={45}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pt-2">
              Homesdecorator is a premier home improvement company specializing
              in Waterproofing, Wooden Flooring, and PVC (Polyvinyl Chloride)
              services. We guarantee premium quality with structural warranties.
            </p>
            <div className="flex space-x-4 pt-4">
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-6 border-l-2 border-accent pl-3">
              Our Services
            </h3>
            <ul className="space-y-3 text-sm">
              {displayCategories.map((cat: any) => (
                <li key={cat.slug || cat.name}>
                  <Link
                    href={`/services/${cat.slug}`}
                    className="hover:text-accent transition-colors duration-200 block"
                  >
                    {cat.name}
                  </Link>
                  <span className="text-[11px] text-slate-500 block pl-3">
                    {cat.subcategories.map((sub: any) => sub.name).join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-6 border-l-2 border-accent pl-3">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                href="/"
                className="hover:text-accent transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="hover:text-accent transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                href="/projects"
                className="hover:text-accent transition-colors duration-200"
              >
                Projects
              </Link>
              <Link
                href="/gallery"
                className="hover:text-accent transition-colors duration-200"
              >
                Gallery
              </Link>
              <Link
                href="/testimonials"
                prefetch={false}
                className="hover:text-accent transition-colors duration-200"
              >
                Reviews
              </Link>
              <Link
                href="/faq"
                className="hover:text-accent transition-colors duration-200"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="hover:text-accent transition-colors duration-200"
              >
                Contact Us
              </Link>
              <Link
                href="/quote"
                className="hover:text-accent transition-colors duration-200"
              >
                Get Quote
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-accent transition-colors duration-200 col-span-2"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-accent transition-colors duration-200 col-span-2"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-6 border-l-2 border-accent pl-3">
              Contact Info
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span>Near Bus Stand Behal Bhiwani HR 127028</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="hover:text-accent transition-colors"
                >
                  +91 82955 24045
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a
                  href="mailto:homesdecorator45@gmail.com"
                  className="hover:text-accent transition-colors"
                >
                  homesdecorator45@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <span>Mon - Sat: 9:00 AM - 6:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-10"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Homesdecorator. All rights reserved.
          </p>
          <p className="mt-2 sm:mt-0">
            Waterproofing, Wooden Flooring & PVC Specialists.
          </p>
        </div>
      </div>
    </footer>
  );
}
