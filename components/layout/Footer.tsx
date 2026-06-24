import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Mail, MapPin, Phone, Clock } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-dark text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group">
              <Image
                src="/HOME DECORATER LOGO (2).png"
                alt="Home Decorater Logo"
                width={160}
                height={45}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed pt-2">
              Home Decorater is a premier home improvement company specializing in Waterproofing, Wooden Flooring, and PVC (Polyvinyl Chloride) services. We guarantee premium quality with structural warranties.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-xl text-white hover:text-white transition-colors duration-300">
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
              <li>
                <Link href="/services/waterproofing" className="hover:text-accent transition-colors duration-200 block">
                  Waterproofing Solutions
                </Link>
                <span className="text-[11px] text-slate-500 block pl-3">Roof, Terrace, Basement, Tanks</span>
              </li>
              <li>
                <Link href="/services/wooden-flooring" className="hover:text-accent transition-colors duration-200 block">
                  Wooden Flooring
                </Link>
                <span className="text-[11px] text-slate-500 block pl-3">Laminate, Vinyl, SPC, Engineered</span>
              </li>
              <li>
                <Link href="/services/pvc" className="hover:text-accent transition-colors duration-200 block">
                  PVC (Polyvinyl Chloride)
                </Link>
                <span className="text-[11px] text-slate-500 block pl-3">SPC Flooring, LVT Planks, ESD Tiles, Cladding</span>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-6 border-l-2 border-accent pl-3">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link>
              <Link href="/about" className="hover:text-accent transition-colors duration-200">About Us</Link>
              <Link href="/projects" className="hover:text-accent transition-colors duration-200">Projects</Link>
              <Link href="/gallery" className="hover:text-accent transition-colors duration-200">Gallery</Link>
              <Link href="/testimonials" prefetch={false} className="hover:text-accent transition-colors duration-200">Reviews</Link>
              <Link href="/faq" className="hover:text-accent transition-colors duration-200">FAQ</Link>
              <Link href="/contact" className="hover:text-accent transition-colors duration-200">Contact Us</Link>
              <Link href="/quote" className="hover:text-accent transition-colors duration-200">Get Quote</Link>
              <Link href="/privacy-policy" className="hover:text-accent transition-colors duration-200 col-span-2">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors duration-200 col-span-2">Terms & Conditions</Link>
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
                <span>Sector 62, Noida, Uttar Pradesh, India - 201301</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <a href="tel:+919999999999" className="hover:text-accent transition-colors">+91 99999 99999</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:info@homedecorater.in" className="hover:text-accent transition-colors">info@homedecorater.in</a>
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
          <p>© {new Date().getFullYear()} Home Decorater. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Waterproofing, Wooden Flooring & PVC Specialists.
          </p>
        </div>
      </div>
    </footer>
  );
}
