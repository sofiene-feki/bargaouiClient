import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { TbCameraPlus } from "react-icons/tb";
import men from "../../assets/men.jpg";
import women from "../../assets/women.jpg";
import kid from "../../assets/kid.jpg";
import brag from "../../assets/brag.jpg";

import CustomModal from "../ui/Modal";
import ProductMediaGallery from "../product/ProductMediaGallery";
import { Input } from "../ui";
import { createBanner, getBanners, removeBanner } from "../../functions/banner";
import { useSelector } from "react-redux";

export default function Banner() {
  const [open, setOpen] = useState(false);
  const [mediaGallery, setMediaGallery] = useState([men, women, kid]); // initial media for demo
  const user = useSelector((state) => state.user.userInfo);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const [slides, setSlides] = useState([]);
  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA; // temp, change to prod URL

  const normalizeBannerSrc = (input) => {
    if (!input) return input;

    // If array of banners
    if (Array.isArray(input)) {
      return input.map((item) => normalizeBannerSrc(item));
    }

    // Normalize single banner
    return {
      ...input,
      img: input.img?.startsWith("http")
        ? input.img
        : API_BASE_URL_MEDIA + input.img,
    };
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await getBanners(); // array of banners from backend
        const normalizedSlides = normalizeBannerSrc(data).map((banner) => ({
          title: banner.title,
          img: banner.img,
          button: "Learn More", // default text
          link: banner.link || "/",
        }));
        setSlides(normalizedSlides);
        console.log("✅ Slides fetched and normalized:", normalizedSlides);
      } catch (err) {
        console.error("❌ Error fetching banners:", err);
      }
    };

    fetchSlides();
  }, []);
  const [newSlide, setNewSlide] = useState({
    title: "",
    img: "",
    button: "",
    link: "",
  });

  const handleDelete = async (_id) => {
    try {
      await removeBanner(_id);
      // remove deleted slide from local state
      setSlides(slides.filter((_, i) => i !== index));
      alert("Slide deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete slide:", err);
      alert("Failed to delete slide. Check console for details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", newSlide.title);
      formData.append("link", newSlide.link);
      if (newSlide.file) formData.append("file", newSlide.file);

      const response = await createBanner(formData);
      console.log("✅ Banner created:", response.data);
      alert("Banner created successfully!");

      // Optionally reset newSlide after success
      setNewSlide({
        title: "",
        img: "",
        button: "",
        link: "",
        preview: "",
        file: null,
      });

      // refresh local slides with backend response (if you want live sync)
      setSlides((prev) => [
        ...prev,
        {
          title: response.data.title,
          img: response.data.img,
          button: newSlide.button, // button isn't in backend, keep local
          link: response.data.link,
        },
      ]);
    } catch (error) {
      console.error("❌ Error creating banner:", error);
      alert("Error creating banner!");
    }
  };
  return (
    <div className="h-full mx-auto md:mx-10 bg-transparent z-1000">
      <div className="relative w-full">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative w-full">
              {/* Image */}
              <div className="w-full h-[600px] md:h-[550px]">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text & Buttons (except Manage Pictures) */}
              <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center text-center p-6 gap-3 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                  {slide.title}
                </h2>

                <div className="flex gap-2">
                  <Link to={slide.link}>
                    <button className="flex bg-white/30 backdrop-blur-md text-white px-6 py-2 border border-white hover:bg-white/50 transition">
                      {slide.button}
                      <ChevronDoubleRightIcon className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Fixed Manage Pictures button */}
        {user && (
          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-4 gap-2 right-4 z-10 flex bg-white/30 backdrop-blur-md text-white px-4 py-2 border border-white hover:bg-white/50 transition"
          >
            <TbCameraPlus className="h-6 w-6" />
            <span className="hidden sm:inline">Manage Pictures</span>
          </button>
        )}
      </div>

      {/* Modal */}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Importer une photo"
        message={
          <div className="space-y-4">
            {/* Slides grid with add new card first */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Add New Slide Card */}
              <div className="relative border border-gray-200 flex flex-col">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded text-gray-400">
                  {newSlide.preview ? (
                    <img
                      src={newSlide.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const previewUrl = URL.createObjectURL(file);
                          setNewSlide({
                            ...newSlide,
                            file,
                            img: previewUrl, // 👈 set img so AddSlide works
                            preview: previewUrl,
                          });
                        }
                      }}
                    />
                  )}
                </div>
                <div className="mt-2 px-2 space-y-2">
                  <Input
                    name="Title"
                    placeholder="Title"
                    value={newSlide.title}
                    onChange={(e) =>
                      setNewSlide({ ...newSlide, title: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />

                  <Input
                    name="Button Text"
                    placeholder="Button Text"
                    value={newSlide.button}
                    onChange={(e) =>
                      setNewSlide({ ...newSlide, button: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                  <Input
                    name="Link"
                    placeholder="Link"
                    value={newSlide.link}
                    onChange={(e) =>
                      setNewSlide({ ...newSlide, link: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                  />
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Add Slide
                  </button>
                </div>
              </div>

              {/* Existing slides */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200  overflow-hidden"
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-70 object-cover"
                  />
                  <div className="p-2">
                    <p className="font-bold">{slide.title}</p>
                    <p className="text-sm">
                      {slide.button} → {slide.link}
                    </p>
                  </div>
                  <button
                    onClick={() => console.log(slide._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
