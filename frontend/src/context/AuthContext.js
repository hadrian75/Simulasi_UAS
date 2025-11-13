// frontend/src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Definisikan Base URL API Anda
const API_URL = "http://127.0.0.1:8000/api/v1";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  // Ambil token dari localStorage saat pertama kali load
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  // Ambil data user dari token (jika ada)
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  const navigate = useNavigate();

  // --- FUNGSI LOGIN ---
  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/token/`, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/"); // Arahkan ke Home setelah login
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login Gagal! Cek email dan password.");
    }
  };

  // --- FUNGSI LOGOUT ---
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  // --- FUNGSI REGISTER (Placeholder) ---
  const registerUser = async (email, password, password2) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register/`, {
        email: email,
        password: password,
        password2: password2,
      });

      if (response.status === 201) {
        // Setelah register berhasil, langsung login
        await loginUser(email, password);
      }
    } catch (error) {
      console.error("Register failed:", error.response.data);
      alert(`Registrasi Gagal: ${JSON.stringify(error.response.data)}`);
    }
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
