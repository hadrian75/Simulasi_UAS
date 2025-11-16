// frontend/src/pages/SellerDashboardPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosInstance';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ORDER_STATUS_CHOICES = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const SellerDashboardPage = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FUNGSI UNTUK MENGAMBIL DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil data Penjualan (Sales)
      const salesResponse = await axiosInstance.get('/dashboard/sales/');

      // --- PERBAIKAN 1 DI SINI ---
      setSales(salesResponse.data.results); // Ambil dari .results

      // 2. Ambil data Produk (Milik Penjual)
      const productsResponse = await axiosInstance.get('/dashboard/products/');

      // --- PERBAIKAN 2 DI SINI ---
      setProducts(productsResponse.data.results); // Ambil dari .results

    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (productId, productName) => {
    // Konfirmasi sebelum menghapus
    if (window.confirm(`Anda yakin ingin menghapus produk "${productName}"?`)) {
      try {
        await axiosInstance.delete(`/dashboard/products/${productId}/`);
        toast.success('Produk berhasil dihapus.');
        fetchData(); // Muat ulang data untuk menghapus produk dari UI
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
        toast.error("Gagal menghapus produk.");
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      // Kirim PATCH request ke API dashboard/sales/
      await axiosInstance.patch(`/dashboard/sales/${orderId}/`, {
        status: newStatus,
      });
      toast.sucess(`Order #${orderId} telah diupdate ke ${newStatus}`);
      // Muat ulang data sales untuk menampilkan status baru
      fetchData();
    } catch (error) {
      console.error("Gagal update status order:", error);
      toast.error("Gagal update status.");
    }
  };

  if (loading) return <p className="p-8 text-center text-xl">Loading Dashboard...</p>;

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard Penjual</h1>

      {/* Bagian Penjualan (Sales) */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Order Masuk (Penjualan)</h2>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pembeli</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi (Ubah Status)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.length > 0 ? sales.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">{order.user ? order.user.email : 'N/A'}</td>
                  <td className="px-6 py-4 font-semibold">Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full
                      ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : ''}
                      ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {ORDER_STATUS_CHOICES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-4 text-center">Belum ada penjualan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian Produk */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Produk Saya</h2>
          <Link
            to="/dashboard/products/new"
            className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
          >
            + Tambah Produk Baru
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">Rp {parseFloat(product.price).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/products/edit/${product.id}`}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:underline" onClick={() => handleDeleteProduct(product.id, product.name)}>Hapus</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="p-4 text-center">Anda belum punya produk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;