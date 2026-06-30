import axios from 'axios';
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try { const auth = JSON.parse(localStorage.getItem('sivakasi-auth') || '{}'); if (auth?.state?.token) config.headers.Authorization = `Bearer ${auth.state.token}`; } catch {}
  }
  return config;
});
export default api;
