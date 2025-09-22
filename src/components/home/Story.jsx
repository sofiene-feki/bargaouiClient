import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logoBlack from "../../assets/bragaouiBlack.png";
import { Input, LoadingProduct, NextArrow, PrevArrow, Textarea } from "../ui";
import {
  PlayIcon,
  PauseIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import CustomModal from "../ui/Modal";
import {
  createStorySlide,
  deleteStorySlide,
  getStorySlides,
} from "../../functions/storySlide";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

export default function Story() {
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [unmutedVideoId, setUnmutedVideoId] = useState(null); // only one unmuted video
  const [newSlide, setNewSlide] = useState({
    title: "",
    description: "",
    video: null,
    cta: "",
    link: "",
  });

  const [slides, setSlides] = useState([]);
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await getStorySlides();

      const formattedSlides = res.data.map((slide) => ({
        ...slide,
        videoUrl: slide.videoUrl
          ? `${API_BASE_URL_MEDIA}/${slide.videoUrl.replace(/\\/g, "/")}`
          : null,
      }));

      // Only add "create new story" card if user is logged in
      const newSlides = userInfo
        ? [{ isCreate: true }, ...formattedSlides]
        : formattedSlides;

      setSlides(newSlides);
      setAutoPlay(true);
    } catch (err) {
      console.error("❌ Failed to fetch slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []); // ✅ runs on mount and when user changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!newSlide.video) {
        alert("Please select a video before submitting.");
        return;
      }

      const formData = new FormData();
      formData.append("title", newSlide.title);
      formData.append("description", newSlide.description);
      formData.append("cta", newSlide.cta || "");
      formData.append("link", newSlide.link || "");
      formData.append("video", newSlide.video);

      // Call Axios function
      const res = await createStorySlide(formData);

      console.log("✅ New slide created:", res.data);
      alert("Slide created successfully!");

      // Optional: reset form
      setNewSlide({
        title: "",
        description: "",
        cta: "",
        link: "",
        video: null,
      });

      // Close modal
      setOpen(false);
    } catch (err) {
      console.error("❌ Error creating slide:", err);
      alert("Failed to create slide. Check console for details.");
    }
  };

  const handleDelete = async (slideId) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;

    try {
      await deleteStorySlide(slideId);
      // remove deleted slide from local state
      setSlides((prevSlides) => prevSlides.filter((s) => s._id !== slideId));
      alert("Slide deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete slide:", err);
      alert("Failed to delete slide. Check console for details.");
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    if (!newSlide.video) {
      setVideoSrc(null);
      return;
    }

    const url = URL.createObjectURL(newSlide.video);
    setVideoSrc(url);

    // Clean up old URL when component unmounts or file changes
    return () => URL.revokeObjectURL(url);
  }, [newSlide.video]);

  return (
    <div className="mx-auto md:mx-18  px-0 pb-10 ">
      <h2 className="text-3xl md:text-4xl font-semiBold tracking-tight text-gray-900 text-center my-4">
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
            <VideoSlide
              key={index}
              slide={slide}
              setOpen={setOpen}
              handleDelete={handleDelete}
              isAuthenticated={isAuthenticated}
              userInfo={userInfo}
              autoPlay={autoPlay}
              unmutedVideoId={unmutedVideoId}
              setUnmutedVideoId={setUnmutedVideoId}
            />
          ))}
        </Slider>
      )}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Crée une story"
        handleSubmit={handleSubmit}
        message={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Video Preview */}
            <div
              className="flex items-center justify-center w-[300px] md:w-full h-[250px] md:h-[350px] border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                !newSlide.video &&
                document.getElementById("video-upload").click()
              }
            >
              {newSlide.video ? (
                <video
                  controls
                  //autoPlay
                  loop
                  className="w-full h-full object-cover rounded-lg"
                  src={videoSrc}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Click to upload video</span>
                </div>
              )}

              {/* Hidden input */}
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setNewSlide({ ...newSlide, video: e.target.files[0] })
                }
                className="hidden"
              />
            </div>

            {/* Right Column: Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Submit new slide:", newSlide);
                setOpen(false); // close after save
              }}
              className="space-y-4"
            >
              {/* Title */}
              <Input
                label="Title"
                type="text"
                placeholder="Title"
                value={newSlide.title}
                onChange={(e) =>
                  setNewSlide({ ...newSlide, title: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-indigo-300"
                required
              />

              {/* Description */}
              <Textarea
                label="Description"
                placeholder="Description"
                value={newSlide.description}
                onChange={(e) =>
                  setNewSlide({ ...newSlide, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-indigo-300"
                required
              />

              {/* CTA */}
              <Input
                type="text"
                placeholder="CTA (e.g. Shop Now)"
                value={newSlide.cta}
                onChange={(e) =>
                  setNewSlide({ ...newSlide, cta: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-indigo-300"
              />
            </form>
          </div>
        }
      />
    </div>
  );
}

const VideoSlide = ({
  slide,
  setOpen,
  handleDelete,
  isAuthenticated,
  userInfo,
  autoPlay,
  unmutedVideoId,
  setUnmutedVideoId,
}) => {
  if (slide.isCreate && isAuthenticated && userInfo) {
    return (
      <>
        <div
          onClick={() => setOpen(true)}
          className="relative flex flex-col items-center justify-center h-[300px] md:h-[350px] bg-gray-50 border border-gray-300 rounded-xl mx-2 cursor-pointer hover:bg-gray-200 transition"
        >
          {/* Middle logo */}
          <img
            className="h-36 w-auto"
            src={logoBlack}
            alt="Your Company"
            draggable={false}
          />

          {/* Bottom circle with + */}
          <div className="absolute -bottom-6 w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
        <p className="mt-8 text-center text-gray-700 font-medium">
          Crée une story
        </p>
      </>
    );
  }

  if (slide.isCreate && !userInfo) {
    // Do not render anything for guests
    return null;
  }

  // Existing video slide
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (inView) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  // Only one video unmuted at a time
  useEffect(() => {
    if (!videoRef.current) return;
    if (unmutedVideoId !== slide._id) {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }, [unmutedVideoId]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    const currentlyMuted = videoRef.current.muted;
    if (currentlyMuted) {
      // Unmute this video and mute others
      setUnmutedVideoId(slide._id);
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      // Mute this video
      setUnmutedVideoId(null);
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Handle missing video
  if (!slide.videoUrl)
    return (
      <div
        ref={ref}
        className="relative w-full h-[300px] md:h-[350px] bg-gray-200 flex items-center justify-center text-gray-500"
      >
        Video unavailable
      </div>
    );

  return (
    <div className="relative w-full">
      <div
        ref={ref}
        className="relative w-full h-[300px] md:h-[350px] px-2 overflow-hidden"
      >
        <video
          ref={videoRef}
          src={slide.videoUrl}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button
            onClick={togglePlay}
            className="bg-gray-50/70 text-gray-800 rounded-full p-2 transition"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-gray-50/70 text-gray-800 rounded-full p-2 transition"
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-5 h-5" />
            ) : (
              <SpeakerWaveIcon className="w-5 h-5" />
            )}
          </button>
          {handleDelete && (
            <button
              onClick={() => handleDelete(slide._id)}
              className="bg-gray-50/70 text-gray-800 rounded-full p-2 transition"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center py-3 space-y-2 bg-white">
        <h2 className="text-xl md:text-3xl font-serif">{slide.title}</h2>
        <p className="text-gray-600 px-4 text-sm md:text-base">
          {slide.description}
        </p>
        {slide.link && (
          <a
            href={slide.link}
            className="inline-block font-semibold underline hover:text-gray-800 transition-colors duration-300"
          >
            {slide.cta || "Learn More"}
          </a>
        )}
      </div>
    </div>
  );
};
