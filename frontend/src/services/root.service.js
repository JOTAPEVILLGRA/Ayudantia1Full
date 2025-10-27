import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt-auth"); // Asegúrate de que estás usando localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Añade el token al header
  }
  return config;
});

export default instance;
