// frontend/src/App.js
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicOnlyRoute from "./utils/PublicOnlyRoute"; // 1. Impor wrapper baru
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";

import "./App.css";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              {" "}
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              {" "}
              {/* 3. Bungkus RegisterPage */}
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
