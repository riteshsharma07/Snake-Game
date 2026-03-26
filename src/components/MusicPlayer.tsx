import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/300/300"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/300/300"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Synth Mind",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/300/300"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md p-6 rounded-2xl bg-black/40 backdrop-blur-xl neon-border-pink relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-pink opacity-50" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6">
        <motion.div 
          key={currentTrack.id}
          initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          className="relative w-24 h-24 flex-shrink-0"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-lg neon-border-pink"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 bg-neon-pink p-1 rounded-full shadow-lg shadow-neon-pink/50">
              <Music size={12} className="text-black" />
            </div>
          )}
        </motion.div>

        <div className="flex-grow min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
            >
              <h3 className="text-lg font-bold truncate text-neon-pink neon-text-pink">{currentTrack.title}</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest truncate">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between gap-4">
            <button onClick={skipBackward} className="text-white/60 hover:text-neon-pink transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-neon-pink flex items-center justify-center text-black hover:scale-110 transition-transform shadow-lg shadow-neon-pink/40"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={skipForward} className="text-white/60 hover:text-neon-pink transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.8)]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/30 font-mono">01:42</span>
          <div className="flex items-center gap-1 text-[10px] text-white/30 font-mono">
            <Volume2 size={10} />
            <span>MAX</span>
          </div>
        </div>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center gap-1 h-8 mt-4 opacity-30">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-neon-pink rounded-t-sm"
            animate={{ 
              height: isPlaying ? [4, Math.random() * 24 + 4, 4] : 4 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};
