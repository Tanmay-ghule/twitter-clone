"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface Props {
  src: string;
}

const AudioPlayer = ({ src }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
      setCurrentTime(formatTime(audio.currentTime));
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-3 flex items-center gap-4">
      <button
        onClick={togglePlay}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition shrink-0"
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <div className="flex-1">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <span className="text-gray-400 text-xs shrink-0">
        {currentTime} / {duration}
      </span>

      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(formatTime(audioRef.current.duration));
          }
        }}
      />
    </div>
  );
};

export default AudioPlayer;
