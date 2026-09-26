import React, { useState } from 'react';
import { 
  Mic2, 
  Play, 
  Pause, 
  Volume2, 
  Sparkles, 
  Sliders, 
  Check, 
  Loader2, 
  Clock, 
  Flame
} from 'lucide-react';
import { generateVoice } from '../services/api';

export default function VoiceStep({
  voices,
  selectedVoiceId,
  onSelectVoice,
  speed,
  onChangeSpeed,
  pitch,
  onChangePitch,
  script,
  voiceData,
  onVoiceGenerated
}) {
  const [generating, setGenerating] = useState(false);
  const [playingSampleId, setPlayingSampleId] = useState(null);
  const [genderFilter, setGenderFilter] = useState('all');

  const filteredVoices = voices.filter(v => {
    if (genderFilter !== 'all' && v.gender.toLowerCase() !== genderFilter) return false;
    return true;
  });

  const handleGenerateVoice = async () => {
    if (!script.trim()) {
      alert("Please write or generate a script first!");
      return;
    }

    setGenerating(true);
    try {
      const res = await generateVoice({
        text: script,
        voice_id: selectedVoiceId,
        speed,
        pitch
      });
      onVoiceGenerated(res);
    } catch (err) {
      alert("Voiceover generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewSample = (voice) => {
    // Uses browser speech synthesis for instant local preview of voice sample text
    if (playingSampleId === voice.id) {
      window.speechSynthesis.cancel();
      setPlayingSampleId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(voice.sample);
    utterance.rate = speed;
    utterance.onend = () => setPlayingSampleId(null);
    utterance.onerror = () => setPlayingSampleId(null);
    window.speechSynthesis.speak(utterance);
    setPlayingSampleId(voice.id);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-purple-400" />
          <span>AI Voiceover Library</span>
        </h3>
        <p className="text-xs text-zinc-400">Select hyper-realistic neural voices with millisecond word timestamps</p>
      </div>

      {/* Voice Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
          {['all', 'male', 'female'].map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                genderFilter === g
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-zinc-500 font-medium">
          {filteredVoices.length} voices available
        </span>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
        {filteredVoices.map((v) => {
          const isSelected = selectedVoiceId === v.id;
          const isPlaying = playingSampleId === v.id;

          return (
            <div
              key={v.id}
              onClick={() => onSelectVoice(v.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500/80 shadow-md shadow-purple-900/20'
                  : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs">
                      {v.gender === 'Male' ? '🎙️' : '🎧'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{v.name}</span>
                        <span className="text-[10px] text-zinc-400 px-1 py-0.2 bg-zinc-800 rounded">
                          {v.accent}
                        </span>
                      </div>
                      <div className="text-[10px] text-purple-400 font-medium">{v.style}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-1 italic mt-1">
                  "{v.sample}"
                </p>
              </div>

              {/* Sample playback button */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/50">
                <div className="flex gap-1">
                  {v.tags?.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800/70 text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewSample(v);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                    isPlaying
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                  <span>{isPlaying ? 'Stop' : 'Preview'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice Tuning Sliders: Speed & Pitch */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            Voice Speed & Pitch
          </span>
        </div>

        {/* Speed */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-400">Speech Speed:</span>
            <span className="font-bold text-purple-400">{speed}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={speed}
            onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>0.75x (Chill)</span>
            <span>1.0x (Normal)</span>
            <span>1.2x (Fast / TikTok)</span>
            <span>1.5x</span>
          </div>
        </div>

        {/* Pitch */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-400">Voice Pitch:</span>
            <span className="font-bold text-purple-400">{pitch > 0 ? `+${pitch}Hz` : `${pitch}Hz`}</span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={pitch}
            onChange={(e) => onChangePitch(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Generate Voiceover Button */}
      <button
        onClick={handleGenerateVoice}
        disabled={generating}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 disabled:opacity-50 transition-all active:scale-[0.99]"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Synthesizing Voice & Extracting Timestamps...</span>
          </>
        ) : (
          <>
            <Mic2 className="w-4 h-4" />
            <span>Generate Voiceover & Timestamps (1 Credit)</span>
          </>
        )}
      </button>

      {/* Generated Audio Banner */}
      {voiceData && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">Voiceover Synced!</div>
              <div className="text-[11px] text-zinc-400">
                Duration: {voiceData.duration}s • {voiceData.words?.length || 0} word timestamps extracted
              </div>
            </div>
          </div>
          <audio src={voiceData.audio_url} controls className="h-8 w-44" />
        </div>
      )}
    </div>
  );
}
