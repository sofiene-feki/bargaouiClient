import React, { useEffect, useRef, useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { TrashIcon, PlayIcon } from "@heroicons/react/24/outline";
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

  return (
    <div className="w-full lg:w-1/2 md:mb-6 mb-3 lg:mb-0">
      {/* Main Media */}
      <div className="mb-4">
        {selectedMedia ? (
          selectedMedia.type === "image" ? (
            <img
              src={selectedMedia.src}
              alt={selectedMedia.alt}
              className="w-full h-auto  max-h-[500px] object-cover rounded-lg shadow-md"
            />
          ) : (
            <video
              src={selectedMedia.src}
              controls
              className="w-full h-auto rounded-lg shadow-md"
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
      <div className="flex flex-wrap gap-3 justify-start">
        {media.map((mediaItem, idx) => (
          <div key={idx} className="relative">
            <button
              onClick={() => onSelectMedia(mediaItem)}
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
                className="absolute top-1 right-1 
                 bg-red-50 rounded-full p-1.5 
                 shadow-sm text-red-500 
                 hover:bg-red-90 
                 transition-colors
                 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}

        {isEditable && (
          <>
            <Menu as="div">
              <MenuButton className="relative flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
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
                className="w-52 origin-top-right rounded-xl border border-white/5 bg-gray-50 p-1 text-sm/6 text-gray-600 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
              >
                {/* First menu action */}
                <MenuItem
                  as="button"
                  onClick={() => setOpen(true)}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-white"
                >
                  <FaRegImage />
                  Choisir une photo
                </MenuItem>

                {/* Second menu action */}
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

            {/* ✅ Modal outside of Menu */}
            <CustomModal
              open={open}
              setOpen={setOpen}
              title="Importer une photo"
              message={
                <div className="grid grid-cols-3 gap-4">
                  {mediaGallery.map((url, i) => (
                    <div key={i} className="relative w-full h-40">
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
                        onClick={() => handleDelete(url)}
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
      </div>
    </div>
  );
}
