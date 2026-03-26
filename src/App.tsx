import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Gamepad2, Headphones, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--color-neon-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-neon-blue) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl flex items-center justify-between mb-8 z-10"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-blue/10 rounded-lg neon-border-blue">
            <Terminal className="text-neon-blue" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-neon-blue neon-text-blue uppercase italic">
              NEON_CORE v2.0
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
              System Status: <span className="text-neon-green">Operational</span>
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/30">Latency</span>
            <span className="text-xs font-mono text-neon-blue">12ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-white/30">Uptime</span>
            <span className="text-xs font-mono text-neon-blue">99.9%</span>
          </div>
          <div className="w-12 h-12 rounded-full neon-border-blue flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Left Sidebar - Stats & Info */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 flex flex-col gap-6"
        >
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white/60 mb-2">
              <Activity size={16} className="text-neon-blue" />
              <span className="text-xs uppercase font-bold tracking-widest">System Load</span>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-white/40 uppercase">
                  <span>Core {i}</span>
                  <span>{Math.floor(Math.random() * 40 + 20)}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-neon-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 40 + 20}%` }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 + i }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
              <Gamepad2 size={16} className="text-neon-green" />
              Controls
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['↑', '←', '↓', '→'].map((key, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white/40">
                  {key}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-white/30 text-center uppercase tracking-widest">
              Use arrows to navigate
            </p>
          </div>
        </motion.div>

        {/* Center - Snake Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-6 flex flex-col items-center justify-center"
        >
          <div className="relative p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-neon-blue/20">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-neon-blue rounded-full text-black text-[10px] font-black uppercase tracking-[0.4em] shadow-lg shadow-neon-blue/50">
              Battle_Grid.exe
            </div>
            <SnakeGame />
          </div>
        </motion.div>

        {/* Right Sidebar - Music Player */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white/60 px-2">
              <Headphones size={16} className="text-neon-pink" />
              <span className="text-xs uppercase font-bold tracking-widest">Audio Stream</span>
            </div>
            <MusicPlayer />
          </div>

          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              Recent Highscores
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { name: 'CYBER_PUNK', score: 1240 },
                { name: 'NEO_TRON', score: 980 },
                { name: 'SYNTH_WAVE', score: 850 }
              ].map((entry, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-mono">0{i+1} {entry.name}</span>
                  <span className="text-neon-blue font-bold">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-[10px] uppercase tracking-[0.5em] text-white/20 z-10"
      >
        © 2026 NEON_CORE SYSTEMS // ALL RIGHTS RESERVED
      </motion.footer>

      {/* Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
