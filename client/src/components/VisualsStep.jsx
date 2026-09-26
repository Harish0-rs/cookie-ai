import React, { useState, useRef } from 'react';
import { 
  Film, 
  Upload, 
  Check, 
  Sparkles, 
  Play, 
  Plus, 
  Loader2,
  FolderOpen
} from 'lucide-react';
import { uploadCustomVideo } from '../services/api';

const CATEGORIES = ['All', 'Gaming', 'Satisfying', 'Aesthetic', 'Cinematic', 'Uploads'];

export default function VisualsStep({
  videos,
  selectedVideoId,
  onSelectVideo,
  onVideoUploaded
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const filteredVideos = videos.filter((v) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Uploads') return v.category === 'Uploads';
    return v.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadCustomVideo(file);
      if (onVideoUploaded) onVideoUploaded(res);
      onSelectVideo(res.id);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-purple-400" />
          <span>Background Video Library</span>
        </h3>
        <p className="text-xs text-zinc-400">Select high-retention gameplay, satisfying loops, or upload your own 9:16 video</p>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
        {/* Upload Custom Card */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[9/16] rounded-2xl border-2 border-dashed border-zinc-800 hover:border-purple-500/80 bg-zinc-900/30 hover:bg-purple-950/10 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="video/mp4,video/webm,video/mov"
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              <span className="text-[11px] text-zinc-400">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-purple-600 group-hover:text-white transition-colors flex items-center justify-center text-zinc-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Upload Video</span>
                <span className="text-[10px] text-zinc-500">MP4, WebM (9:16)</span>
              </div>
            </div>
          )}
        </div>

        {/* Existing Video Cards */}
        {filteredVideos.map((video) => {
          const isSelected = selectedVideoId === video.id;

          return (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video.id)}
              className={`aspect-[9/16] rounded-2xl border relative overflow-hidden cursor-pointer transition-all group ${
                isSelected
                  ? 'border-purple-500 ring-2 ring-purple-500/80 shadow-lg shadow-purple-600/25 scale-[1.02]'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900'
              }`}
            >
              {/* Background preview video or gradient cover */}
              <div className="absolute inset-0 bg-zinc-950">
                <video
                  src={video.url}
                  muted
                  loop
                  playsInline
                  onMouseOver={(e) => e.target.play().catch(() => {})}
                  onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Category Pill */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10">
                  {video.category}
                </span>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm">{video.thumbnail || "🎮"}</span>
                  <span className="text-xs font-bold text-white truncate">{video.title}</span>
                </div>
                <p className="text-[10px] text-zinc-400 line-clamp-1">
                  {video.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
