import ContactForm from "@/components/forms/ContactForm";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Contact Our Office",
  description:
    "Get in touch with Homes Decorator's head office in Behal, Bhiwani, Haryana. Call +91 8295524045, email us, or find directions on Google Maps. Serving Haryana & Delhi NCR.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const mapEmbedUrl =
    "https://www.google.com/maps?q=Behal%2C%20Bhiwani%2C%20Haryana%20127028&output=embed";

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary">
            Contact Our Team
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Reach out to our project division or head office regarding site
            inspections, sample kits, and quotations.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Details */}
          <div className="bg-white border border-slate-100 p-8 rounded-none shadow-sm space-y-6 lg:col-span-1">
            <h3 className="font-serif text-xl font-bold text-primary border-b border-slate-100 pb-4">
              Office Information
            </h3>

            <ul className="space-y-6 text-sm sm:text-base">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Headquarters Address</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    Plot 42, Jhumpa Road, Near SBI Bank Behal, district Bhiwani
                    127028
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Direct Telephone</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    <a
                      href="tel:+918295524045"
                      className="hover:text-primary transition-colors"
                    >
                      +91 8295524045
                    </a>
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Email Address</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    <a
                      href="mailto:homesdecorator45@gmail.com"
                      className="hover:text-primary transition-colors"
                    >
                      homesdecorator45@gmail.com
                    </a>
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Business Hours</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    Mon - Sat: 9:00 AM - 6:30 PM
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-100 p-8 rounded-none shadow-sm lg:col-span-2">
            <h3 className="font-serif text-2xl font-bold text-primary mb-6">
              Send Message
            </h3>
            <ContactForm />
          </div>
        </div>

        {/* Map Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-primary pl-1 flex items-center">
            Find Us on Google Maps{" "}
            <ExternalLink className="w-4 h-4 ml-1.5 text-accent" />
          </h3>
          <div className="relative h-[300px] sm:h-[450px] rounded-none overflow-hidden shadow-sm border border-slate-200">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Homes Decorator Head Office — Behal, Bhiwani, Haryana"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
