import React, { useState } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Check, 
  Sliders, 
  ShieldCheck,
  Flame,
  Coffee
} from 'lucide-react';

export default function MusicStep({
  musicList,
  selectedMusicId,
  onSelectMusic,
  musicVolume,
  onChangeMusicVolume,
  voiceVolume,
  onChangeVoiceVolume
}) {
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [audioElem, setAudioElem] = useState(null);

  const handlePlayPreview = (track) => {
    if (playingTrackId === track.id) {
      if (audioElem) {
        audioElem.pause();
      }
      setPlayingTrackId(null);
      return;
    }

    if (audioElem) {
      audioElem.pause();
    }

    const a = new Audio(track.url);
    a.volume = musicVolume;
    a.play().catch(() => {});
    a.onended = () => setPlayingTrackId(null);
    setAudioElem(a);
    setPlayingTrackId(track.id);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Music className="w-4 h-4 text-purple-400" />
          <span>Music & Sound Mixing</span>
        </h3>
        <p className="text-xs text-zinc-400">Royalty-free background tracks with smart audio ducking against voiceover</p>
      </div>

      {/* Music Track Cards */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {musicList.map((track) => {
          const isSelected = selectedMusicId === track.id;
          const isPlaying = playingTrackId === track.id;

          return (
            <div
              key={track.id}
              onClick={() => onSelectMusic(track.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500'
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPreview(track);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isPlaying
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{track.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-purple-300">
                      {track.genre}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400">{track.mood} • {track.bpm} BPM</div>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dual Audio Mixer Sliders */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>Audio Mixer & Volume Ducking</span>
        </div>

        {/* Voiceover Volume */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-400">Voiceover Speech Volume:</span>
            <span className="font-bold text-purple-400">{Math.round(voiceVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.05"
            value={voiceVolume}
            onChange={(e) => onChangeVoiceVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Background Music Volume */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-400">Background Music Volume:</span>
            <span className="font-bold text-purple-400">{Math.round(musicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.8"
            step="0.02"
            value={musicVolume}
            onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-zinc-500 block mt-1">
            Tip: 15% - 20% keeps voice clear and crisp while maintaining rhythm.
          </span>
        </div>
      </div>
    </div>
  );
}
