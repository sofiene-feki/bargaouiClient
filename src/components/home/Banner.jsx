import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import {
  ChevronDoubleRightIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import bannerBG from "../../assets/bannerBG.jpg";
import iso9001 from "../../assets/Iso9001.png";
import iso14001 from "../../assets/Iso14001.png";
import iso45001 from "../../assets/Iso45001.png";
import men from "../../assets/men.jpg";
import women from "../../assets/women.jpg";
import kid from "../../assets/kid.jpg";

export default function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Remove arrows for a cleaner look
  };

  const slides = [
    {
      title: "For Men",
      img: men,
      button: "Learn More",
      link: "/about",
    },
    {
      title: "For Women",
      img: women,
      button: "Explore",
      link: "/products",
    },
    {
      title: "For kid's",
      img: kid,
      button: "Contact Us",
      link: "/contact",
    },
  ];

  return (
    <div className="h-full mx-auto md:mx-10 shadow-xl  bg-white z-60">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative w-full">
            {/* Image */}
            <div className="w-full h-[600px] md:h-[550px]">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover "
              />
            </div>

            {/* Text & Button at the bottom */}
            <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center text-center p-6 gap-3 bg-gradient-to-t from-black/60 to-transparent">
              <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                {slide.title}
              </h2>

              <Link to={slide.link}>
                <button className="bg-white/30 hover:bg-white/50 text-black font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition">
                  {slide.button} <ChevronDoubleRightIcon className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
