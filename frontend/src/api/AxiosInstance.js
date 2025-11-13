// frontend/src/api/axiosInstance.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";

// Buat instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gunakan 'interceptor' untuk menyisipkan token di setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (authTokens) {
      // Sisipkan token ke header Authorization
      config.headers["Authorization"] = `Bearer ${authTokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
