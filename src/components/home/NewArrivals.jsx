import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getNewArrivals } from "../../functions/product"; // API call
import Product from "../product/Product";
import { LoadingProduct, NextArrow, PrevArrow } from "../ui";
import new1 from "../../assets/new1.jpg";
import new2 from "../../assets/new2.jpg";
import new3 from "../../assets/new3.jpg";
import women from "../../assets/women.jpg";

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

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        const { data } = await getNewArrivals();
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
  }, []);

  return (
    <div className=" mx-auto md:mx-10 py-10">
      <h2 className="text-3xl md:text-4xl font-bold font-serif  text-gray-800 my-4 text-center">
        Nouvelle Collection 2025
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-1">
        {products.map((product) => (
          <Product key={product._id || product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
