import axios from 'axios';
const fromEnv=import.meta.env.VITE_API_URL;
if(import.meta.env.PROD&&!fromEnv) console.error('VITE_API_URL is not set. In Vercel: Settings → Environment Variables → VITE_API_URL=https://<your-render-app>.onrender.com/api, then Redeploy.');
const baseURL=(fromEnv||'http://localhost:5000/api').replace(/\/+$/,'');
export const apiBase=baseURL;
const api=axios.create({baseURL,timeout:30000});
api.interceptors.request.use(c=>{const t=localStorage.getItem('cyberescape_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
api.interceptors.response.use(r=>r,err=>{if(err?.response?.status===401&&localStorage.getItem('cyberescape_token')){localStorage.removeItem('cyberescape_token');if(!window.location.pathname.includes('/login'))window.location.href='/login'}return Promise.reject(err)});
export default api;
