import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../api/AxiosInstance";
import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/api/v1";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
      : null
  );

  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await AxiosInstance.post(`/auth/token/`, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
        toast.success("Login berhasil!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login Gagal! Cek kembali email dan password Anda.");
    }
  };

  const registerUser = async (email, password, password2, firstName, lastName) => {
    try {
      const response = await AxiosInstance.post(`/auth/register/`, {
        email: email,
        password: password,
        password2: password2,
        first_name: firstName,
        last_name: lastName,
      });

      if (response.status === 201) {
        toast.success("Registrasi berhasil! Anda akan otomatis login.");
        await loginUser(email, password);
      }
    } catch (error) {
      console.error("Register failed:", error.response.data);
      toast.error(`Registrasi Gagal: ${JSON.stringify(error.response.data)}`);
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    toast.info("Anda telah logout.");
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    setLoading(false);
  }, [authTokens]);


  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};