import React from "react";
import { Input } from "../ui";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ProductSizesEditor({
  product,
  setProduct,
  handleChangeProduct,
}) {
  const handleRemoveSize = (i) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, idx) => idx !== i),
    }));
  };

  const handleAddSize = () => {
    setProduct((prev) => ({
      ...prev,
      sizes: [...(prev.sizes || []), { name: "", price: "" }],
    }));
  };

  return (
    <div
      className="rounded-lg border border-gray-300 shadow-sm max-h-[300px] overflow-y-auto p-2"
      style={{ scrollbarWidth: "thin" }} // Firefox only
    >
      {product.sizes?.map((s, i) => (
        <div
          key={i}
          className="flex flex-row gap-2 items-center w-full rounded-lg"
        >
          <Input
            type="text"
            value={s.name}
            onChange={(e) => handleChangeProduct(e, i, "name", "sizes")}
            placeholder="Size (e.g., 80x190)"
            className="border rounded p-2 w-full "
          />
          <Input
            type="number"
            value={s.price ?? ""}
            onChange={(e) => handleChangeProduct(e, i, "price", "sizes")}
            placeholder="Price"
            className="border rounded p-2 w-full "
          />
          <button
            onClick={() => handleRemoveSize(i)}
            className="bg-red-50 text-red-500 border border-gray-200 p-2 rounded-full shadow-sm 
                       hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 
                       focus:ring-red-400 transition mb-2"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}

      <button
        onClick={handleAddSize}
        className="mt-2 bg-[#87a736] text-white px-4 py-1 rounded w-full md:w-auto shadow-sm"
      >
        + Add Size
      </button>
    </div>
  );
}
