import React, { useState, useEffect } from "react";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/Categories";

export default function CategoryConfig() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return alert("Veuillez entrer un nom de catégorie");

    setLoading(true);
    try {
      await createCategory(category);
      setCategory(""); // Reset input
      await fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?"))
      return;
    try {
      await removeCategory(_id);
      await fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie", error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouvelle catégorie
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            placeholder="Entrez le nom de la catégorie"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </form>

      {/* Liste des catégories */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Liste des catégories</h3>
        {categories.length === 0 ? (
          <p className="text-gray-500">Aucune catégorie trouvée.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center border p-2 rounded-lg"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
