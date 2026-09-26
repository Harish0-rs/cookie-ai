import React, { useState } from 'react';
import { X, Zap, Check, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreditModal({ isOpen, onClose, user, onAddCredits }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  if (!isOpen) return null;

  const handleRefill = async (amount) => {
    setLoading(true);
    try {
      await onAddCredits(amount);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onClose();
    } catch (e) {
      alert("Refill failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12141A] border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between bg-gradient-to-r from-purple-950/30 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Creator Credit Balance</h3>
              <p className="text-xs text-zinc-400">Power your short-form automated video factory</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status bar */}
        <div className="px-6 py-4 bg-zinc-900/60 border-b border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-amber-300">
              {user?.credits_remaining ?? 50}
            </span>
            <span className="text-xs text-zinc-400 font-medium">credits available</span>
          </div>
          <div className="text-xs text-zinc-400">
            <span className="text-purple-400 font-semibold">{user?.videos_created ?? 0}</span> videos generated so far
          </div>
        </div>

        {/* Plan Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Starter Pack */}
          <div 
            onClick={() => setSelectedPlan('starter')}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              selectedPlan === 'starter'
                ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-white text-sm">Starter Refill</h4>
                <p className="text-xs text-zinc-400">Casual creators</p>
              </div>
              <span className="text-lg font-extrabold text-white">$9</span>
            </div>
            <div className="text-2xl font-black text-purple-400 mb-3">+25 Credits</div>
            <ul className="space-y-1.5 text-xs text-zinc-300 mb-4">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                ~25 AI Script & Voices
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Full 720p / 1080p Export
              </li>
            </ul>
            <button
              onClick={(e) => { e.stopPropagation(); handleRefill(25); }}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5" />
              {loading ? "Processing..." : "Select 25 Credits"}
            </button>
          </div>

          {/* Pro Pack */}
          <div 
            onClick={() => setSelectedPlan('pro')}
            className={`p-5 rounded-xl border relative cursor-pointer transition-all ${
              selectedPlan === 'pro'
                ? 'border-amber-400 bg-amber-950/20 ring-1 ring-amber-400'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
            }`}
          >
            <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-[10px] uppercase tracking-wider shadow-md">
              Best Value
            </span>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-white text-sm">Creator Pro</h4>
                <p className="text-xs text-zinc-400">Viral daily posters</p>
              </div>
              <span className="text-lg font-extrabold text-white">$24</span>
            </div>
            <div className="text-2xl font-black text-amber-400 mb-3">+100 Credits</div>
            <ul className="space-y-1.5 text-xs text-zinc-300 mb-4">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                ~100 AI Script & Voices
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Priority Render Queue
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Unlimited Multi-Language
              </li>
            </ul>
            <button
              onClick={(e) => { e.stopPropagation(); handleRefill(100); }}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? "Processing..." : "Claim 100 Credits"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-zinc-950/80 border-t border-zinc-800 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Instant credit delivery. 30-day money-back guarantee. No monthly subscription required.</span>
        </div>
      </div>
    </div>
  );
}
