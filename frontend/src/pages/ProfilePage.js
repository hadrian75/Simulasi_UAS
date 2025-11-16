import React, { useState, useEffect, useContext } from 'react';
import AxiosInstance from '../api/AxiosInstance';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await AxiosInstance.get('/profile/');
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
    } catch (error) {
      console.error("Gagal mengambil data profil:", error);
      toast.error("Gagal memuat profil.");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.patch('/profile/', {
        first_name: firstName,
        last_name: lastName,
      });
      toast.success("Profil berhasil diperbarui! Silakan login ulang untuk melihat perubahan di navbar.");
      logoutUser();
    } catch (error) {
      console.error("Gagal update profil:", error);
      toast.error("Gagal update profil.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== newPassword2) {
      toast.error("Password baru tidak cocok.");
      return;
    }

    try {
      await AxiosInstance.post('/profile/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      });
      toast.success("Password berhasil diubah! Silakan login kembali.");
      logoutUser();
    } catch (error) {
      console.error("Gagal ganti password:", error);
      toast.error(error.response?.data?.detail || "Gagal ganti password.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">Kelola informasi akun dan keamanan Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form Ganti Nama */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Ubah Profil</h2>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email (Tidak bisa diubah)
                </label>
                <input
                  type="email"
                  id="email"
                  value={user ? user.email : ''}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                  disabled
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2" htmlFor="firstName">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nama Depan
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="Masukkan nama depan"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2" htmlFor="lastName">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nama Belakang
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="Masukkan nama belakang (opsional)"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan Perubahan</span>
              </button>
            </form>
          </div>

          {/* Form Ganti Password */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Ubah Password</h2>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="p-8 space-y-6">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2" htmlFor="oldPassword">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Password Lama
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  placeholder="Masukkan password lama"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2" htmlFor="newPassword">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password Baru
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  placeholder="Min. 8 karakter, 1 angka, 1 simbol"
                  required
                />
                <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Minimal 8 karakter dengan kombinasi angka dan simbol
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2" htmlFor="newPassword2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  id="newPassword2"
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  placeholder="Ketik ulang password baru"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3.5 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Ubah Password</span>
              </button>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-amber-800">
                    Setelah mengubah password, Anda akan otomatis logout dan harus login kembali.
                  </p>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6 shadow-md">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Tips Keamanan Akun</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Gunakan password yang kuat dan unik</li>
                <li>• Jangan bagikan password Anda kepada siapapun</li>
                <li>• Ubah password secara berkala untuk keamanan maksimal</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;