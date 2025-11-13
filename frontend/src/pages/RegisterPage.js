// frontend/src/pages/RegisterPage.js
import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext"; // Impor context
import { Link } from "react-router-dom";

const RegisterPage = () => {
  // Ambil fungsi 'registerUser' dari context
  const { registerUser } = useContext(AuthContext);

  // State untuk menyimpan input form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  // Opsional: Tambahkan state untuk nama jika Anda mau
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi frontend sederhana
    if (password !== password2) {
      alert("Password tidak cocok!");
      return;
    }

    // Panggil fungsi 'registerUser' dari context
    // Ganti 'null' jika Anda menambahkan state nama
    registerUser(email, password, password2, null, null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Buat Akun Baru
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="nama@email.com"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Min. 8 karakter, 1 angka, 1 simbol"
              required
            />
          </div>

          {/* Konfirmasi Password */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password2"
            >
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ulangi password"
              required
            />
          </div>

          {/* Tombol Submit */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>

          {/* Link ke Login */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              Login di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
