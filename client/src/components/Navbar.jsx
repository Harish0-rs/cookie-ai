import React from 'react';
import { 
  Sparkles, 
  Coins, 
  PlusCircle, 
  FolderKanban, 
  Layers, 
  Settings, 
  Zap,
  Film
} from 'lucide-react';

export default function Navbar({ 
  user, 
  currentView, 
  onViewChange, 
  onNewProject, 
  onOpenCredits,
  activeProjectTitle
}) {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-[#0E1017]/95 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
      {/* Brand & Mode switch */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onViewChange('dashboard')}
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <span className="text-xl">🍪</span>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-purple-300 bg-clip-text text-transparent">
                COOKIE AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">Faceless Video Engine</span>
          </div>
        </button>

        {/* View toggle */}
        <div className="hidden md:flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'dashboard'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => onViewChange('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentView === 'studio'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Studio Editor
          </button>
        </div>

        {/* Active Project Title Pill if in Studio */}
        {currentView === 'studio' && activeProjectTitle && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-zinc-900/60 border border-zinc-800/80 rounded-lg text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium truncate max-w-[200px]">{activeProjectTitle}</span>
          </div>
        )}
      </div>

      {/* Right controls: Credits, New Project, Profile */}
      <div className="flex items-center gap-3">
        {/* Credits Pill */}
        <button
          onClick={onOpenCredits}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-300 hover:border-amber-400 transition-all text-xs font-bold shadow-sm hover:scale-[1.02]"
        >
          <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{user?.credits_remaining ?? 50} Credits</span>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-md ml-0.5">
            +Refill
          </span>
        </button>

        {/* Create New Video Button */}
        <button
          onClick={onNewProject}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/25 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">New Video</span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 cursor-pointer">
            <img 
              src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=cookie"} 
              alt="Avatar" 
              className="w-full h-full rounded-full bg-zinc-900 object-cover"
            />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-zinc-200">{user?.name || "Creator"}</span>
            <span className="text-[10px] text-zinc-400 font-medium">{user?.tier || "Creator Pro"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
