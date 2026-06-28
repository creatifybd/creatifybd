import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppButton;
