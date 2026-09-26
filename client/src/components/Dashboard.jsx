import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Flame, 
  Play, 
  Trash2, 
  Clock, 
  Coins, 
  Eye, 
  Film, 
  Layers, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export default function Dashboard({
  user,
  projects,
  templates,
  onNewProject,
  onOpenProject,
  onDeleteProject,
  onSelectTemplate,
  onOpenCredits
}) {
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Top Welcome & Analytics Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-purple-400">Welcome back,</span>
            <span className="text-sm font-bold text-zinc-200">{user?.name || "Creator"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Video Creation Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Automate viral faceless TikToks, Reels, and Shorts in minutes with AI voiceover and auto captions.
          </p>
        </div>

        {/* Quick CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewProject}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Video</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#12141A] border border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Videos Generated</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{projects.length}</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+3 this week</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#12141A] border border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Estimated Reach</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{user?.total_watch_time_est || "4.2M views"}</div>
            <div className="text-[11px] text-blue-400 font-medium mt-1">
              Across TikTok & Reels
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={onOpenCredits}
          className="p-5 rounded-2xl bg-[#12141A] border border-zinc-800 hover:border-amber-500/50 shadow-sm flex flex-col justify-between cursor-pointer group transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Credits Remaining</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-300">
              {user?.credits_remaining ?? 54}
            </div>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">
              Click to top-up →
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#12141A] border border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">Time Saved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-300">28.5 hrs</div>
            <div className="text-[11px] text-zinc-500 font-medium mt-1">
              Automated editing
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Viral Templates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>1-Click Viral Templates</span>
            </h2>
            <p className="text-xs text-zinc-400">Pre-built format presets used by 7-figure faceless creators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className="p-4 rounded-2xl bg-[#12141A] border border-zinc-800/80 hover:border-purple-500/80 hover:bg-purple-950/10 cursor-pointer transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg hover:shadow-purple-600/10 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {tpl.badge}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Use Template</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Your Video Projects</span>
            </h2>
            <p className="text-xs text-zinc-400">Continue editing or export your past creations</p>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#12141A] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-sm"
              >
                {/* Simulated Thumbnail / Video preview */}
                <div 
                  onClick={() => onOpenProject(proj)}
                  className="aspect-[9/12] bg-zinc-950 relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                  
                  {/* Subtle video preview background */}
                  {proj.rendered_video_url ? (
                    <video
                      src={proj.rendered_video_url}
                      muted
                      loop
                      playsInline
                      onMouseOver={(e) => e.target.play().catch(() => {})}
                      onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-950/40 to-zinc-900">
                      <Film className="w-8 h-8 text-zinc-600" />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Tag */}
                  <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10">
                    {proj.duration ? `${proj.duration}s` : '15s'}
                  </div>

                  {/* Caption Highlight Sneak-peek */}
                  <div className="absolute bottom-3 inset-x-3 z-20 text-center">
                    <span className="font-montserrat-black text-[11px] text-amber-300 drop-shadow">
                      {proj.title || "Viral Video"}
                    </span>
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">
                      {proj.title || "Untitled Project"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this project?")) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-1 italic">
                    "{proj.script || "No script yet"}"
                  </p>

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <button
                      onClick={() => onOpenProject(proj)}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Edit in Studio →
                    </button>

                    {proj.rendered_video_url && (
                      <button
                        onClick={() => setPreviewVideoUrl(proj.rendered_video_url)}
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#12141A] border border-zinc-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mx-auto text-zinc-400">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No videos created yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Pick a viral template above or start from scratch to produce your first vertical short!
            </p>
            <button
              onClick={onNewProject}
              className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/30"
            >
              Start Creating Now
            </button>
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden max-w-sm w-full p-2 flex flex-col items-center">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              className="w-full aspect-[9/16] rounded-2xl object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
