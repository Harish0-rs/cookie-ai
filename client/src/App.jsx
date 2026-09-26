import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';
import CreditModal from './components/CreditModal';
import { 
  fetchUserProfile, 
  addCredits, 
  fetchProjects, 
  saveProject, 
  deleteProject,
  fetchVoices,
  fetchVideos,
  fetchMusic,
  fetchTemplates
} from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'studio'
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [voices, setVoices] = useState([]);
  const [videos, setVideos] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [activeProject, setActiveProject] = useState(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize App Data
  useEffect(() => {
    async function init() {
      try {
        const [u, p, v, vid, m, tpl] = await Promise.all([
          fetchUserProfile(),
          fetchProjects(),
          fetchVoices(),
          fetchVideos(),
          fetchMusic(),
          fetchTemplates()
        ]);
        setUser(u);
        setProjects(p);
        setVoices(v);
        setVideos(vid);
        setMusicList(m);
        setTemplates(tpl);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleNewProject = () => {
    const newProj = {
      id: null,
      title: "New Viral Short",
      script: "Marcus Aurelius wrote this two thousand years ago, and it still stings. The master has failed more times than the beginner has even tried. Stop asking for permission to build your life.",
      voice_id: "en-US-ChristopherNeural",
      speed: 1.0,
      pitch: 0,
      video_id: "minecraft_parkour",
      music_id: "lofi_chill",
      music_volume: 0.18,
      voice_volume: 1.0,
      duration: 15,
      words: [],
      caption_style: {
        preset: "hormozi",
        font_family: "Montserrat Black",
        primary_color: "#FFFFFF",
        highlight_color: "#FFE500",
        stroke_color: "#000000",
        stroke_width: 4,
        words_per_line: 3,
        uppercase: true,
        y_offset_pct: 55
      }
    };
    setActiveProject(newProj);
    setCurrentView('studio');
  };

  const handleOpenProject = (project) => {
    setActiveProject(project);
    setCurrentView('studio');
  };

  const handleSaveProject = async (projectData) => {
    const saved = await saveProject(projectData);
    setActiveProject(saved);
    const updatedProjects = await fetchProjects();
    setProjects(updatedProjects);
    const updatedUser = await fetchUserProfile();
    setUser(updatedUser);
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    setProjects(projects.filter(p => p.id !== projectId));
    if (activeProject?.id === projectId) {
      setActiveProject(null);
      setCurrentView('dashboard');
    }
  };

  const handleSelectTemplate = (template) => {
    const templateProject = {
      id: null,
      title: template.name,
      script: template.script,
      voice_id: template.voice_id,
      speed: 1.0,
      pitch: 0,
      video_id: template.video_id,
      music_id: template.music_id,
      music_volume: template.music_volume || 0.18,
      voice_volume: 1.0,
      duration: 16,
      words: [],
      caption_style: template.caption_style,
      hashtags: `#${template.id} #cookieai #shorts #reels`
    };
    setActiveProject(templateProject);
    setCurrentView('studio');
  };

  const handleAddCredits = async (amount) => {
    const updatedUser = await addCredits(amount);
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-3xl shadow-xl shadow-purple-600/30 animate-pulse">
          🍪
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          <span>Starting Cookie AI Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-zinc-100 flex flex-col">
      <Navbar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        onNewProject={handleNewProject}
        onOpenCredits={() => setIsCreditModalOpen(true)}
        activeProjectTitle={activeProject?.title}
      />

      <main className="flex-1">
        {currentView === 'dashboard' ? (
          <Dashboard
            user={user}
            projects={projects}
            templates={templates}
            onNewProject={handleNewProject}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onSelectTemplate={handleSelectTemplate}
            onOpenCredits={() => setIsCreditModalOpen(true)}
          />
        ) : (
          <Studio
            key={activeProject?.id || activeProject?.title || 'default-project'}
            project={activeProject || {}}
            onSaveProject={handleSaveProject}
            voices={voices}
            videos={videos}
            musicList={musicList}
          />
        )}
      </main>

      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        user={user}
        onAddCredits={handleAddCredits}
      />
    </div>
  );
}
