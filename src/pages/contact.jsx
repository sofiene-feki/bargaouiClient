import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Contact() {
  return (
    <section className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-100 shadow-lg text-gray-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto md:px-6 px-2">
          <h1 className="text-3xl md:text-5xl font-bold">
            Contactez <span className="text-[#87a736]">Artisanat Bargaoui</span>
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-900 leading-relaxed">
            Vous souhaitez en savoir plus sur nos{" "}
            <strong>vêtements traditionnels tunisiens</strong>
            (جُبّة تونسية, القمرية, القرماسود, السكرودة) ou passer une commande
            personnalisée ? Notre équipe est à votre écoute pour répondre à vos
            questions et vous accompagner dans vos choix.
          </p>
        </div>
      </div>

      {/* Contact Info */}

      {/* Form + Map Side by Side */}
      <div className="max-w-7xl mx-auto md:px-6 px-2 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <form className=" p-2 md:p-8 rounded-xl shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              placeholder="Votre nom"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2c2d84] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2c2d84] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              placeholder="Votre message..."
              rows="4"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2c2d84] focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2c2d84] text-white py-3 px-4 rounded-md font-medium hover:bg-[#1f2066] transition"
          >
            Envoyer le message
          </button>
        </form>

        {/* Map */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.659726120883!2d10.334292175545308!3d36.73073267161285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd49c89b37a6a5%3A0x6a12cbc8089fe2ee!2sArtisanat%20Bargaoui!5e0!3m2!1sen!2stn!4v1757974902922!5m2!1sen!2stn"
            className="w-full h-full min-h-[400px] border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
