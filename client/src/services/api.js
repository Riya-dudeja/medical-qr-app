import axios from 'axios';

// Get the base URL dynamically based on environment
const getBaseUrl = () => {
  // Check for environment variable first (works in both dev and prod)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback for development without env var
  const host = window.location.hostname;
  
  // If we're on Vercel or production domain, use the production backend
  if (host.includes('vercel.app') || host.includes('medical-qr-app')) {
    return 'https://medical-qr-app.onrender.com';
  }
  
  // Local development fallback
  return `http://${host}:5000`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Add authorization header to every request if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;