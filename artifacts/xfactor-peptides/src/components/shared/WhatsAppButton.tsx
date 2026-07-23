import * as React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/14849032964"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="h-10 w-10" />
    </a>
  );
}
