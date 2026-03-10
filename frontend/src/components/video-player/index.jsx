import { useCallback, useEffect, useRef, useState } from "react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  AlertCircle
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) {
  console.log("[VideoPlayer] URL passed to player:", url);
  
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // State for seek indicator
  const [seekIndicator, setSeekIndicator] = useState({ show: false, type: null });
  const seekIndicatorTimeoutRef = useRef(null);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  function handlePlayAndPause() {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  }

  function triggerSeekIndicator(type) {
    if (seekIndicatorTimeoutRef.current) {
      clearTimeout(seekIndicatorTimeoutRef.current);
    }
    setSeekIndicator({ show: true, type });
    seekIndicatorTimeoutRef.current = setTimeout(() => {
      setSeekIndicator({ show: false, type: null });
    }, 800);
  }

  function handleRewind() {
    if (videoRef.current && isReady) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 5, 0);
      triggerSeekIndicator("rewind");
    }
  }

  function handleForward() {
    if (videoRef.current && isReady) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 5, duration || 0);
      triggerSeekIndicator("forward");
    }
  }

  function handleToggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  }

  function handleSeekChange(newValue) {
    setPlayed(newValue[0]);
    setSeeking(true);
  }

  function handleSeekMouseUp() {
    setSeeking(false);
    if (videoRef.current && isReady) {
      videoRef.current.currentTime = played * duration;
    }
  }

  function handleVolumeChange(newValue) {
    const newVolume = newValue[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  }

  function pad(string) {
    return ("0" + string).slice(-2);
  }

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());

    if (hh) {
      return `${hh}:${pad(mm)}:${ss}`;
    }

    return `${mm}:${ss}`;
  }

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      if (playerContainerRef?.current?.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullScreen]);

  function handleMouseMove() {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(
      () => setShowControls(false),
      3000
    );
  }

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          handlePlayAndPause();
          break;
        case "f":
          handleFullScreen();
          break;
        case "arrowleft":
          e.preventDefault();
          handleRewind();
          break;
        case "arrowright":
          e.preventDefault();
          handleForward();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playing, isFullScreen, handleFullScreen, duration, isReady]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Video element event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current && !seeking) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      if (dur > 0) {
        setPlayed(current / dur);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsReady(true);
      setError(null);
      console.log("[VideoPlayer] Video metadata loaded. Duration:", videoRef.current.duration);
    }
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleEnded = () => {
    setPlaying(false);
    setPlayed(1);
    if (onProgressUpdate) {
      onProgressUpdate({
        ...progressData,
        progressValue: 1,
      });
    }
  };

  const handleVideoError = (e) => {
    console.error("[VideoPlayer] Video element error:", e);
    setError("Unable to load video. The authentication may have expired or the video is unavailable. Please refresh the page.");
  };

  // Progress update callback (for course progress tracking)
  useEffect(() => {
    if (played === 1 && onProgressUpdate) {
      onProgressUpdate({
        ...progressData,
        progressValue: played,
      });
    }
  }, [played]);

  return (
    <div
      ref={playerContainerRef}
      className={`relative bg-gray-950 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out 
      ${isFullScreen ? "w-screen h-screen" : ""}
      `}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Native HTML5 Video Element for Cloudinary authenticated videos */}
      <video
        ref={videoRef}
        className="w-full h-full bg-black"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleVideoError}
        onClick={handlePlayAndPause}
        volume={volume}
      >
        {url && <source src={url} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>

      {/* Error State Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-50 px-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <p className="text-white font-medium mb-4">{error}</p>
          <div className="flex space-x-4">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="text-white border-white hover:bg-white/20 cursor-pointer"
            >
              Reload Page
            </Button>
          </div>
        </div>
      )}

      {/* Overlay to handle click when controls are hidden */}
      {isReady && !showControls && !error && (
        <div className="absolute inset-0 cursor-pointer" onClick={handlePlayAndPause} />
      )}

      {/* Seek Indicators */}
      {isReady && seekIndicator.show && !error && (
        <div className={`absolute ${seekIndicator.type === "rewind" ? "left-1/4" : "right-1/4"} top-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-50`}>
          <div className="bg-black/40 rounded-full p-4 flex flex-col items-center backdrop-blur-sm scale-110 md:scale-125 transition-transform duration-200">
            {seekIndicator.type === "rewind" ? (
              <>
                <RotateCcw className="text-white h-8 w-8 mb-1" />
                <span className="text-white font-bold">-5s</span>
              </>
            ) : (
              <>
                <RotateCw className="text-white h-8 w-8 mb-1" />
                <span className="text-white font-bold">+5s</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      {isReady && showControls && !error && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-md px-4 py-2 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[played * 100]}
            max={100}
            step={0.1}
            onValueChange={(value) => handleSeekChange([value[0] / 100])}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-2 cursor-pointer"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700 cursor-pointer"
              >
                {playing ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                onClick={handleRewind}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700 cursor-pointer"
                variant="ghost"
                size="icon"
                disabled={!isReady}
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleForward}
                className="text-white bg-transparent hover:text-white hover:bg-gray-700 cursor-pointer"
                variant="ghost"
                size="icon"
                disabled={!isReady}
              >
                <RotateCw className="h-6 w-6" />
              </Button>
              <div className="hidden md:flex items-center">
                <Button
                  onClick={handleToggleMute}
                  className="text-white bg-transparent hover:text-white hover:bg-gray-700 cursor-pointer"
                  variant="ghost"
                  size="icon"
                >
                  {muted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    handleVolumeChange([value[0] / 100])
                  }
                  className="w-24"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-white text-sm">
                {formatTime(played * (duration || 0))}/{" "}
                {formatTime(duration || 0)}
              </div>
              <Button
                className="text-white bg-transparent hover:text-white hover:bg-gray-700 cursor-pointer"
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
              >
                {isFullScreen ? (
                  <Minimize className="h-6 w-6" />
                ) : (
                  <Maximize className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;