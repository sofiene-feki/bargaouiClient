import React from "react";

export default function GoogleConfig() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          GoogleConfig ID
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
}
