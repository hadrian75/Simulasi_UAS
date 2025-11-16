import React, { useState, useEffect, useContext } from 'react';
import AxiosInstance from '../api/AxiosInstance';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- 1. TAMBAHKAN STATE BARU UNTUK ALAMAT ---
  const [shippingAddress, setShippingAddress] = useState('');

  // ... (fungsi fetchCartItems, handleRemoveItem, handleUpdateQuantity - tidak berubah) ...
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get('/cart/');
      setCartItems(response.data.results);
    } catch (error) {
      console.error("Gagal mengambil keranjang:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      await AxiosInstance.delete(`/cart/${itemId}/`);
      fetchCartItems();
    } catch (error) {
      console.error("Gagal menghapus item:", error);
      toast.error("Gagal menghapus item.");
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item.id);
      return;
    }
    try {
      await AxiosInstance.patch(`/cart/${item.id}/`, {
        quantity: newQuantity,
      });
      fetchCartItems();
    } catch (error) {
      console.error("Gagal update kuantitas:", error);
      toast.error(`Gagal update: ${error.response?.data?.error || 'Error'}`);
    }
  };


  // --- 2. MODIFIKASI FUNGSI CHECKOUT (HAPUS PROMPT) ---
  const handleCheckout = async () => {
    // Baca dari state, bukan prompt
    if (!shippingAddress) {
      toast.info("Alamat pengiriman wajib diisi.");
      return;
    }

    try {
      const response = await AxiosInstance.post('/checkout/', {
        shipping_address: shippingAddress, // Kirim alamat dari state
      });

      toast.success('Checkout berhasil! Silakan selesaikan pembayaran.');
      navigate('/order-success', { state: { orders: response.data } });

    } catch (error) {
      console.error("Checkout gagal:", error.response.data);
      toast.error(`Checkout Gagal: ${error.response.data.error}`);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.total_price), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Memuat keranjang...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* ... (Header Keranjang Belanja - tidak berubah) ... */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="material-icons text-blue-600 text-4xl">shopping_cart</span>
          <h1 className="text-3xl font-bold text-gray-800">Keranjang Belanja</h1>
          {cartItems.length > 0 && (
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {cartItems.length} item
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            {/* ... (Tampilan keranjang kosong - tidak berubah) ... */}
            <span className="material-icons text-gray-300 text-8xl mb-4">shopping_cart</span>
            <p className="text-xl text-gray-700 mb-2 font-medium">Keranjang Anda Kosong</p>
            <p className="text-gray-500 mb-6">Yuk mulai belanja dan temukan produk favoritmu!</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <span className="material-icons">store</span>
              <span>Mulai Belanja</span>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Cart Items (Bagian Kiri - tidak berubah) */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  {/* ... (kode item.product.name, price, quantity, remove, dll) ... */}
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image || 'https://via.placeholder.com/120'}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-blue-600 font-semibold text-lg mb-3">
                        Rp {parseFloat(item.product.price).toLocaleString('id-ID')}
                      </p>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <span className="material-icons text-gray-600">remove</span>
                        </button>
                        <span className="w-12 text-center text-lg font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <span className="material-icons text-gray-600">add</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <p className="font-bold text-xl text-gray-800">
                        Rp {parseFloat(item.total_price).toLocaleString('id-ID')}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <span className="material-icons">delete</span>
                        <span className="font-medium">Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (Bagian Kanan) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <span className="material-icons text-blue-600">receipt</span>
                  <span>Ringkasan Belanja</span>
                </h2>

                <div className="space-y-4 mb-6">
                  {/* --- 3. TAMBAHKAN FORM ALAMAT DI SINI --- */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="shippingAddress">
                      Alamat Pengiriman
                    </label>
                    <textarea
                      id="shippingAddress"
                      rows="4"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Masukkan alamat lengkap Anda (Jalan, Kota, Kode Pos)"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  {/* ------------------------------------- */}

                  <div className="flex justify-between text-gray-600">
                    <span>Total Item</span>
                    <span className="font-semibold">{cartItems.length}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-baseline mb-6">
                      <span className="text-gray-800 font-semibold text-lg">Total Harga</span>
                      <span className="font-bold text-2xl text-blue-600">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span className="material-icons">payment</span>
                  <span>Checkout Sekarang</span>
                </button>

                <Link
                  to="/"
                  className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Lanjut Belanja
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;