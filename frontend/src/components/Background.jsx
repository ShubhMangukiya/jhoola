import { useState, useEffect, useRef } from "react"
import { Play, Pause } from "lucide-react"
import women from "../image/women.png";
import { API_URL } from "./Variable";

const Background = () => {
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`${API_URL}/api/video`)
        const data = await res.json()
        if (data.video) {
          // Ensure full URL, add base if missing
          const url = data.video.startsWith('http') ? data.video : `${API_URL}${data.video}`
          setVideoUrl(url)
        } else {
          console.error("No video URL found in API response")
        }
      } catch (err) {
        console.error("Failed to fetch video URL", err)
      }
    }
    fetchVideo()
  }, [])

  useEffect(() => {
  const vid = videoRef.current;
  if (!vid) return;

  const onEnded = () => {
    console.log("Video ended");
    setIsPlaying(false);
  };

  const onTimeUpdate = () => {
    console.log(`Current time: ${vid.currentTime}`);
  };

  vid.addEventListener("ended", onEnded);
  vid.addEventListener("timeupdate", onTimeUpdate);

  return () => {
    vid.removeEventListener("ended", onEnded);
    vid.removeEventListener("timeupdate", onTimeUpdate);
  };
}, []);


  const togglePlay = () => {
  const videoElement = videoRef.current;
  if (!videoElement) return;

  if (isPlaying) {
    videoElement.pause();
    setIsPlaying(false);
  } else {
    videoElement.play();
    setIsPlaying(true);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={women}
            alt="Background"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Video Element */}
        {videoUrl ? (
          <video
            ref={videoRef}
            id="background-video"
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            poster="/placeholder.svg"
            controls={false}
            playsInline
            muted // Try muted to allow autoplay
            preload="metadata"
          >
            <source
              src={videoUrl}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Loading video...
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={togglePlay}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center"
            disabled={!videoUrl}
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
