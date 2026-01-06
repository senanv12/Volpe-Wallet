import axios from 'axios';

// 1. Axios instansiyası yaradırıq
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/users`, // Backend ünvanı
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor (Hər sorğudan əvvəl işə düşür)
// Məqsəd: Əgər istifadəçi giriş edibsə, Tokeni avtomatik başlıqlara (header) əlavə etmək.
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user')); // LocalStorage-dən useri oxuyuruq
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;