import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { openCart } from "../../redux/ui/cartDrawer";
import { addItem } from "../../redux/cart/cartSlice";
import { useDispatch } from "react-redux";
import Slider from "react-slick";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product({ product, productsPerPage, loading }) {
  const view = useSelector((state) => state.view.view);
  const dispatch = useDispatch();
  // Get first image media for preview, fallback to placeholder if none
  const mainMedia = product.media?.find((m) => m.type === "image");
  const imageSrc = mainMedia
    ? mainMedia.src
    : "https://via.placeholder.com/300";
  const imageAlt = mainMedia ? mainMedia.alt : product.name;
  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    customPaging: function (i) {
      // Use color from product.colors or default if main image
      if (i === 0) {
        return (
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ccc", // main image dot color
            }}
          ></div>
        );
      }
      const color = product.colors?.[i - 1]; // Because first dot is main image
      return (
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: color?.value || "#ccc",
          }}
        ></div>
      );
    },
    appendDots: (dots) => (
      <ul style={{ display: "flex", justifyContent: "center" }}>{dots}</ul>
    ),
  };

  // Get first color name or empty string
  const firstColor = product.colors?.[0] || "";
  const firstSize = product.sizes?.[0] || "M";
  const originalPrice = product?.Price;
  const promotion = product?.promotion || 0; // percentage
  const discountedPrice = +(
    originalPrice -
    (originalPrice * promotion) / 100
  ).toFixed(2);
  const savings = +(originalPrice - discountedPrice).toFixed(2);
  const handleAddToCart = () => {
    const finalPrice = promotion > 0 ? discountedPrice : originalPrice;
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        // price: firstSize?.price ?? product.Price,
        price: finalPrice, // ✅ use discounted or original
        image: imageSrc,
        selectedSize: firstSize?.name ?? null,
        selectedSizePrice: firstSize?.price ?? null,
        selectedColor: firstColor?.name ?? null,
        colors: product.colors,
        sizes: product.sizes,
      })
    );
    dispatch(openCart());
  };

  // Default grid view
  return (
    <div>
      {loading ? (
        <div className="group relative pt-2 border border-gray-50 rounded-md cursor-pointer animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square w-full rounded-t-md bg-gray-100" />

          {/* Info Skeleton */}
          <div className="p-2 bg-white">
            <div className="mt-2 flex justify-between">
              <div className="h-5 w-3/4 bg-gray-100 rounded"></div>
              <div className="h-5 w-1/4 bg-gray-100 rounded"></div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-2 h-10 w-full bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <div className="group relative rounded-xl cursor-pointer">
          <Link
            key={product._id}
            to={`/product/${product.slug}`}
            className="group relative flex flex-col overflow-hidden border border-[#e5e7eb]/40 rounded-xl bg-white/60 backdrop-blur-sm hover:shadow-2xl transition-all"
          >
            {/* Product Image */}
            <div className="w-full flex-1 overflow-hidden bg-white">
              <Slider
                {...{
                  dots: true,
                  infinite: true,
                  autoplay: true,
                  autoplaySpeed: 6000,
                  speed: 800,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: false,
                  fade: true,
                  appendDots: (dots) => (
                    <div style={{ padding: "4px", marginBottom: "4px" }}>
                      <ul
                        style={{
                          margin: "0px",
                          display: "flex",
                          justifyContent: "center",
                          gap: "3px",
                        }}
                      >
                        {dots}
                      </ul>
                    </div>
                  ),
                  customPaging: (i) => {
                    let bgColor = "#ccc";
                    if (i > 0 && product.colors && product.colors[i - 1]) {
                      bgColor = product.colors[i - 1].value;
                    }
                    return (
                      <div
                        className="custom-dot"
                        style={{
                          width: "25px",
                          height: "4px",
                          borderRadius: "20%",
                          backgroundColor: bgColor,
                          opacity: 0.4,
                          transition: "opacity 0.3s ease",
                        }}
                      ></div>
                    );
                  },
                }}
              >
                {/* Main image */}
                {mainMedia && (
                  <div className="relative">
                    <img
                      src={imageSrc}
                      alt={product.Title}
                      className="w-full h-72 md:h-120 object-cover transition-transform transform group-hover:scale-105"
                    />

                    {/* Promotion Badge */}
                    {product.promotion > 0 && (
                      <div
                        className="absolute top-4 left-4 text-[#0d1b2a] text-xs md:text-sm font-bold py-1 px-3 rounded-md shadow-lg z-10
                bg-gradient-to-r from-[#d4af37] to-[#f5d76e] animate-pulse transition-all duration-300"
                      >
                        -{product.promotion}%
                      </div>
                    )}
                  </div>
                )}

                {/* Color variations */}
                {product.colors?.map((color, i) => (
                  <div key={color._id || i} className="relative">
                    <img
                      src={`${API_BASE_URL_MEDIA}${color.src}`}
                      alt={color.name}
                      className="w-full h-72 md:h-120 object-cover"
                    />
                    {product.promotion > 0 && (
                      <div
                        className="absolute top-4 left-4 text-[#0d1b2a] text-xs md:text-sm font-bold py-1 px-3 rounded-md shadow-lg z-10
                bg-gradient-to-r from-[#d4af37] to-[#f5d76e] animate-pulse transition-all duration-300"
                      >
                        -{product.promotion}%
                      </div>
                    )}
                  </div>
                ))}
              </Slider>
            </div>

            {/* Text Content */}
            <div className="bg-white/90 px-2 md:px-3">
              <div dir="rtl">
                <h3 className="md:text-lg truncate whitespace-nowrap text-base font-semibold text-[#0d1b2a] group-hover:text-[#d4af37] transition-colors duration-300">
                  {product.Title}
                </h3>
                <div className="flex items-center gap-2">
                  {product?.promotion > 0 ? (
                    <>
                      <span className="line-through text-gray-400 text-xl">
                        {originalPrice}
                      </span>
                      <h3 className="text-xl md:text-3xl font-bold text-[#d4af37]">
                        {discountedPrice}
                      </h3>
                    </>
                  ) : (
                    <span className="text-[#0d1b2a] font-semibold text-xl">
                      {originalPrice}
                    </span>
                  )}
                  <span className="text-[#0d1b2a]">د.ت</span>
                </div>
              </div>
            </div>
          </Link>

          {/* CTA Add to cart */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full md:px-4 px-2 md:py-3 py-2 mt-1
    bg-gradient-to-r from-[#d4af37] to-[#f5d76e] text-[#0d1b2a] font-semibold rounded-md
    shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            {/* ✅ Icône responsive */}
            <ShoppingCartIcon
              className="w-5 h-5 md:w-6 md:h-6"
              aria-hidden="true"
            />

            {/* ✅ Texte responsive */}
            <span className="text-sm md:text-base">Ajouter au panier</span>
          </button>
        </div>
      )}
    </div>
  );
}
