import axios from 'axios';

// Əgər .env oxunmasa, birbaşa localhost:5000 istifadə et
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${baseURL}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Token oxuma xətası", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;