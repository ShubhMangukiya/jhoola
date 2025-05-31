"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"
import video from "../image/zulavideo.mp4" // Import your video file if needed
import women from "../image/women.png";
const Background = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    const videoElement = document.getElementById("background-video")
    if (isPlaying) {
      videoElement.pause()
    } else {
      videoElement.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Video Container with Responsive Design */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        {/* Background Image (shown before video plays) */}
        <div className="absolute inset-0 z-0">
          <img
            src={women}
            alt="Background"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Video Element */}
        <video
          id="background-video"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          poster="/placeholder.svg"
          controls={false}
          playsInline
        >
          <source
            src={video}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={togglePlay}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Background
