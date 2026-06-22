"use client";

import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWidgets() {
  const whatsappNumber = "919999999999";
  const whatsappMessage = encodeURIComponent("Hello! I am looking for professional waterproofing, flooring, or PVC services. I would like to schedule a callback.");
  const phoneNumber = "+919999999999";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-4">
      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg transition-transform duration-300 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        aria-label="Contact on WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8" />
      </motion.a>

      {/* Direct Call Button */}
      <motion.a
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center w-14 h-14 bg-accent hover:bg-accent-hover text-gray-900 rounded-full shadow-lg transition-transform duration-300 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        aria-label="Call Now"
      >
        <PhoneCall className="w-6 h-6 text-slate-900" />
      </motion.a>
    </div>
  );
}
