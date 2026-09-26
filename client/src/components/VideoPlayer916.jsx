import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles,
  Repeat
} from 'lucide-react';
import { drawCaptions } from '../services/canvasExporter';

const VideoPlayer916 = forwardRef(function VideoPlayer916({
  videoUrl,
  voiceAudioUrl,
  musicAudioUrl,
  words = [],
  captionStyle = {},
  duration = 15,
  musicVolume = 0.18,
  voiceVolume = 1.0,
  onTimeUpdate,
  seekTime
}, ref) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const voiceAudioRef = useRef(null);
  const musicAudioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(true);

  // Expose elements to parent for ExportModal recording
  useImperativeHandle(ref, () => ({
    getVideoElement: () => videoRef.current,
    getVoiceAudioElement: () => voiceAudioRef.current,
    getMusicAudioElement: () => musicAudioRef.current,
    getCanvasElement: () => canvasRef.current,
    seekTo: (time) => handleSeek(time)
  }));

  // Handle external seek requests
  useEffect(() => {
    if (typeof seekTime === 'number') {
      handleSeek(seekTime);
    }
  }, [seekTime]);

  // Sync volumes
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = Math.max(0, Math.min(1, musicVolume));
    }
  }, [musicVolume]);

  useEffect(() => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.volume = Math.max(0, Math.min(1, voiceVolume));
    }
  }, [voiceVolume]);

  const handleSeek = (time) => {
    setCurrentTime(time);
    if (voiceAudioRef.current) voiceAudioRef.current.currentTime = time;
    if (musicAudioRef.current) musicAudioRef.current.currentTime = time % (musicAudioRef.current.duration || 10);
    if (videoRef.current) videoRef.current.currentTime = time % (videoRef.current.duration || 8);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAll();
    } else {
      playAll();
    }
  };

  const playAll = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.play().catch(() => {});
    }
    if (musicAudioRef.current && musicVolume > 0.01) {
      musicAudioRef.current.play().catch(() => {});
    }
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
  };

  const pauseAll = () => {
    if (voiceAudioRef.current) voiceAudioRef.current.pause();
    if (musicAudioRef.current) musicAudioRef.current.pause();
    if (videoRef.current) videoRef.current.pause();
    setIsPlaying(false);
  };

  const restartAll = () => {
    handleSeek(0);
    playAll();
  };

  // Keyboard shortcut: Spacebar toggles playback
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Main Canvas Render Loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 720;
    const height = 1280;

    const render = () => {
      // 1. Update current time from voice audio if playing, or video
      let cur = currentTime;
      if (voiceAudioRef.current && !voiceAudioRef.current.paused) {
        cur = voiceAudioRef.current.currentTime;
        setCurrentTime(cur);
        if (onTimeUpdate) onTimeUpdate(cur);
      } else if (videoRef.current && !videoRef.current.paused && (!voiceAudioRef.current || !voiceAudioUrl)) {
        cur = videoRef.current.currentTime;
        setCurrentTime(cur);
        if (onTimeUpdate) onTimeUpdate(cur);
      }

      // Check loop / finish
      const effectiveDuration = duration || 15;
      if (cur >= effectiveDuration) {
        if (isLooping) {
          handleSeek(0);
        } else {
          pauseAll();
        }
      }

      // 2. Draw Video Frame
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const vWidth = video.videoWidth || 720;
        const vHeight = video.videoHeight || 1280;
        const targetRatio = width / height;
        const videoRatio = vWidth / vHeight;

        let sx, sy, sWidth, sHeight;
        if (videoRatio > targetRatio) {
          sHeight = vHeight;
          sWidth = vHeight * targetRatio;
          sx = (vWidth - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = vWidth;
          sHeight = vWidth / targetRatio;
          sx = 0;
          sy = (vHeight - sHeight) / 2;
        }
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#0E1017';
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Draw Synchronized Captions
      if (words && words.length > 0) {
        drawCaptions(ctx, words, cur, captionStyle, width, height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentTime, words, captionStyle, duration, isLooping, voiceAudioUrl]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Hidden media elements for playback and canvas source */}
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      {voiceAudioUrl && (
        <audio
          ref={voiceAudioRef}
          src={voiceAudioUrl}
          playsInline
          crossOrigin="anonymous"
          className="hidden"
          onEnded={() => {
            if (isLooping) restartAll();
            else pauseAll();
          }}
        />
      )}
      {musicAudioUrl && (
        <audio
          ref={musicAudioRef}
          src={musicAudioUrl}
          loop
          playsInline
          crossOrigin="anonymous"
          className="hidden"
        />
      )}

      {/* Phone Mockup Housing (iPhone 16 aesthetic) */}
      <div className="relative w-[280px] sm:w-[320px] md:w-[340px] aspect-[9/16] bg-black rounded-[44px] p-3.5 border-[6px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 group">
        {/* Dynamic Island Pill */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-24 h-5 bg-black rounded-full border border-white/10 flex items-center justify-between px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-blue-500/40"></span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>

        {/* Screen Canvas Container */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-zinc-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={1280}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Center Play Overlay Icon when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}

          {/* Social icons watermark simulator */}
          <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-3.5 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-xs">
              ❤️
            </div>
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-xs">
              💬
            </div>
            <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-xs">
              ↗️
            </div>
          </div>
        </div>
      </div>

      {/* Media Scrubber & Controls Bar */}
      <div className="w-[280px] sm:w-[320px] md:w-[340px] mt-4 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 backdrop-blur-md space-y-2.5">
        {/* Scrubber track */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 15}
            step="0.05"
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono text-zinc-500 w-10">
            {formatTime(duration || 15)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={restartAll}
              title="Restart from beginning"
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsLooping(!isLooping)}
              title="Toggle Loop"
              className={`p-2 rounded-xl transition-colors ${
                isLooping ? 'bg-purple-950/60 text-purple-400 border border-purple-500/40' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-zinc-400 font-medium">
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">Space</kbd> Play / Pause
          </div>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer916;
