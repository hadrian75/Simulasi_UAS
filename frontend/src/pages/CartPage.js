// frontend/src/pages/CartPage.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data keranjang
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/cart/");
      setCartItems(response.data);
    } catch (error) {
      console.error("Gagal mengambil keranjang:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat halaman dimuat
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fungsi untuk menghapus item
  const handleRemoveItem = async (itemId) => {
    try {
      await axiosInstance.delete(`/cart/${itemId}/`);
      alert("Item dihapus");
      fetchCartItems(); // Ambil ulang data keranjang
    } catch (error) {
      console.error("Gagal menghapus item:", error);
    }
  };

  // Fungsi untuk update kuantitas (Contoh: Tambah 1)
  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(item.id); // Hapus jika kuantitas 0 atau kurang
      return;
    }

    try {
      await axiosInstance.patch(`/cart/${item.id}/`, {
        quantity: newQuantity,
      });
      fetchCartItems(); // Ambil ulang data
    } catch (error) {
      console.error("Gagal update kuantitas:", error);
    }
  };

  // Hitung Total Harga
  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.total_price),
    0
  );

  if (loading) return <p className="p-8 text-center">Loading keranjang...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja Anda</h1>

      {cartItems.length === 0 ? (
        <p>
          Keranjang Anda kosong.{" "}
          <Link to="/" className="text-blue-600">
            Mulai belanja!
          </Link>
        </p>
      ) : (
        <div className="lg:flex lg:space-x-8">
          {/* Daftar Item */}
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b p-4 mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={`http://127.0.0.1:8000${item.product.image}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">
                      Rp{" "}
                      {parseFloat(item.product.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold">
                  Rp {parseFloat(item.total_price).toLocaleString("id-ID")}
                </p>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          {/* Ringkasan & Checkout */}
          <div className="lg:w-1/3 p-6 bg-gray-100 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4">Ringkasan</h2>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total Harga:</span>
              <span className="font-bold text-xl">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
              Lanjut ke Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
