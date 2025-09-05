import React, { useEffect, useRef, useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import {
  TrashIcon,
  PlayIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaRegImage, FaUpload } from "react-icons/fa";
import CustomDialog from "../ui/Dialog";
import CustomModal from "../ui/Modal";
import { deleteMedia, getAllMedia } from "../../functions/media";

export default function ProductMediaGallery({
  media = [],
  selectedMedia,
  onSelectMedia,
  onAddMedia,
  onDeleteMedia,
  isEditable = false,
  height,
  minHeight,
  maxHeight,
  shrink,
}) {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const [open, setOpen] = useState(false);

  const [mediaGallery, setMediaGallery] = useState([]);

  const fetchMedia = () => {
    getAllMedia()
      .then((res) => setMediaGallery(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = (url) => {
    const filename = url.split("/").pop();
    deleteMedia(filename)
      .then(() => fetchMedia())
      .catch((err) => console.error(err));
  };

  const thumbRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // detect mobile vs desktop
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(max-width: 768px)");
      setIsMobile(mq.matches);
      const listener = (e) => setIsMobile(e.matches);
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, []);

  const showArrows = media.length > (isMobile ? 4 : 6);

  return (
    <div className="md:mb-6 mb-3 lg:mb-0 bg-white">
      {/* Main Media */}
      <div className="mb-4">
        {selectedMedia ? (
          selectedMedia.type === "image" ? (
            <div
              className="w-full relative flex items-center justify-center  shadow-md overflow-hidden"
              style={{
                backgroundImage: `url(${selectedMedia.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Blurred background */}
              <div className="absolute inset-0 backdrop-blur-2xl brightness-110"></div>

              {/* Gradient fade overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20"></div>

              {/* Foreground product image */}
              <img
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                className="relative z-10 w-full h-auto object-contain "
                style={{
                  maxHeight: `${shrink ? minHeight : maxHeight}px`,
                }}
              />
            </div>
          ) : (
            <video
              src={selectedMedia.src}
              controls
              className="w-full h-auto  shadow-md"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-80 md:w-1/1 md:h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-center cursor-pointer hover:bg-gray-200 transition">
            <TbCameraPlus className="h-10 w-10 mb-2 text-gray-400" />
            <p>No media</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {/* Thumbnails Slider */}
      <div
        className={`relative px-2 transition-transform duration-500 ease-in-out`}
        style={{
          transform: shrink ? "scale(0.85)" : "scale(1)", // shrink thumbnails together
          transformOrigin: "top center",
        }}
      >
        {/* Scrollable container */}
        <div
          ref={thumbRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {media.map((mediaItem, idx) => (
            <div
              key={idx}
              className="relative flex-shrink-0 transition-all duration-500 ease-in-out"
            >
              <button
                onClick={() => onSelectMedia(mediaItem)}
                className={`relative md:w-20 md:h-20 w-16 h-16 border-2 rounded-md overflow-hidden transition-all duration-500 ease-in-out ${
                  selectedMedia?.src === mediaItem.src
                    ? "border-[#87a736]"
                    : "border-gray-300"
                }`}
                style={{
                  width: shrink ? "3.8rem" : "4rem", // md: w-16 or 20 scaled
                  height: shrink ? "3.8rem" : "4rem",
                }}
              >
                {mediaItem.type === "image" ? (
                  <img
                    src={mediaItem.src}
                    alt={mediaItem.alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      src={mediaItem.src}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="rounded-full bg-gray-50/74 border border-white p-2">
                        <PlayIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                  </>
                )}
              </button>

              {isEditable && (
                <button
                  onClick={() => onDeleteMedia(idx)}
                  className="absolute top-1 right-1 bg-red-50 rounded-full p-1.5 shadow-sm text-red-500 hover:bg-red-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {/* Add Media Button */}
          {isEditable && (
            <Menu as="div" className="flex-shrink-0">
              <MenuButton
                className="relative flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-500 ease-in-out"
                style={{
                  width: shrink ? "3rem" : "4rem",
                  height: shrink ? "3rem" : "4rem",
                }}
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <TbCameraPlus className="h-6 w-6 text-indigo-500" />
                  <span className="md:text-[10px] text-[8px] text-gray-400 text-center ">
                    Image / Vidéo
                  </span>
                </div>
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom end"
                className="w-52 origin-top-right rounded-xl border border-white/5 bg-gray-50 p-1 text-sm/6 text-gray-600 transition duration-100 ease-out focus:outline-none"
              >
                <MenuItem
                  as="button"
                  onClick={() => setOpen(true)}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white"
                >
                  <FaRegImage />
                  Choisir une photo
                </MenuItem>

                <MenuItem
                  as="button"
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5"
                  onClick={handleFileClick}
                >
                  <FaUpload />
                  Importer une photo
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
        </div>

        {/* Scroll Arrows */}
        {media.length > (window.innerWidth < 768 ? 4 : 6) && (
          <>
            <button
              onClick={() =>
                thumbRef.current.scrollBy({ left: -150, behavior: "smooth" })
              }
              className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white/50 rounded-full p-2 shadow-xl hover:bg-gray-100 transition flex items-center justify-center"
            >
              <ChevronLeftIcon className="w-3 h-3 text-gray-700" />
            </button>
            <button
              onClick={() =>
                thumbRef.current.scrollBy({ left: 150, behavior: "smooth" })
              }
              className="absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-white/50 rounded-full p-2 shadow-xl hover:bg-gray-100 transition flex items-center justify-center"
            >
              <ChevronRightIcon className="w-3 h-3 text-gray-700" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
