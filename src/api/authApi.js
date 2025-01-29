import axios from 'axios';


const authApi = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const setupAuthInterceptor = (token) => {
  authApi.interceptors.request.use(
    (config) => {
      if (config.url === '/logout' && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export const login=(loginFormData)=>authApi.post('/login',loginFormData);
export const signUp=(signUpData)=>authApi.post('/signup',signUpData);
export const logout=()=>authApi.post('/logout');
export const refreshAccessToken = () =>authApi.post('/refresh_token');

