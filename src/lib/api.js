const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const AI_API_BASE_URL = (import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '');

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function aiApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${AI_API_BASE_URL}${normalizedPath}`;
}
