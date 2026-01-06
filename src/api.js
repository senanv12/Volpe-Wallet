import axios from 'axios';

// Backend ünvanını .env-dən alır, yoxdursa localhost:5000 götürür
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
<<<<<<< HEAD
  // DÜZƏLİŞ: Sonda '/users' SİLDİK. Artıq sadəcə '/api' olacaq.
  baseURL: `${baseURL}/api`, 
=======
  baseURL: `${import.meta.env.VITE_API_URL}/api/users`, // Backend ünvanı
>>>>>>> 80e1b45fd6db1969ff1b584867a6418e3e8ce138
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tokeni avtomatik əlavə edən hissə (Dəyişmədi)
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