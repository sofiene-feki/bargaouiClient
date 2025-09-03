// ProductInfoForm.jsx
import React, { useState, useEffect } from "react";
import { Input, Textarea } from "../ui";
import { getCategories } from "../../functions/Categories";
import { getSubCategories } from "../../functions/sub";

export default function ProductInfoForm({ product, setProduct }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories whenever product.category changes
  useEffect(() => {
    const fetchSubs = async () => {
      if (!product.category) {
        setSubCategories([]);
        return;
      }
      setLoadingSubs(true);
      try {
        const { data } = await getSubCategories(product.category);
        setSubCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des sous-catégories", error);
      } finally {
        setLoadingSubs(false);
      }
    };
    fetchSubs();
  }, [product.category]);

  return (
    <>
      <Input
        label="Product Name"
        name="Title"
        type="text"
        value={product.Title}
        onChange={(e) => setProduct({ ...product, Title: e.target.value })}
        placeholder="Product Name"
        className="border w-full mb-4 p-1"
      />

      <div className="flex gap-2 ">
        <Input
          label="Price"
          type="number"
          value={product.Price}
          onChange={(e) =>
            setProduct({
              ...product,
              Price: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Price"
          className="border w-full mb-4 p-1"
        />
        <Input
          label="Promotion (%)"
          type="number"
          value={product.promotion ?? 0}
          onChange={(e) =>
            setProduct({
              ...product,
              promotion: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          placeholder="Ex: 5"
          className="border w-full mb-4 p-1"
        />
      </div>

      <div className="flex gap-2 ">
        <Input
          label="Quantity"
          type="number"
          value={product.Quantity}
          onChange={(e) =>
            setProduct({
              ...product,
              Quantity: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Quantity"
          className="border w-full mb-4 p-1"
        />
        <Input
          label="Sold"
          type="number"
          value={product.sold ?? 0}
          onChange={(e) =>
            setProduct({
              ...product,
              sold: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          placeholder="Sold"
          className="border w-full mb-4 p-1"
        />
      </div>

      <Textarea
        label="Description"
        value={product.Description}
        onChange={(e) =>
          setProduct({ ...product, Description: e.target.value })
        }
        placeholder="Description"
        className="border w-full p-2 mb-4"
      />

      {/* Category Select */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category
      </label>
      <select
        value={product.category || ""}
        onChange={(e) =>
          setProduct({ ...product, category: e.target.value, subCategory: "" })
        }
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none
             transition mb-4"
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Sub Category Select */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Sub Category
      </label>
      <select
        value={product.subCategory || ""}
        onChange={(e) =>
          setProduct({ ...product, subCategory: e.target.value })
        }
        disabled={!product.category || loadingSubs}
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none
             transition mb-4 disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="">
          {loadingSubs ? "Loading..." : "Select sub category"}
        </option>
        {subCategories.map((sub) => (
          <option key={sub._id} value={sub._id}>
            {sub.name}
          </option>
        ))}
      </select>
    </>
  );
}
