import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Password tidak cocok!");
      return;
    }

    registerUser(email, password, password2, firstName, lastName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="material-icons text-white text-3xl">person_add</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Buat Akun Baru</h2>
          <p className="text-gray-600">Daftar untuk mulai berbelanja</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="firstName">
                Nama Depan
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  person
                </span>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Nama Depan Anda"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="lastName">
                Nama Belakang
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  person_outline
                </span>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Nama Belakang Anda (Opsional)"
                />
              </div>
            </div>

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
                  placeholder="Min. 8 karakter, 1 angka, 1 simbol"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="password2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  lock_clock
                </span>
                <input
                  type={showPassword2 ? "text" : "password"}
                  id="password2"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ulangi password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons">
                    {showPassword2 ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <span className="material-icons text-blue-600 text-sm mt-0.5">info</span>
                <div className="text-xs text-blue-700">
                  <p className="font-semibold mb-1">Persyaratan Password:</p>
                  <ul className="space-y-0.5 list-disc list-inside">
                    <li>Minimal 8 karakter</li>
                    <li>Mengandung minimal 1 angka</li>
                    <li>Mengandung minimal 1 simbol (!@#$%...)</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span className="material-icons">person_add</span>
              <span>Daftar</span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Sudah punya akun?</span>
            </div>
          </div>

          <Link
            to="/login"
            className="block w-full text-center border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Masuk
          </Link>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Dengan mendaftar, Anda menyetujui syarat & ketentuan kami
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;