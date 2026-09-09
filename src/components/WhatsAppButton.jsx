import React, { useState } from 'react';
import { siteConfig } from '../config/siteConfig';

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      aria-label="WhatsApp-এ কথা বলুন"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="WhatsApp-এ সরাসরি কথা বলুন"
    >
      {/* Authentic Pixel-Perfect WhatsApp Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="34"
        height="34"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <path
          d="M16 .5C7.44.5.5 7.44.5 16a15.42 15.42 0 0 0 2.37 8.27L.5 31.5l7.45-2.31A15.43 15.43 0 0 0 16 31.5c8.56 0 15.5-6.94 15.5-15.5S24.56.5 16 .5zm0 28.32a12.77 12.77 0 0 1-6.52-1.78l-.47-.28-4.85 1.5 1.54-4.73-.31-.49A12.78 12.78 0 1 1 16 28.82zm7.04-9.56c-.39-.19-2.29-1.13-2.65-1.26-.35-.13-.61-.19-.87.19-.26.39-1 1.26-1.23 1.52-.23.26-.45.29-.84.1-.39-.19-1.64-.6-3.12-1.92-1.15-1.03-1.93-2.3-2.16-2.69-.23-.39-.02-.6.17-.79.17-.17.39-.45.58-.68.19-.23.26-.39.39-.65.13-.26.06-.48-.03-.68-.1-.19-.87-2.1-1.2-2.87-.32-.76-.64-.65-.87-.66-.23-.01-.48-.01-.74-.01-.26 0-.68.1-1.03.48-.35.39-1.35 1.32-1.35 3.23s1.39 3.74 1.58 4c.19.26 2.73 4.17 6.62 5.85.93.4 1.65.64 2.21.82.93.3 1.78.25 2.45.15.75-.11 2.29-.94 2.62-1.84.32-.9.32-1.68.23-.84-.1-.16-.36-.26-.74-.45z"
          fill="#ffffff"
        />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
