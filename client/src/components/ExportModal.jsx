import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Sparkles, 
  Check, 
  Copy, 
  Cpu, 
  Zap, 
  Loader2, 
  Play, 
  Smartphone,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { renderVideo, checkRenderStatus } from '../services/api';
import { exportVideoFromCanvas } from '../services/canvasExporter';

export default function ExportModal({
  isOpen,
  onClose,
  projectData,
  videoElement,
  voiceAudioElement,
  musicAudioElement
}) {
  const [exportMode, setExportMode] = useState('server'); // 'server' | 'client'
  const [resolution, setResolution] = useState('720p');
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [renderedUrl, setRenderedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState('tiktok'); // tiktok, reels, shorts

  useEffect(() => {
    if (!isOpen) {
      setRendering(false);
      setProgress(0);
      setStatusMessage('');
      setRenderedUrl(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Server Render Pipeline
  const handleServerRender = async () => {
    if (!projectData?.audio_url) {
      alert("Please generate voiceover first before rendering!");
      return;
    }

    setRendering(true);
    setProgress(10);
    setStatusMessage("Submitting render job to FFmpeg engine...");

    try {
      const renderPayload = {
        video_id: projectData.video_id || "minecraft_parkour",
        audio_url: projectData.audio_url,
        music_id: projectData.music_id,
        music_volume: projectData.music_volume ?? 0.18,
        voice_volume: projectData.voice_volume ?? 1.0,
        words: projectData.words || [],
        caption_style: projectData.caption_style || {},
        resolution
      };

      const res = await renderVideo(renderPayload);
      const jobId = res.job_id;

      // Poll status
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await checkRenderStatus(jobId);
          setProgress(statusRes.progress || 50);
          setStatusMessage(statusRes.message || "Rendering...");

          if (statusRes.status === 'completed') {
            clearInterval(pollInterval);
            setRenderedUrl(statusRes.output_url);
            setRendering(false);
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } else if (statusRes.status === 'failed') {
            clearInterval(pollInterval);
            setRendering(false);
            alert("Render failed: " + statusRes.message);
          }
        } catch (e) {
          clearInterval(pollInterval);
          setRendering(false);
        }
      }, 1500);

    } catch (err) {
      setRendering(false);
      alert("Failed to start render: " + err.message);
    }
  };

  // Instant Client Canvas Exporter
  const handleClientExport = async () => {
    setRendering(true);
    setProgress(5);
    setStatusMessage("Starting real-time Canvas media recorder...");

    try {
      const result = await exportVideoFromCanvas({
        videoElement,
        voiceAudioElement,
        musicAudioElement,
        words: projectData.words || [],
        captionStyle: projectData.caption_style || {},
        duration: projectData.duration || 10,
        onProgress: (p) => {
          setProgress(p);
          setStatusMessage(`Recording frames... ${p}%`);
        }
      });

      setRenderedUrl(result.url);
      setRendering(false);
      setStatusMessage("Export finished!");
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      setRendering(false);
      alert("Client export failed: " + err.message);
    }
  };

  const handleCopyCaption = () => {
    const text = `${projectData?.title || 'Viral Video'}\n\n${projectData?.hashtags || '#cookieai #shorts #reels #viral'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#12141A] border border-zinc-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Export 9:16 Vertical Video</h3>
              <p className="text-xs text-zinc-400">Ready for TikTok, Instagram Reels, and YouTube Shorts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Pipeline controls */}
          <div className="space-y-5">
            {/* Mode Selector */}
            <div>
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Export Engine
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setExportMode('server')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    exportMode === 'server'
                      ? 'border-purple-500 bg-purple-950/20 text-white ring-1 ring-purple-500'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-purple-300">
                    <Cpu className="w-4 h-4" />
                    <span>Server FFmpeg</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">HQ burnt captions, pristine 60fps</span>
                </button>

                <button
                  onClick={() => setExportMode('client')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    exportMode === 'client'
                      ? 'border-purple-500 bg-purple-950/20 text-white ring-1 ring-purple-500'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                    <Zap className="w-4 h-4" />
                    <span>Instant Client</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">0-sec queue, direct browser record</span>
                </button>
              </div>
            </div>

            {/* Resolution selection */}
            {exportMode === 'server' && (
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Resolution & Quality
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setResolution('720p')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                      resolution === '720p'
                        ? 'border-purple-500 bg-purple-950/30 text-white'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>720p Vertical (Fast)</span>
                    <span className="text-[10px] text-zinc-500">720x1280</span>
                  </button>
                  <button
                    onClick={() => setResolution('1080p')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                      resolution === '1080p'
                        ? 'border-purple-500 bg-purple-950/30 text-white'
                        : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>1080p HD (HQ)</span>
                    <span className="text-[10px] text-purple-400 font-bold">Recommended</span>
                  </button>
                </div>
              </div>
            )}

            {/* Progress / Action button */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              {rendering ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      {statusMessage}
                    </span>
                    <span className="text-purple-400 font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : renderedUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Your video is ready to download!</span>
                  </div>
                  <a
                    href={renderedUrl}
                    download={`cookie_short_${Date.now()}.mp4`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download 9:16 Video (.mp4)
                  </a>
                </div>
              ) : (
                <button
                  onClick={exportMode === 'server' ? handleServerRender : handleClientExport}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Rendering Video</span>
                </button>
              )}
            </div>

            {/* Viral Copy Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Viral Caption & Hashtags</span>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {projectData?.title || 'Viral Video'}
              </p>
              <div className="text-[11px] text-purple-400 font-mono font-medium truncate">
                {projectData?.hashtags || '#cookieai #shorts #reels #viral'}
              </div>
            </div>
          </div>

          {/* Right Column: Social Media Safe Zones Preview */}
          <div className="flex flex-col items-center">
            {/* Social platform selector */}
            <div className="flex items-center gap-1 mb-3 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {['tiktok', 'reels', 'shorts'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSocialPlatform(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    socialPlatform === p
                      ? 'bg-purple-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Phone Mockup with Social Overlay */}
            <div className="w-[200px] h-[355px] bg-black rounded-3xl border-4 border-zinc-800 relative overflow-hidden shadow-2xl flex flex-col justify-between p-3 select-none">
              {/* Simulated Video Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-zinc-900 to-black flex items-center justify-center">
                <div className="text-center px-2">
                  <div className="font-montserrat-black text-xs text-amber-300 stroke-black drop-shadow">
                    ACTIVE CAPTION
                  </div>
                  <div className="text-[9px] text-zinc-400 mt-1">Safe Zone Verified ✓</div>
                </div>
              </div>

              {/* Top safe zone marker */}
              <div className="relative z-10 flex justify-between items-center text-[9px] text-white/70">
                <span>Following | For You</span>
                <span>🔍</span>
              </div>

              {/* Right Side Social Action Icons */}
              <div className="absolute right-2 bottom-14 z-10 flex flex-col items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">
                  ❤️
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">
                  💬
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">
                  ↗️
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/40 flex items-center justify-center text-[8px] animate-spin">
                  🎵
                </div>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 pr-10 text-left">
                <div className="text-[10px] font-bold text-white">@cookie_creator</div>
                <div className="text-[8px] text-zinc-300 line-clamp-1">
                  {projectData?.title || 'Viral Video Title'}
                </div>
                <div className="text-[7px] text-purple-400">♫ Original Sound - Cookie AI</div>
              </div>
            </div>
            <span className="text-[11px] text-zinc-500 mt-2">Simulated {socialPlatform} UI layout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
