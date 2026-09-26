import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Mic2, 
  Film, 
  Subtitles, 
  Music, 
  Languages, 
  Download, 
  Save, 
  Check, 
  Sliders
} from 'lucide-react';
import ScriptStep from './ScriptStep';
import VoiceStep from './VoiceStep';
import VisualsStep from './VisualsStep';
import CaptionsStep from './CaptionsStep';
import MusicStep from './MusicStep';
import VideoPlayer916 from './VideoPlayer916';
import Timeline from './Timeline';
import TranslateModal from './TranslateModal';
import ExportModal from './ExportModal';
import { saveProject } from '../services/api';

const STEPS = [
  { id: 'script', label: '1. Script', icon: Wand2 },
  { id: 'voice', label: '2. Voice', icon: Mic2 },
  { id: 'visuals', label: '3. Visuals', icon: Film },
  { id: 'captions', label: '4. Captions', icon: Subtitles },
  { id: 'music', label: '5. Audio', icon: Music }
];

export default function Studio({
  project,
  onSaveProject,
  voices,
  videos,
  musicList
}) {
  const [activeStep, setActiveStep] = useState('script');
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Studio project state
  const [title, setTitle] = useState(project.title || "Viral Short Project");
  const [script, setScript] = useState(project.script || "");
  const [selectedVoiceId, setSelectedVoiceId] = useState(project.voice_id || "en-US-ChristopherNeural");
  const [voiceSpeed, setVoiceSpeed] = useState(project.speed || 1.0);
  const [voicePitch, setVoicePitch] = useState(project.pitch || 0);
  const [voiceData, setVoiceData] = useState({
    audio_url: project.audio_url || "",
    duration: project.duration || 15,
    words: project.words || []
  });

  const [selectedVideoId, setSelectedVideoId] = useState(project.video_id || "minecraft_parkour");
  const [selectedMusicId, setSelectedMusicId] = useState(project.music_id || "lofi_chill");
  const [musicVolume, setMusicVolume] = useState(project.music_volume ?? 0.18);
  const [voiceVolume, setVoiceVolume] = useState(project.voice_volume ?? 1.0);
  const [hashtags, setHashtags] = useState(project.hashtags || "#cookieai #facelessshorts #viral");

  const [captionStyle, setCaptionStyle] = useState(project.caption_style || {
    preset: "hormozi",
    font_family: "Montserrat Black",
    primary_color: "#FFFFFF",
    highlight_color: "#FFE500",
    stroke_color: "#000000",
    stroke_width: 4,
    words_per_line: 3,
    uppercase: true,
    y_offset_pct: 55
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState(null);

  const playerRef = useRef(null);

  // Resolve media URLs
  const activeVideo = videos.find(v => v.id === selectedVideoId) || videos[0];
  const activeVoice = voices.find(v => v.id === selectedVoiceId) || voices[0];
  const activeMusic = musicList.find(m => m.id === selectedMusicId) || musicList[0];

  const handleApplyScriptData = (data) => {
    if (data.title) setTitle(data.title);
    if (data.hashtags) setHashtags(data.hashtags);
    if (data.recommended_voice) setSelectedVoiceId(data.recommended_voice);
    if (data.recommended_bg) setSelectedVideoId(data.recommended_bg);
    if (data.recommended_music) setSelectedMusicId(data.recommended_music);
    setActiveStep('voice');
  };

  const handleVoiceGenerated = (res) => {
    setVoiceData(res);
    setActiveStep('captions');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...project,
        title,
        script,
        voice_id: selectedVoiceId,
        speed: voiceSpeed,
        pitch: voicePitch,
        audio_url: voiceData.audio_url,
        duration: voiceData.duration,
        words: voiceData.words,
        video_id: selectedVideoId,
        music_id: selectedMusicId,
        music_volume: musicVolume,
        voice_volume: voiceVolume,
        caption_style: captionStyle,
        hashtags
      };
      await onSaveProject(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTranslated = ({ script: translatedScript, voiceId, voiceData: newVoiceData }) => {
    setScript(translatedScript);
    if (voiceId) setSelectedVoiceId(voiceId);
    if (newVoiceData) setVoiceData(newVoiceData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Studio Top Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
        {/* Project Title Input */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-base sm:text-lg font-black bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-purple-500 focus:bg-zinc-950 px-2 py-1 rounded outline-none text-white transition-all max-w-[280px] sm:max-w-md"
          />
        </div>

        {/* Action Buttons: Translate, Save, Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsTranslateOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700/80 transition-all hover:scale-105 active:scale-95"
          >
            <Languages className="w-4 h-4 text-purple-400" />
            <span>Translate</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700/80 transition-all hover:scale-105 active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-zinc-400" />
                <span>Save Project</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Video</span>
          </button>
        </div>
      </div>

      {/* Step Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-zinc-950/60 p-1.5 rounded-2xl border border-zinc-800/80">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Body: Left Configuration + Right 9:16 Canvas Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dynamic Step Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-[#12141A] border border-zinc-800 rounded-3xl p-6 shadow-xl min-h-[500px]">
          {activeStep === 'script' && (
            <ScriptStep
              script={script}
              onChangeScript={setScript}
              onApplyScriptData={handleApplyScriptData}
            />
          )}

          {activeStep === 'voice' && (
            <VoiceStep
              voices={voices}
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={setSelectedVoiceId}
              speed={voiceSpeed}
              onChangeSpeed={setVoiceSpeed}
              pitch={voicePitch}
              onChangePitch={setVoicePitch}
              script={script}
              voiceData={voiceData}
              onVoiceGenerated={handleVoiceGenerated}
            />
          )}

          {activeStep === 'visuals' && (
            <VisualsStep
              videos={videos}
              selectedVideoId={selectedVideoId}
              onSelectVideo={setSelectedVideoId}
            />
          )}

          {activeStep === 'captions' && (
            <CaptionsStep
              captionStyle={captionStyle}
              onChangeCaptionStyle={setCaptionStyle}
            />
          )}

          {activeStep === 'music' && (
            <MusicStep
              musicList={musicList}
              selectedMusicId={selectedMusicId}
              onSelectMusic={setSelectedMusicId}
              musicVolume={musicVolume}
              onChangeMusicVolume={setMusicVolume}
              voiceVolume={voiceVolume}
              onChangeVoiceVolume={setVoiceVolume}
            />
          )}
        </div>

        {/* Right Column: 9:16 Mobile Canvas Studio Player (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <VideoPlayer916
            ref={playerRef}
            videoUrl={activeVideo?.url}
            voiceAudioUrl={voiceData?.audio_url}
            musicAudioUrl={activeMusic?.url}
            words={voiceData?.words || []}
            captionStyle={captionStyle}
            duration={voiceData?.duration || 15}
            musicVolume={musicVolume}
            voiceVolume={voiceVolume}
            onTimeUpdate={setCurrentTime}
            seekTime={seekTime}
          />
        </div>
      </div>

      {/* Multi-Track Studio Timeline */}
      <Timeline
        currentTime={currentTime}
        duration={voiceData?.duration || 15}
        words={voiceData?.words || []}
        videoTitle={activeVideo?.title}
        voiceName={activeVoice?.name}
        musicTitle={activeMusic?.title}
        onSeek={(time) => {
          setSeekTime(time);
          if (playerRef.current) playerRef.current.seekTo(time);
        }}
      />

      {/* Translate Modal */}
      <TranslateModal
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        currentScript={script}
        onTranslated={handleTranslated}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectData={{
          title,
          video_id: selectedVideoId,
          audio_url: voiceData?.audio_url,
          music_id: selectedMusicId,
          music_volume: musicVolume,
          voice_volume: voiceVolume,
          duration: voiceData?.duration || 15,
          words: voiceData?.words || [],
          caption_style: captionStyle,
          hashtags
        }}
        videoElement={playerRef.current?.getVideoElement()}
        voiceAudioElement={playerRef.current?.getVoiceAudioElement()}
        musicAudioElement={playerRef.current?.getMusicAudioElement()}
      />
    </div>
  );
}
