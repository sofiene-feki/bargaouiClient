// ProductInfoForm.jsx
import React, { useState } from "react";
import { Input, Textarea } from "../ui";

export default function ProductInfoForm({ product, setProduct }) {
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
          label="sold"
          type="number"
          value={product.sold ?? 0}
          onChange={(e) =>
            setProduct({
              ...product,
              sold: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          placeholder="sold"
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category
      </label>
      <select
        value={product.Category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none
             transition mb-4"
      >
        <option value="">Select category</option>
        <option value="soft+">soft+</option>
        <option value="venise+">venise+</option>
        <option value="medico+">medico+</option>
        <option value="relax+">relax+</option>
        <option value="tendresse+">tendresse+</option>
        <option value="topRelax+">topRelax+</option>
        <option value="oreiller">oreiller</option>
        <option value="protege">protege</option>

        {/* Add more categories as needed */}
      </select>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Sub Category
      </label>
      <select
        value={product.subCategory}
        onChange={(e) =>
          setProduct({ ...product, subCategory: e.target.value })
        }
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none
             transition mb-4"
      >
        <option value="">Select category</option>
        <option value="soft+">soft+</option>
        <option value="venise+">venise+</option>
        <option value="medico+">medico+</option>
        <option value="relax+">relax+</option>
        <option value="tendresse+">tendresse+</option>
        <option value="topRelax+">topRelax+</option>
        <option value="oreiller">oreiller</option>
        <option value="protege">protege</option>

        {/* Add more categories as needed */}
      </select>
    </>
  );
}
