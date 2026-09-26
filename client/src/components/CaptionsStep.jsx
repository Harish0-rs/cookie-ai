import React from 'react';
import { 
  Subtitles, 
  Sparkles, 
  Check, 
  Type, 
  Palette, 
  MoveVertical, 
  Sliders 
} from 'lucide-react';

const PRESET_STYLES = [
  {
    id: "hormozi",
    name: "Hormozi / MrBeast",
    badge: "🔥 Most Viral",
    font_family: "Montserrat Black",
    primary_color: "#FFFFFF",
    highlight_color: "#FFE500",
    stroke_color: "#000000",
    stroke_width: 4,
    words_per_line: 3,
    uppercase: true,
    animation: "pop",
    position: "center",
    y_offset_pct: 55
  },
  {
    id: "crayo_viral",
    name: "Crayo Cyan Bounce",
    badge: "⚡ High Energy",
    font_family: "Komika Axis",
    primary_color: "#FFFFFF",
    highlight_color: "#00FFCC",
    stroke_color: "#000000",
    stroke_width: 4,
    words_per_line: 2,
    uppercase: true,
    animation: "bounce",
    position: "center",
    y_offset_pct: 52
  },
  {
    id: "minimalist",
    name: "Clean Minimalist",
    badge: "🌿 Aesthetic",
    font_family: "Poppins Bold",
    primary_color: "#FFFFFF",
    highlight_color: "#F3F4F6",
    stroke_color: "#18181B",
    stroke_width: 2,
    words_per_line: 3,
    uppercase: false,
    animation: "fade",
    position: "center",
    y_offset_pct: 60
  },
  {
    id: "neon_glow",
    name: "Cyber Neon Glow",
    badge: "👾 Dark / Gaming",
    font_family: "Bebas Neue",
    primary_color: "#FFFFFF",
    highlight_color: "#FF007F",
    stroke_color: "#2E003E",
    stroke_width: 5,
    words_per_line: 2,
    uppercase: true,
    animation: "pulse",
    position: "center",
    y_offset_pct: 50
  }
];

const HIGHLIGHT_COLORS = [
  { label: "Viral Yellow", hex: "#FFE500" },
  { label: "Neon Green", hex: "#00FF66" },
  { label: "Cyan Aqua", hex: "#00FFCC" },
  { label: "Electric Pink", hex: "#FF007F" },
  { label: "Flame Orange", hex: "#FF6600" },
  { label: "Pure White", hex: "#FFFFFF" }
];

export default function CaptionsStep({ captionStyle, onChangeCaptionStyle }) {
  const updateStyle = (key, value) => {
    onChangeCaptionStyle({
      ...captionStyle,
      [key]: value
    });
  };

  const applyPreset = (preset) => {
    onChangeCaptionStyle({
      ...captionStyle,
      ...preset
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Subtitles className="w-4 h-4 text-purple-400" />
          <span>Auto Captions & Subtitles</span>
        </h3>
        <p className="text-xs text-zinc-400">Viral word-by-word synchronized animations (Hormozi, Crayo, Minimal)</p>
      </div>

      {/* Preset Cards Grid */}
      <div>
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
          Viral Preset Styles
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PRESET_STYLES.map((preset) => {
            const isSelected = captionStyle.preset === preset.id || captionStyle.font_family === preset.font_family;

            return (
              <div
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500 shadow-md'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{preset.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-purple-300">
                    {preset.badge}
                  </span>
                </div>

                {/* Mini Preview Box */}
                <div className="py-2 px-3 rounded-lg bg-black/60 border border-zinc-800/80 text-center my-1">
                  <span className="text-xs font-extrabold text-white">
                    THIS IS <span style={{ color: preset.highlight_color }}>VIRAL</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Fine Tuning */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>Customize Caption Look</span>
        </div>

        {/* Font & Words per line */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Font Family</label>
            <select
              value={captionStyle.font_family || "Montserrat Black"}
              onChange={(e) => updateStyle("font_family", e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none"
            >
              <option value="Montserrat Black">Montserrat (Hormozi / Bold)</option>
              <option value="Komika Axis">Komika / Impact (Crayo)</option>
              <option value="Bebas Neue">Bebas Neue (Tall / Cinematic)</option>
              <option value="Poppins Bold">Poppins (Clean / Aesthetic)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Words Per Line</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => updateStyle("words_per_line", num)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                    captionStyle.words_per_line === num
                      ? 'border-purple-500 bg-purple-950/40 text-purple-300'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  {num} {num === 1 ? 'word' : 'w'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Highlight Color Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 mb-2">
            Active Word Highlight Color
          </label>
          <div className="flex items-center gap-2">
            {HIGHLIGHT_COLORS.map((col) => (
              <button
                key={col.hex}
                onClick={() => updateStyle("highlight_color", col.hex)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${
                  captionStyle.highlight_color === col.hex
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.label}
              >
                {captionStyle.highlight_color === col.hex && (
                  <Check className="w-4 h-4 text-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Position & Y-Offset Slider */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 mb-1.5">
            <span>Vertical Position (Y-Offset):</span>
            <span className="text-purple-400">{captionStyle.y_offset_pct ?? 55}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            step="1"
            value={captionStyle.y_offset_pct ?? 55}
            onChange={(e) => updateStyle("y_offset_pct", parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
            <span>Top (20%)</span>
            <span>Center (50%)</span>
            <span>Bottom (75%)</span>
          </div>
        </div>

        {/* Uppercase Switch */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-zinc-300">UPPERCASE Text</span>
          <input
            type="checkbox"
            checked={captionStyle.uppercase !== false}
            onChange={(e) => updateStyle("uppercase", e.target.checked)}
            className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
