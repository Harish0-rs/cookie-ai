import React, { useState } from 'react';
import { X, Languages, Globe, ArrowRight, Loader2, Check } from 'lucide-react';
import { translateScript, generateVoice } from '../services/api';

const LANGUAGES = [
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸', nativeVoice: 'es-ES-AlvaroNeural' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷', nativeVoice: 'fr-FR-HenriNeural' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪', nativeVoice: 'de-DE-KillianNeural' },
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵', nativeVoice: 'ja-JP-KeitaNeural' },
  { code: 'pt', name: 'Portuguese (Português)', flag: '🇧🇷', nativeVoice: 'pt-BR-AntonioNeural' },
  { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳', nativeVoice: 'hi-IN-MadhurNeural' }
];

export default function TranslateModal({ isOpen, onClose, currentScript, onTranslated }) {
  const [selectedLang, setSelectedLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);

  if (!isOpen) return null;

  const handleTranslate = async () => {
    if (!currentScript.trim()) {
      alert("Please write or generate a script first!");
      return;
    }

    setLoading(true);
    try {
      const res = await translateScript(currentScript, selectedLang);
      const translatedText = res.translated_script;
      const targetVoice = res.recommended_voice || LANGUAGES.find(l => l.code === selectedLang)?.nativeVoice;

      let voiceData = null;
      if (autoVoice && targetVoice) {
        voiceData = await generateVoice({
          text: translatedText,
          voice_id: targetVoice,
          speed: 1.0,
          pitch: 0
        });
      }

      onTranslated({
        script: translatedText,
        voiceId: targetVoice,
        voiceData: voiceData
      });
      onClose();
    } catch (err) {
      alert("Translation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12141A] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Translate Video</h3>
              <p className="text-xs text-zinc-400">Expand to international audiences in 1 click</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Select Target Language
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedLang === lang.code
                      ? 'border-purple-500 bg-purple-950/30 text-white ring-1 ring-purple-500'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-xs font-semibold">{lang.name}</span>
                  </div>
                  {selectedLang === lang.code && <Check className="w-4 h-4 text-purple-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Auto voice re-generation toggle */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs font-semibold text-zinc-200">Auto-Generate Native Voice</div>
                <div className="text-[11px] text-zinc-400">Re-synthesizes voiceover with accurate native accent & timestamps</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoVoice}
              onChange={(e) => setAutoVoice(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          {/* Current Script snippet */}
          <div>
            <span className="text-[11px] font-semibold text-zinc-400 block mb-1">Original Script:</span>
            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs text-zinc-300 line-clamp-3 italic">
              "{currentScript || "No script entered yet..."}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Translating & Revoicing...</span>
              </>
            ) : (
              <>
                <span>Translate & Sync</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
