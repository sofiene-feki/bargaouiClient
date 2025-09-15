import React, { useEffect, useMemo, useRef, useState } from "react";
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
import HorizontalSlider from "../ui/HorizontalSlider";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductMediaGallery({
  media = [],
  selectedMedia,
  onSelectMedia,
  onAddMedia,
  onDeleteMedia,
  isEditable = false,
  galleryClassName,
  setSelectedMedia,
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
  const sliderRef = useRef(null);

  const sliderData = useMemo(() => {
    if (!selectedMedia) return media;

    // Always rebuild: put selectedMedia at start, then rest of media without duplicates
    const filtered = media.filter((m) => m.src !== selectedMedia.src);
    return [selectedMedia, ...filtered];
  }, [media, selectedMedia]);

  // ✅ Always 0 because selectedMedia is forced to be first
  const selectedIndex = 0;

  useEffect(() => {
    if (sliderRef.current && selectedMedia) {
      sliderRef.current.slickGoTo(0); // jump to first slide
    }
  }, [selectedMedia]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => {
      onSelectMedia(sliderData[newIndex]); // sync when sliding
    },
  };
  return (
    <div className="w-full  md:mb-6 lg:mb-0">
      {/* Main Media */}
      <div className="mb-4">
        {sliderData && sliderData.length > 0 ? (
          <>
            {/* Desktop view */}
            <div className="hidden lg:block aspect-square bg-black w-full">
              {selectedMedia ? (
                selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.src}
                    alt={selectedMedia.alt || ""}
                    className="w-full h-full object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <video
                    src={selectedMedia.src}
                    controls
                    className="w-full h-auto max-h-[500px] rounded-lg shadow-md"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] border rounded-lg">
                  <TbCameraPlus className="h-10 w-10 mb-2 text-gray-400" />
                  <p>No media</p>
                </div>
              )}
            </div>

            {/* Mobile view with slider */}
            <div className="block lg:hidden">
              <Slider ref={sliderRef} {...settings}>
                {sliderData.map((m, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-black w-full h-[450px] flex items-center justify-center"
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.src}
                        alt={m.alt || ""}
                        className="w-full h-full object-contain rounded-lg shadow-md"
                      />
                    ) : (
                      <video
                        src={m.src}
                        controls
                        className="w-full h-full object-contain rounded-lg shadow-md"
                      />
                    )}
                  </div>
                ))}
              </Slider>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] border rounded-lg">
            <TbCameraPlus className="h-10 w-10 mb-2 text-gray-400" />
            <p>No media</p>
          </div>
        )}
      </div>
      {/* Thumbnails */}
      {/* Thumbnails Slider */}
      <div className="relative">
        {/* Thumbnails container */}
        <div
          ref={thumbRef}
          className={`
      flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth
      ${isEditable ? "block" : "hidden lg:flex"} 
      `}
        >
          <HorizontalSlider scrollAmount={150}>
            {media.map((mediaItem, idx) => (
              <div key={idx} className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    console.log("Clicked media:", mediaItem);
                    onSelectMedia(mediaItem);
                  }}
                  className={`relative md:w-20 md:h-20 w-16 h-16 border-2 rounded-md overflow-hidden ${
                    selectedMedia?.src === mediaItem.src
                      ? "border-[#87a736]"
                      : "border-gray-300"
                  }`}
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
                    className="absolute top-1 right-1 bg-red-50 rounded-full p-1.5 
                shadow-sm text-red-500 hover:bg-red-90 transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}

            {/* Add new media button (only editable) */}
            {isEditable && (
              <>
                <Menu as="div" className="flex-shrink-0">
                  <MenuButton className="relative flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <TbCameraPlus className="h-6 w-6 text-indigo-500" />
                      <span className="md:text-[10px] text-[8px] text-gray-400 text-center">
                        Image / Vidéo
                      </span>
                    </div>
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-52 origin-top-right rounded-xl border border-white/5 bg-gray-50 p-1 text-sm/6 text-gray-600 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
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

                <CustomModal
                  open={open}
                  setOpen={setOpen}
                  title="Importer une photo"
                  message={
                    <div className="grid grid-cols-3 gap-4">
                      {mediaGallery.map((url, i) => (
                        <div
                          key={i}
                          className="relative w-full h-40"
                          onDoubleClick={() => {
                            const newSelected = {
                              src: url,
                              alt: url.split("/").pop(), // just the filename
                              type: url.match(/\.(mp4|mov|m4v)$/i)
                                ? "video"
                                : "image",
                              file: null, // no File object from server
                            };
                            setSelectedMedia(newSelected);
                            console.log("Selected media:", newSelected);
                          }}
                        >
                          {url.match(/\.(mp4|mov|m4v)$/i) ? (
                            <video
                              src={url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent triggering double click
                              handleDelete(url);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  }
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.mov,.mp4,.m4v"
                  onChange={onAddMedia}
                  className="hidden"
                />
              </>
            )}
          </HorizontalSlider>
        </div>
      </div>
         
    </div>
  );
}
