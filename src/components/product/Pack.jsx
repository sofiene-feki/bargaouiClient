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

export default function Pack({ product, productsPerPage, loading }) {
  const view = useSelector((state) => state.view.view);
  const dispatch = useDispatch();
  // Get first image media for preview, fallback to placeholder if none
  const mainMedia = product.media?.find((m) => m.type === "image");
  const imageSrc = mainMedia
    ? mainMedia.src
    : "https://via.placeholder.com/300";
  const imageAlt = mainMedia ? mainMedia.alt : product.name;

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

  const handleAddToCart = () => {
    console.log("Adding to cart:", imageSrc);
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: firstSize?.price ?? product.Price,
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

  if (view === "list") {
    return (
      <div className="flex space-x-4 p-4 border border-gray-100 rounded-md shadow-md hover:shadow-md">
        <img
          alt={imageAlt}
          src={imageSrc}
          className="w-54 h-54 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              <Link to={`/pack/${product.slug}`}>{product.title}</Link>
            </h3>
            <p className="text-sm text-gray-500">{firstColor}</p>
          </div>
          <p className="text-md font-medium text-gray-900">{product.price}</p>
        </div>
      </div>
    );
  }

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
        <div className="group relative  cursor-pointer overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
          <Link
            key={product._id}
            to={`/pack/${product.slug}`}
            className="block relative"
          >
            {/* Image / Slider */}
            <div className="relative w-full h-120 md:h-120 bg-gray-50 overflow-hidden">
              <Slider
                {...{
                  dots: true,
                  infinite: true,
                  autoplay: true,
                  autoplaySpeed: 3000,
                  speed: 800,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: false,
                  fade: true,
                }}
              >
                {mainMedia && (
                  <div>
                    <img
                      src={imageSrc}
                      alt={product.Title}
                      className="w-full h-120 md:h-120 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                {product.colors?.map((color, i) => (
                  <div key={color._id || i}>
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL_MEDIA}${
                        color.src
                      }`}
                      alt={color.name}
                      className="w-full h-72 md:h-120 object-cover"
                    />
                  </div>
                ))}
              </Slider>

              {/* Gradient overlay with title & price */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 flex justify-between items-center">
                <p className="text-[#87a736] font-bold text-sm md:text-base">
                  {product.price} د.ت
                </p>
                <h3 className="text-white text-sm md:text-base font-semibold truncate">
                  {product.title}
                </h3>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
