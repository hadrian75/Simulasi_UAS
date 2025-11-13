// frontend/src/utils/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

// Komponen ini akan membungkus halaman yang ingin Anda lindungi
const ProtectedRoute = ({ children }) => {
  // Ambil state 'user' dari context
  const { user } = useContext(AuthContext);

  if (!user) {
    // Jika tidak ada user (belum login),
    // paksa redirect ke halaman /login
    return <Navigate to="/login" replace />;
  }

  // Jika user ada, tampilkan halaman yang diminta (children)
  return children;
};

export default ProtectedRoute;
