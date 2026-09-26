const API_BASE = '/api';

export async function fetchUserProfile() {
  const res = await fetch(`${API_BASE}/user`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function addCredits(amount = 25) {
  const res = await fetch(`${API_BASE}/user/add-credits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  if (!res.ok) throw new Error('Failed to refill credits');
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Project not found');
  return res.json();
}

export async function saveProject(project) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error('Failed to save project');
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

export async function generateScript(params) {
  const res = await fetch(`${API_BASE}/generate-script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to generate script');
  }
  return res.json();
}

export async function translateScript(text, target_lang) {
  const res = await fetch(`${API_BASE}/translate-script`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, target_lang })
  });
  if (!res.ok) throw new Error('Translation failed');
  return res.json();
}

export async function fetchVoices() {
  const res = await fetch(`${API_BASE}/voices`);
  if (!res.ok) throw new Error('Failed to fetch voice library');
  return res.json();
}

export async function generateVoice(params) {
  const res = await fetch(`${API_BASE}/generate-voice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Voice generation failed');
  }
  return res.json();
}

export async function fetchVideos() {
  const res = await fetch(`${API_BASE}/library/videos`);
  if (!res.ok) throw new Error('Failed to fetch video library');
  return res.json();
}

export async function fetchMusic() {
  const res = await fetch(`${API_BASE}/library/music`);
  if (!res.ok) throw new Error('Failed to fetch music library');
  return res.json();
}

export async function fetchTemplates() {
  const res = await fetch(`${API_BASE}/library/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return res.json();
}

export async function uploadCustomVideo(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/library/upload-video`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Video upload failed');
  }
  return res.json();
}

export async function renderVideo(params) {
  const res = await fetch(`${API_BASE}/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to start video rendering');
  }
  return res.json();
}

export async function checkRenderStatus(jobId) {
  const res = await fetch(`${API_BASE}/render/${jobId}`);
  if (!res.ok) throw new Error('Failed to check render status');
  return res.json();
}
