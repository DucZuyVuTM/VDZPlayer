import React from 'react';
import { FaMobileAlt, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="mx-8 py-6 border-t border-gray-300">
      <div className="container mx-auto px-4 mb-2">
        <div className="flex flex-col items-center gap-1">

          {/* Phone number */}
          <a
            href="tel:+79057212749"
            className="flex items-center hover:text-blue-600 transition-colors group"
          >
            <FaMobileAlt className="mr-1 text-lg translate-y-[.5px]" />
            <span className="group-hover:underline">8-905-721-27-49</span>
          </a>

          {/* Email */}
          <a
            href="mailto:duczuyvu12@gmail.com"
            className="flex items-center hover:text-blue-600 transition-colors group"
          >
            <FaEnvelope className="mr-2 text-lg translate-y-[.5px]" />
            <span className="group-hover:underline">duczuyvu12@gmail.com</span>
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
