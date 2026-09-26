import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Clock, 
  AlignLeft, 
  HelpCircle, 
  Lightbulb, 
  Zap, 
  RotateCcw,
  Loader2
} from 'lucide-react';
import { generateScript } from '../services/api';

const QUICK_TOPICS = [
  { label: "Reddit AITA", prompt: "AITA for refusing to pay for my sister's wedding dress after she insulted my fiance?", niche: "reddit", tone: "dramatic" },
  { label: "3 Deep Ocean Facts", prompt: "3 terrifying facts about the deep Mariana Trench that science cannot explain", niche: "science", tone: "mysterious" },
  { label: "Marcus Aurelius Stoic Rule", prompt: "The brutal Stoic rule that stops you from caring what anyone thinks", niche: "motivation", tone: "educational" },
  { label: "Shower Thoughts", prompt: "3 mind-bending shower thoughts that will break your perception of reality", niche: "shower_thoughts", tone: "casual" },
  { label: "Unsolved 1961 Mystery", prompt: "The mysterious lost cosmonaut transmission that space agencies tried to bury", niche: "mystery", tone: "dramatic" }
];

export default function ScriptStep({ script, onChangeScript, onApplyScriptData }) {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('general');
  const [tone, setTone] = useState('dramatic');
  const [hookStyle, setHookStyle] = useState('curiosity');
  const [duration, setDuration] = useState(30);
  const [generating, setGenerating] = useState(false);

  // Compute live word count and estimated speech time
  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round(wordCount / 2.5);

  const handleGenerate = async (customPrompt) => {
    const targetTopic = customPrompt || topic;
    if (!targetTopic.trim()) {
      alert("Please enter a topic or select a prompt idea!");
      return;
    }

    setGenerating(true);
    try {
      const res = await generateScript({
        topic: targetTopic,
        niche,
        tone,
        target_duration: duration,
        hook_style: hookStyle
      });

      onChangeScript(res.script);
      if (onApplyScriptData) {
        onApplyScriptData(res);
      }
    } catch (err) {
      alert("Script generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span>Script Generator</span>
        </h3>
        <p className="text-xs text-zinc-400">Generate high-retention viral scripts or craft your own</p>
      </div>

      {/* AI Prompt Box */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            What is your video about?
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 3 psychological tricks to detect if someone is lying to you..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-zinc-200 placeholder-zinc-500 resize-none outline-none transition-colors"
            />
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div>
          <div className="text-[11px] font-semibold text-zinc-400 mb-1.5 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Viral Prompt Ideas:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TOPICS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopic(item.prompt);
                  setNiche(item.niche);
                  setTone(item.tone);
                  handleGenerate(item.prompt);
                }}
                className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-purple-900/30 hover:border-purple-500/50 border border-zinc-700/60 text-[11px] text-zinc-300 hover:text-purple-300 transition-all flex items-center gap-1"
              >
                <span>🔥</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Row: Tone, Duration, Hook */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Tone */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:border-purple-500 outline-none"
            >
              <option value="dramatic">Dramatic Suspense</option>
              <option value="humorous">Humorous & Sarcastic</option>
              <option value="educational">Educational / Authority</option>
              <option value="high_energy">High Energy Hype</option>
              <option value="mysterious">Dark Mystery</option>
              <option value="casual">Casual / Relatable</option>
            </select>
          </div>

          {/* Hook Style */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Hook Style</label>
            <select
              value={hookStyle}
              onChange={(e) => setHookStyle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:border-purple-500 outline-none"
            >
              <option value="curiosity">Shocking Question</option>
              <option value="suspense">Story Suspense</option>
              <option value="contrarian">Contrarian Claim</option>
              <option value="warning">Urgent Warning</option>
            </select>
          </div>

          {/* Target Length */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Target Duration</label>
            <div className="flex gap-1">
              {[15, 30, 60].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    duration === d
                      ? 'border-purple-500 bg-purple-950/40 text-purple-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => handleGenerate()}
          disabled={generating}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Viral Script with LLM...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Script with AI (1 Credit)</span>
            </>
          )}
        </button>
      </div>

      {/* Editable Script Output Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-zinc-400" />
            <span>Spoken Script Content</span>
          </label>
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-purple-400 font-medium">
              <Clock className="w-3 h-3" />
              ~{estimatedSeconds}s read time
            </span>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={6}
            value={script}
            onChange={(e) => onChangeScript(e.target.value)}
            placeholder="Type your script here, or click Generate above to create one..."
            className="w-full p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 leading-relaxed outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
