import axios from 'axios';

export const baseURL = process.env.REACT_APP_API_URL;

export const template = axios.create({
  baseURL,
  withCredentials: true,
});

const checkTokenInterceptor = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
};

template.interceptors.request.use(checkTokenInterceptor);
