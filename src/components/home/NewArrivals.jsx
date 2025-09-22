import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getNewArrivals } from "../../functions/product"; // API call
import Product from "../product/Product";
import { LoadingProduct, NextArrow, PrevArrow } from "../ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { Link } from "react-router-dom";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    if (Array.isArray(input)) {
      return input.map((product) => normalizeMediaSrc(product));
    }

    if (!input.media) return input;

    const normalizedMedia = input.media.map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
    }));

    return { ...input, media: normalizedMedia };
  };

  const [filter, setFilter] = useState("homme");

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const { data } = await getNewArrivals(filter);
        const normalizedProducts = normalizeMediaSrc(data.products || []);
        setProducts(normalizedProducts);
        console.log(
          "✅ New arrivals fetched and normalized:",
          normalizedProducts
        );
      } catch (err) {
        console.error("❌ Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [filter]);

  return (
    <div className="mx-auto md:mx-10 py-10">
      {/* ✅ Section Title */}
      <h2 className="text-3xl md:text-4xl font-semiBold tracking-tight text-gray-900 my-4 text-center">
        Nouvelle Collection <span className="text-[#87a736]">2025</span>
      </h2>

      {/* ✅ Filter Tabs */}
      <div className="flex justify-center gap-8 mb-4">
        {["homme", "Femme", "enfant"].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`text-base md:text-lg font-semibold flex items-center gap-1 transition-colors duration-300
          ${
            filter === category
              ? "text-[#87a736]"
              : "text-gray-700 hover:text-gray-900"
          }`}
          >
            {category}
            <ChevronDownIcon
              className={`w-4 h-4 transition-colors duration-300 ${
                filter === category ? "text-[#87a736]" : "text-gray-500"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ✅ Products Grid */}
      {loading ? (
        <LoadingProduct length={isMobile ? 1 : 4} cols={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4  px-1">
          {products.map((product) => (
            <Product key={product._id || product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
