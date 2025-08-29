import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getBestSellers } from "../../functions/product"; // API call
import Product from "../product/Product";
import { LoadingProduct, NextArrow, PrevArrow } from "../ui";
import { Link } from "react-router-dom";
import video1 from "../../assets/video/video1.mp4";
import video2 from "../../assets/video/video2.mp4";
import video3 from "../../assets/video/video3.mp4";
import video4 from "../../assets/video/video4.mp4";
import {
  PlayIcon,
  PauseIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const slides = [
    {
      video: video1,
      title: "Spring Collection 2025",
      description:
        "See how our beautiful dresses are crafted from start to finish.",
      cta: "Shop Now",
      link: "/collection/spring-2025",
    },
    {
      video: video2,
      title: "Latest News",
      description: "Check out the newest arrivals and updates in our shop.",
      cta: "Explore",
      link: "/news",
    },
    {
      video: video3,
      title: "Upcoming Event",
      description: "Join us for our exciting events and special showcases.",
      cta: "Discover",
      link: "/events",
    },
    {
      video: video4,
      title: "Handmade Collection",
      description:
        "Explore our handcrafted products, made with love and precision.",
      cta: "Browse",
      link: "/handmade",
    },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SERVER_URL = "https://supersiesta-server-i63m.onrender.com";

  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    if (Array.isArray(input)) {
      return input.map((product) => normalizeMediaSrc(product));
    }

    if (!input.media) return input;

    const normalizedMedia = input.media.map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : SERVER_URL + m.src,
    }));

    return { ...input, media: normalizedMedia };
  };

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        const { data } = await getBestSellers();
        const normalizedProducts = normalizeMediaSrc(data.products || []);
        setProducts(normalizedProducts);
        console.log(
          "✅ Best sellers fetched and normalized:",
          normalizedProducts
        );
      } catch (err) {
        console.error("❌ Error fetching best sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const desktopSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const mobileSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    centerMode: false,
  };

  return (
    <div className="max-w-7xl mx-auto px-0 py-10 ">
      <h2 className="text-2xl md:text-4xl font-serif text-center my-4">
        Artisanat Bargaoui Services
      </h2>

      {loading ? (
        <LoadingProduct length={isMobile ? 1 : 4} cols={4} />
      ) : (
        <Slider
          className="shadow-lg md:shadow-xl hover:shadow-2xl transition-shadow duration-300 py-2 md:border border-gray-200 bg-white"
          {...(isMobile ? mobileSettings : desktopSettings)}
        >
          {slides.map((slide, index) => (
            <VideoSlide key={index} slide={slide} />
          ))}
        </Slider>
      )}
    </div>
  );
}

const VideoSlide = ({ slide }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full ">
      {/* Video */}
      <div className="relative w-full px-2 h-[300px] md:h-[350px] overflow-hidden">
        <video
          ref={videoRef}
          src={slide.video}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Controls Positioned on Video */}
        <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
          <button
            onClick={togglePlay}
            className="bg-gray-50/70  text-gray-800 rounded-full p-2  transition"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-gray-50/70  text-gray-800 rounded-full p-2 rounded-full p-2  transition"
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-5 h-5" />
            ) : (
              <SpeakerWaveIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center py-3 space-y-2 bg-white">
        <h2 className="text-xl md:text-3xl font-serif">{slide.title}</h2>
        <p className="text-gray-600 px-4 text-sm md:text-base">
          {slide.description}
        </p>
        <a
          href={slide.link}
          className="inline-block font-semibold underline hover:text-gray-800 transition-colors duration-300"
        >
          {slide.cta}
        </a>
      </div>
    </div>
  );
};
