// frontend/src/components/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance"; // 1. Impor instance baru

const ProductCard = ({ product }) => {
  const imageUrl = product.image
    ? `http://127.0.0.1:8000${product.image}`
    : "https://via.placeholder.com/300x200";

  // 2. Fungsi untuk handle Add to Cart
  const handleAddToCart = async () => {
    try {
      // Kirim POST ke API cart menggunakan axiosInstance (sudah ada token)
      await axiosInstance.post("/cart/", {
        product: product.id,
        quantity: 1, // Tambah 1 buah
      });
      alert(`"${product.name}" telah ditambahkan ke keranjang!`);
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
      alert("Gagal! Anda harus login untuk menambahkan item.");
    }
  };

  return (
    <div className="border rounded-lg shadow-lg overflow-hidden bg-white flex flex-col ...">
      {/* ... (Bagian gambar dan teks) ... */}

      {/* Tombol Aksi */}
      <div className="mt-auto p-4 pt-0">
        <Link
          to={`/product/${product.id}`}
          className="block text-center w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2"
        >
          Lihat Detail
        </Link>

        {/* 3. Tombol Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="block text-center w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
