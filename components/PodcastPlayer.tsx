"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";
import { 
  Play, 
  Pause,
  Volume2, 
  VolumeX,
  Heart,
  Gauge,
  FastForward
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { formatTime } from "@/lib/formatTime";
import { cn } from "@/lib/utils";
import { useAudio } from "@/providers/AudioProvider";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";

const PodcastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { audio } = useAudio();

  const togglePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current?.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted((prev) => !prev);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0) {
        setIsMuted(false);
        audioRef.current.muted = false;
      } else {
        setIsMuted(true);
        audioRef.current.muted = true;
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const forward = () => {
    if (
      audioRef.current &&
      audioRef.current.currentTime &&
      audioRef.current.duration &&
      audioRef.current.currentTime + 10 < audioRef.current.duration
    ) {
      audioRef.current.currentTime += 10;
    }
  };

  const rewind = () => {
    if (audioRef.current && audioRef.current.currentTime - 10 > 0) {
      audioRef.current.currentTime -= 10;
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === "ArrowLeft") {
        rewind();
      } else if (e.code === "ArrowRight") {
        forward();
      } else if (e.code === "KeyM") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);

      // The useEffect hook returns a cleanup function. This function is executed when the component is unmounted.
      // The cleanup function removes the event listener that was added earlier, preventing memory leaks and ensuring that the component is properly cleaned up when it's no longer needed.
      return () => {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audio?.audioUrl) {
      if (audioElement) {
        audioElement.play().then(() => {
          setIsPlaying(true);
        });
      }
    } else {
      audioElement?.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div
      className={cn("sticky bottom-0 left-0 flex size-full flex-col", {
        hidden: !audio?.audioUrl || audio?.audioUrl === "",
      })}
    >
      <div className="relative w-full">
        <Progress
          value={(currentTime / duration) * 100}
          className="h-1 w-full bg-gray-800"
          indicatorClassName="bg-primary"
          max={duration === 0 ? 100 : duration}
        />
      </div>

      <section className="glassmorphism-black flex h-20 w-full items-center justify-between px-4 md:px-8">
        <audio
          ref={audioRef}
          src={audio?.audioUrl}
          className="hidden"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
        />
        
        {/* Left Section - Album Art and Title */}
        <div className="flex items-center gap-4 min-w-[200px] max-w-[300px]">
          <Link href={`/podcasts/${audio?.podcastId}`}>
            <Image
              src={audio?.imageUrl || "/images/player1.png"}
              width={48}
              height={48}
              alt="player1"
              className="aspect-square rounded-lg hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-base font-bold text-[#ffffff] hover:text-primary transition-colors">
              {audio?.title}
            </h2>
            <p className="text-xs font-normal text-gray-400 truncate">{audio?.author}</p>
          </div>
        </div>

        {/* Center Section - Player Controls */}
        <div className="flex items-center justify-center gap-8 flex-1 max-w-[400px]">
          <button 
            className="text-white hover:text-primary transition-colors"
            onClick={rewind}
            title="Rewind 10s (Left Arrow)"
          >
            <FastForward className="h-5 w-5 transform rotate-180" stroke="white" />
          </button>

          <button
            className="flex-center h-10 w-10 rounded-full bg-primary hover:bg-primary/80 transition-colors"
            onClick={togglePlayPause}
            title="Play/Pause (Space)"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" stroke="white"/>
            ) : (
              <Play className="h-6 w-6 translate-x-0.5" stroke="white"/>
            )}
          </button>

          <button 
            className="text-white hover:text-primary transition-colors"
            onClick={forward}
            title="Forward 10s (Right Arrow)"
          >
            <FastForward className="h-5 w-5" stroke="white" />
          </button>
        </div>

        {/* Right Section - Volume and Settings */}
        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          <button
            onClick={toggleLike}
            className={cn(
              "text-white hover:text-primary transition-colors",
              isLiked && "text-primary"
            )}
            title="Add to favorites"
          >
            <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} stroke="white"/>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-primary transition-colors"
              title="Toggle Mute (M)"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" stroke="white" />
              ) : (
                <Volume2 className="h-5 w-5" stroke="white" />
              )}
            </button>
            <Slider
              defaultValue={[1]}
              max={1}
              step={0.1}
              value={[volume]}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-white hover:text-primary transition-colors" title="Playback Speed">
                <Gauge className="h-5 w-5" stroke="white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <DropdownMenuItem
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  className={cn(
                    "cursor-pointer text-gray-600 bg-black-3 hover:bg-black-2",
                    playbackRate === rate && "text-[#ffffff]"
                  )}
                >
                  {rate}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
    </div>
  );
};

export default PodcastPlayer;