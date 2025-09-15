import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 md:py-10 py-6 print:hidden">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-semibold mb-5 tracking-wide text-gray-900">
              Information de Contact
            </h4>
            <div className="text-sm text-gray-700 space-y-3 leading-relaxed ">
              <p>
                <strong>Address:</strong> 6 Rue 2 Mars 1934, Hammam-Lif, Tunisia
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a
                  href="+216 58 811 911"
                  className="hover:underline text-[#87a736] transition-colors"
                >
                  +216 20 235 294
                </a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:
artisanatbargaoui.com"
                  className="hover:underline text-[#87a736] transition-colors"
                >
                  artisanatbargaoui@gmail.com
                </a>
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-5 mt-4">
              {[
                {
                  href: "https://www.facebook.com/ArtisanatBargaoui",
                  label: "Facebook",
                  svg: <FaFacebook className="w-6 h-6" />,
                },
                {
                  href: "https://Youtube.com",
                  label: "Youtube",
                  svg: <FaYoutube className="w-6 h-6" />,
                },

                {
                  href: "https://instagram.com",
                  label: "Instagram",
                  svg: <FaInstagram className="w-6 h-6" />,
                },
              ].map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-600 hover:text-[#87a736] transition transform hover:scale-110"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h4 className="text-lg font-semibold mb-5 tracking-wide text-gray-900">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm">
              {["Home", "Shop", "About Us", "Contact"].map((text) => (
                <li key={text}>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-[#87a736] transition-colors duration-200"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="hidden md:block">
            <h4 className="text-lg font-semibold mb-5 tracking-wide text-gray-900">
              Support
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                "Help Center",
                "Terms of Service",
                "Privacy Policy",
                "Returns & Refunds",
              ].map((text) => (
                <li key={text}>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-[#87a736] transition-colors duration-200"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2 tracking-wide text-gray-900">
              Nous Visiter{" "}
            </h4>
            <iframe
              className="w-full  rounded-md border border-gray-300 shadow-md block"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.659726120883!2d10.334292175545308!3d36.73073267161285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd49c89b37a6a5%3A0x6a12cbc8089fe2ee!2sArtisanat%20Bargaoui!5e0!3m2!1sen!2stn!4v1757974902922!5m2!1sen!2stn"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Super siesta Ezzahra Boumhel Hammam lif"
            />
          </div>
        </div>

        <div className="mt-14 border-t border-gray-300 pt-7 text-sm text-center text-gray-500 select-none">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
