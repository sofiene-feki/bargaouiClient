import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBoxOpen,
  FaCog,
  FaSignOutAlt,
  FaFacebook,
  FaGoogle,
  FaEdit,
  FaLock,
  FaPlus,
  FaStore,
} from "react-icons/fa";
import { ChartBarIcon } from "@heroicons/react/24/outline";

const UserSettingsContent = ({ setUserMenuOpen, handleSignOut }) => {
  const [view, setView] = useState("main"); // main | pixel | google | analytics
  const navigate = useNavigate();
  const handleCreateProduct = () => {
    navigate("/product/new", { state: { mode: "create" } });
    setUserMenuOpen(false);
  };
  const goBack = () => setView("main");

  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-4 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            {view === "main"
              ? "Paramètres"
              : view === "pixel"
              ? "Configurer Facebook Pixel"
              : view === "category"
              ? "Configurer categorie"
              : view === "sub category"
              ? "Configurer sous category"
              : view === "google"
              ? "Configurer Google Search Console"
              : "Configurer Google Analytics"}
          </h2>

          {/* Back button only if not main view */}
          {view !== "main" && (
            <button
              onClick={goBack}
              className="text-sm text-blue-500 hover:underline"
            >
              ← Retour
            </button>
          )}
        </div>

        {/* X button to close modal */}
        <button
          onClick={() => setUserMenuOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✖
        </button>
      </div>

      {/* MAIN SETTINGS VIEW */}
      {view === "main" && (
        <div className="space-y-3 pb-8">
          {/* Profile Section */}
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-left text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <span className="flex items-center gap-2">
                    <FaUserCircle className="w-5 h-5 text-blue-500" />
                    Profil Utilisateur
                  </span>
                  <ChevronIcon open={open} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-3 text-gray-700 space-y-2">
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 text-gray-600 hover:underline text-left">
                      <FaEdit />
                      Modifier le Profil
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:underline text-left">
                      <FaLock />
                      Changer le Mot de Passe
                    </button>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          {/* Orders Section */}
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-left text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <span className="flex items-center gap-2">
                    <FaBoxOpen className="w-5 h-5 text-blue-500" />
                    Mes Commandes
                  </span>
                  <ChevronIcon open={open} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-3 text-gray-700 space-y-2">
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 text-gray-600 hover:underline"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FaBoxOpen />
                    Suivi des commandes
                  </Link>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          {/* Shop Management Section */}
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-left text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <span className="flex items-center gap-2">
                    <FaStore className="w-5 h-5 text-yellow-500" />
                    Gestion de la Boutique
                  </span>
                  <ChevronIcon open={open} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-3 text-gray-700 space-y-2">
                  <p
                    className="flex items-center gap-2 text-gray-600 hover:underline cursor-pointer"
                    onClick={handleCreateProduct}
                  >
                    <FaPlus /> Ajouter un Produit
                  </p>
                  <ServiceItem
                    name="Ajouter une Catégorie"
                    view="category"
                    icon={<FaPlus />}
                    color="text-blue-600"
                    setView={setView}
                  />
                  <ServiceItem
                    name="Ajouter une sous Catégorie"
                    view="sub category"
                    icon={<FaPlus />}
                    color="text-blue-600"
                    setView={setView}
                  />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          {/* Services Section */}
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-left text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <span className="flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-green-500" />
                    Services Connectés
                  </span>
                  <ChevronIcon open={open} />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-3 text-gray-700 space-y-3 ">
                  <ServiceItem
                    name="Facebook Pixel"
                    view="pixel"
                    icon={<FaFacebook />}
                    color="text-blue-600"
                    setView={setView}
                  />
                  <ServiceItem
                    name="Google Search Console"
                    view="google"
                    icon={<FaGoogle />}
                    color="text-green-600"
                    setView={setView}
                  />
                  <ServiceItem
                    name="Google Analytics"
                    view="analytics"
                    icon={<FaGoogle />}
                    color="text-indigo-600"
                    setView={setView}
                  />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          {/* General Settings */}
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 text-left text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  <span className="flex items-center gap-2">
                    <FaCog className="w-5 h-5 text-purple-500" />
                    Paramètres Généraux
                  </span>
                  <ChevronIcon open={open} />
                </Disclosure.Button>
                {/* <Disclosure.Panel className="px-4 py-3 text-gray-700 space-y-3 border-l-2 border-purple-200 bg-purple-50 rounded-r-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nom du Site
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Nom de votre site"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Logo du Site
                    </label>
                    <input
                      type="file"
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description SEO
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-2"
                      rows="3"
                    />
                  </div>
                </Disclosure.Panel> */}
              </>
            )}
          </Disclosure>
        </div>
      )}

      {/* Configuration Views */}
      {view === "pixel" && <PixelConfig />}
      {view === "google" && <GoogleConfig />}
      {view === "analytics" && <AnalyticsConfig />}
      {view === "category" && <CategoryConfig />}
      {view === "sub category" && <SubCategoryConfig />}

      {/* Sign Out Button */}
      <div className="p-4 ">
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

// Reusable components
const ChevronIcon = ({ open }) => (
  <svg
    className={`${open ? "rotate-180 transform" : ""} w-5 h-5 text-gray-500`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ServiceItem = ({ name, view, icon, color, setView }) => (
  <div className="flex items-center justify-between">
    <span className={`flex items-center gap-2 ${color}`}>
      {icon}
      {name}
    </span>
    <button
      onClick={() => setView(view)}
      className="text-blue-500 hover:underline"
    >
      Configurer
    </button>
  </div>
);

// Config sections
const PixelConfig = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Pixel ID
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Entrez votre Pixel ID"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Access Token
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Entrez votre Token"
      />
    </div>
    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
      Sauvegarder
    </button>
  </div>
);

const GoogleConfig = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Code de Vérification Google
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Entrez le code de vérification"
      />
    </div>
    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
      Sauvegarder
    </button>
  </div>
);

const AnalyticsConfig = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Tracking ID (UA-XXXXX)
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Entrez votre Tracking ID"
      />
    </div>
    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
      Sauvegarder
    </button>
  </div>
);

const CategoryConfig = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        categorie
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Entrez votre Tracking ID"
      />
    </div>
    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
      Sauvegarder
    </button>
  </div>
);
const SubCategoryConfig = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        sous categorie
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Entrez votre Tracking ID"
      />
    </div>
    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
      Sauvegarder
    </button>
  </div>
);

export default UserSettingsContent;
