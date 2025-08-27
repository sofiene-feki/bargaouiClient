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
      <div className="relative bg-gray-100 shadow-lg text-gray-900 py-8 md:py-12">
        <div className="max-w-7xl mx-auto md:px-6 px-2 ">
          <h1 className="text-3xl md:text-5xl font-bold">
            Contactez <span className="text-[#87a736]">Super Siesta</span>
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-900">
            Une question, un projet ou besoin d’un conseil ? Nous sommes là pour
            vous aider.
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d799.3889468714448!2d10.319203169598904!3d36.73322837306697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd4900684d8e41%3A0xbde3122ac8e80e90!2sSuper%20siesta%20Ezzahra%20Boumhel%20Hammam%20lif!5e0!3m2!1sen!2stn!4v1755178799756!5m2!1sen!2stn"
            className="w-full h-full min-h-[400px] border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
