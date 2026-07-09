"use client";

import { useEffect, useRef } from "react";

const VIDEO_URL =
  "https://res.cloudinary.com/dprydfxok/video/upload/v1782586973/portfolio_hero_bg_zuhahj.webm";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Video autoplay was prevented:", error);
      });
    }

    const handleEnded = () => {
      console.log("Hero background video reached the last frame.");
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="video-container">
      <video
        id="heroVideo"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop={false}
        src={VIDEO_URL}
      />
    </div>
  );
}
