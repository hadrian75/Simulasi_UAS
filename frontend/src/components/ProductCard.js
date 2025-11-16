import React from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../api/AxiosInstance";
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const imageUrl = product.image
    ? `${product.image}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  const handleAddToCart = async () => {
    try {
      await AxiosInstance.post("/cart/", {
        product: product.id,
        quantity: 1,
      });
      toast.success(`"${product.name}" telah ditambahkan ke keranjang!`);
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
      toast.error("Gagal! Anda harus login untuk menambahkan item.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Stok Terbatas
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">

        {/* --- TAMBAHKAN KATEGORI DI SINI --- */}
        {product.category && (
          <Link
            to={`/?category__slug=${product.category.slug}`}
            className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full self-start mb-2 hover:bg-blue-200"
          >
            {product.category.name}
          </Link>
        )}
        {/* ---------------------------------- */}

        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 min-h-[56px] flex-grow">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-blue-600">
              Rp {parseFloat(product.price).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-gray-500">
            <span className="material-icons text-sm">inventory</span>
            <span className="text-sm">{product.stock}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-auto">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center space-x-1 bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2.5 rounded-lg transition-colors font-medium"
          >
            <span className="material-icons text-xl">visibility</span>
            <span>Detail</span>
          </Link>

          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors font-medium"
          >
            <span className="material-icons text-xl">add_shopping_cart</span>
            <span>Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;