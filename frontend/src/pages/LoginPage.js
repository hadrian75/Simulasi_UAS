// frontend/src/pages/LoginPage.js
import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="material-icons text-white text-3xl">storefront</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  email
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="email@anda.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span className="material-icons">login</span>
              <span>Masuk</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Belum punya akun?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full text-center border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Daftar Sekarang
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Dengan masuk, Anda menyetujui syarat & ketentuan kami
        </p>
      </div>
    </div>
  );
};

export default LoginPage;