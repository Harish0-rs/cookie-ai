import React from 'react';
import { 
  Play, 
  Pause, 
  Film, 
  Mic2, 
  Music, 
  Subtitles, 
  Volume2,
  Clock
} from 'lucide-react';

export default function Timeline({
  currentTime,
  duration,
  words = [],
  videoTitle = "Minecraft Parkour",
  voiceName = "Christopher",
  musicTitle = "Lofi Chill",
  onSeek
}) {
  const effectiveDuration = Math.max(1, duration || 15);
  const playheadPercent = Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100));

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(pct * effectiveDuration);
  };

  return (
    <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800 p-4 space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white">Multi-Track Studio Timeline</span>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          <span className="text-purple-400 font-bold">{formatTime(currentTime)}</span>
          <span className="text-zinc-600"> / </span>
          <span>{formatTime(effectiveDuration)}</span>
        </div>
      </div>

      {/* Main Tracks Area with Playhead Scrubber */}
      <div 
        onClick={handleTimelineClick}
        className="relative bg-zinc-900/60 rounded-xl p-3 space-y-2 cursor-pointer border border-zinc-800 select-none overflow-hidden"
      >
        {/* Playhead Scrubber Needle */}
        <div 
          className="absolute top-0 bottom-0 z-30 w-0.5 bg-gradient-to-b from-purple-400 to-pink-500 pointer-events-none transition-all duration-75"
          style={{ left: `${playheadPercent}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-purple-500 shadow-md shadow-purple-500/50 -translate-x-[5px] -translate-y-1"></div>
        </div>

        {/* Track 1: Background Video */}
        <div className="flex items-center gap-2">
          <div className="w-24 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 shrink-0">
            <Film className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate">Visuals</span>
          </div>
          <div className="flex-1 h-7 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center px-3 relative overflow-hidden">
            <span className="text-[10px] font-bold text-blue-300 truncate z-10">
              {videoTitle} (Looping)
            </span>
            <div className="absolute inset-0 bg-blue-500/10 pattern-grid opacity-30"></div>
          </div>
        </div>

        {/* Track 2: Voiceover Speech */}
        <div className="flex items-center gap-2">
          <div className="w-24 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 shrink-0">
            <Mic2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Voiceover</span>
          </div>
          <div className="flex-1 h-7 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center px-3 relative overflow-hidden">
            <span className="text-[10px] font-bold text-emerald-300 truncate z-10">
              {voiceName} Speech Track
            </span>
            {/* Simulated audio waveform ripples */}
            <div className="absolute inset-y-0 right-3 flex items-center gap-0.5 opacity-60">
              {[12, 18, 24, 14, 22, 10, 26, 16, 20, 12, 18].map((h, i) => (
                <div key={i} className="w-1 bg-emerald-400 rounded-full" style={{ height: `${h}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Track 3: Background Music */}
        <div className="flex items-center gap-2">
          <div className="w-24 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 shrink-0">
            <Music className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate">Music</span>
          </div>
          <div className="flex-1 h-7 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center px-3 relative overflow-hidden">
            <span className="text-[10px] font-bold text-purple-300 truncate z-10">
              {musicTitle} (Ducked 18%)
            </span>
          </div>
        </div>

        {/* Track 4: Captions & Words Track */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-24 flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 shrink-0">
            <Subtitles className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">Captions</span>
          </div>
          <div className="flex-1 h-8 rounded-lg bg-zinc-950/80 border border-zinc-800/80 p-1 flex items-center gap-1 overflow-x-auto">
            {words.length > 0 ? (
              words.map((w, idx) => {
                const isActive = currentTime >= w.start && currentTime <= w.end;
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeek(w.start);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-amber-400 text-black scale-105 shadow-md shadow-amber-400/30'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {w.word}
                  </button>
                );
              })
            ) : (
              <span className="text-[10px] text-zinc-500 px-2 italic">
                Generate voiceover to unlock interactive word-by-word timeline markers
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
