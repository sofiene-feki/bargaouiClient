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
              À propos de <span className="text-[#87a736] ">Super Siesta</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-gray-900 leading-relaxed">
              <strong>SUPER MOUSSE</strong> est une société à responsabilité
              limitée (SARL) créée par Monsieur Neifar Fathi. Elle est
              spécialisée dans la production de mousse et matelas ressorts. Elle
              s'est lancée dans cette activité depuis 1994 après avoir acquis
              une grande expérience dans le monde du mousse et dérivés. Notre
              principal objectif consiste à satisfaire notre clientèle et à leur
              proposer une gamme de produits diversifiée qui répondra
              parfaitement à leurs différents besoins. Pour cela, SUPER MOUSSE
              dispose d'une équipe de travail compétente et qualifiée afin
              d'atteindre cet objectif.
            </p>
          </div>
          <div className="flex-1">
            <img
              src="https://supersiestaofficiel.com/app/images/usine.png"
              alt="Usine de Super Siesta"
              className="rounded-2xl shadow-lg object-cover w-full h-80"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision with Icons */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {/* Qualité Premium */}
        <div className="flex flex-col items-center">
          <StarIcon className="w-12 h-12 text-[#2c2d84] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Qualité Premium
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
            Offrir des produits et services de qualité exceptionnelle qui
            répondent aux besoins de nos clients tout en garantissant un
            excellent rapport qualité-prix.
          </p>
        </div>

        {/* Service Client */}
        <div className="flex flex-col items-center">
          <UserGroupIcon className="w-12 h-12 text-[#2c2d84] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Service Client
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
            Une équipe toujours disponible pour vous conseiller et vous
            accompagner dans vos choix, avec un service après-vente réactif et
            attentif.
          </p>
        </div>

        {/* Satisfaction Garantie */}
        <div className="flex flex-col items-center">
          <ShieldCheckIcon className="w-12 h-12 text-[#2c2d84] mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Satisfaction Garantie
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
            Nous mettons tout en œuvre pour que chaque client soit satisfait, en
            offrant des produits fiables et un suivi personnalisé.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 shadow-lg text-gray-900 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">
            Besoin d’une solution adaptée à vos besoins ?
          </h2>
          <p className="mt-4 text-gray-900">
            Contactez-nous dès aujourd’hui et découvrez comment nous pouvons
            optimiser vos impressions.
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
