import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSettingsMain from "./UserSettingsMain";
import PixelConfig from "./configs/PixelConfig";
import GoogleConfig from "./configs/GoogleConfig";
import AnalyticsConfig from "./configs/AnalyticsConfig";
import CategoryConfig from "./configs/CategoryConfig";
import SubCategoryConfig from "./configs/SubCategoryConfig";
import { FaReply } from "react-icons/fa";
import PackageConfig from "./configs/PackageConfig";

const VIEWS = {
  MAIN: "main",
  PIXEL: "pixel",
  GOOGLE: "google",
  ANALYTICS: "analytics",
  CATEGORY: "category",
  SUB_CATEGORY: "sub_category",
  package: "package",
};

const CONFIG_COMPONENTS = {
  [VIEWS.PIXEL]: PixelConfig,
  [VIEWS.GOOGLE]: GoogleConfig,
  [VIEWS.ANALYTICS]: AnalyticsConfig,
  [VIEWS.CATEGORY]: CategoryConfig,
  [VIEWS.SUB_CATEGORY]: SubCategoryConfig,
  [VIEWS.package]: PackageConfig,
};

export default function UserSettingsLayout({ setUserMenuOpen, handleSignOut }) {
  const [view, setView] = useState(VIEWS.MAIN);
  const navigate = useNavigate();

  const handleCreateProduct = () => {
    navigate("/product/new", { state: { mode: "create" } });
    setUserMenuOpen(false);
  };

  const handleCreatePack = () => {
    navigate("/pack/new", { state: { mode: "create" } });
    setUserMenuOpen(false);
  };

  const ActiveComponent = CONFIG_COMPONENTS[view];

  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-4 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {view === VIEWS.MAIN ? "Paramètres" : "Configuration"}
        </h2>
        {view !== VIEWS.MAIN && (
          <button
            onClick={() => setView(VIEWS.MAIN)}
            className="text-blue-500 flex gap-2 hover:underline"
          >
            <FaReply className="mt-1" /> Retour
          </button>
        )}
        {view === VIEWS.MAIN && (
          <button
            onClick={() => setUserMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✖
          </button>
        )}
      </div>

      {/* Content */}
      {view === VIEWS.MAIN ? (
        <UserSettingsMain
          setView={setView}
          handleCreateProduct={handleCreateProduct}
          handleSignOut={handleSignOut}
          setUserMenuOpen={setUserMenuOpen}
          handleCreatePack={handleCreatePack}
        />
      ) : (
        <ActiveComponent />
      )}
    </div>
  );
}
