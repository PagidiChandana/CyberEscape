import axios from 'axios';
const baseURL=(import.meta.env.VITE_API_URL||'http://localhost:5000/api').replace(/\/+$/,'');
const api=axios.create({baseURL,timeout:15000});
api.interceptors.request.use(c=>{const t=localStorage.getItem('cyberescape_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
api.interceptors.response.use(r=>r,err=>{if(err?.response?.status===401&&localStorage.getItem('cyberescape_token')){localStorage.removeItem('cyberescape_token');if(!window.location.pathname.includes('/login'))window.location.href='/login'}return Promise.reject(err)});
export default api;
