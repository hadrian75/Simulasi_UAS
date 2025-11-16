import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './utils/ProtectedRoute';
import PublicOnlyRoute from './utils/PublicOnlyRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import ProductCreatePage from './pages/ProductCreatePage';
import ProductEditPage from './pages/ProductEditPage';
import ProfilePage from './pages/ProfilePage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />

      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><SellerDashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/products/new" element={<ProtectedRoute><ProductCreatePage /></ProtectedRoute>} />
        <Route path="/dashboard/products/edit/:id" element={<ProtectedRoute><ProductEditPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="/order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />

      </Routes>
    </div>
  );
}

export default App;