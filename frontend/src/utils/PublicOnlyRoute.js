// frontend/src/utils/PublicOnlyRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// Komponen ini membungkus halaman Login dan Register
const PublicOnlyRoute = ({ children }) => {
  // Ambil state 'user' dari context
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" replace />;
  }

  // Jika BELUM login (user null), tampilkan halaman (children)
  return children;
};

export default PublicOnlyRoute;
