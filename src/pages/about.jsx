import React from "react";
import {
  StarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 shadow-lg text-gray-900">
        <div className="max-w-7xl mx-auto px-2 md:px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              À propos de{" "}
              <span className="text-[#87a736]">Artisanat Bargaoui</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-gray-900 leading-relaxed">
              <strong>Artisanat Bargaoui</strong> est une maison familiale
              spécialisée dans l’
              <strong>artisanat tunisien (الصناعات التقليدية التونسية)</strong>{" "}
              depuis plusieurs générations. Située au cœur de la Tunisie, notre
              entreprise préserve et valorise un savoir-faire authentique
              transmis de père en fils.
              <br />
              <br />
              Nous mettons en avant des vêtements et pièces artisanales uniques
              qui reflètent la richesse culturelle de la Tunisie, notamment :
              <br />- <strong>La Jeba Tunisienne (الجُبّة التونسية)</strong>,
              symbole d’élégance et de raffinement.
              <br />- <strong>La Qamraya (القمرية)</strong>, tenue artisanale
              traditionnelle d’exception.
              <br />- <strong>Le Qarmasoud (القرماسود)</strong>, habit
              emblématique du sud tunisien.
              <br />- <strong>La Sakrouda (السكرودة)</strong>, pièce rare qui
              témoigne de l’authenticité du patrimoine.
              <br />
              <br />
              Notre mission est de proposer à nos clients des créations qui
              allient <strong>tradition, qualité et créativité</strong>, tout en
              faisant rayonner le{" "}
              <strong>
                patrimoine culturel tunisien (التراث الثقافي التونسي)
              </strong>{" "}
              en Tunisie et à l’international.
            </p>
          </div>
          <div className="flex-1">
            <img
              src="/images/artisanat-bargaoui.jpg"
              alt="Atelier Artisanat Bargaoui"
              className="rounded-2xl shadow-lg object-cover w-full h-80"
            />
          </div>
        </div>
      </div>

      {/* Mission & Values with Icons */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {/* Authenticité */}
        <div className="flex flex-col items-center">
          <StarIcon className="w-12 h-12 text-[#2c2d84] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Authenticité</h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
            Chaque vêtement et chaque pièce artisanale sont conçus à la main
            avec soin, respectant les traditions tunisiennes pour garantir des
            créations uniques et authentiques.
          </p>
        </div>

        {/* Savoir-Faire */}
        <div className="flex flex-col items-center">
          <UserGroupIcon className="w-12 h-12 text-[#2c2d84] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Savoir-Faire</h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
            Un héritage transmis depuis des générations qui met en avant la
            maîtrise, la passion et la précision de l’artisanat tunisien.
          </p>
        </div>

        {/* Qualité & Satisfaction */}
        <div className="flex flex-col items-center">
          <ShieldCheckIcon className="w-12 h-12 text-[#2c2d84] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Qualité & Satisfaction
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
            Nous garantissons des produits faits main, raffinés et durables,
            conçus pour satisfaire pleinement nos clients en Tunisie comme à
            l’international.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 shadow-lg text-gray-900 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">
            Vous cherchez des pièces artisanales uniques ?
          </h2>
          <p className="mt-4 text-gray-900">
            Contactez-nous et découvrez l’univers de{" "}
            <strong>l’artisanat tunisien (الصناعات التقليدية التونسية)</strong>{" "}
            signé Bargaoui.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-6 px-8 py-3 bg-[#87a736] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition"
          >
            Nous Contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
