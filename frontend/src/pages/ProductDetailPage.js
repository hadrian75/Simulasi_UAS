// frontend/src/pages/ProductDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../api/AxiosInstance';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Anda harus login untuk menambahkan item ke keranjang.");
      navigate("/login");
      return;
    }

    if (quantity <= 0) {
      toast.info("Kuantitas harus minimal 1.");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Stok tidak mencukupi. Stok tersisa: ${product.stock}`);
      return;
    }

    try {
      await axiosInstance.post('/cart/', {
        product: product.id,
        quantity: quantity,
      });
      toast.success(`"${product.name}" (x${quantity}) telah ditambahkan ke keranjang!`);
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
      toast.error("Gagal menambahkan item ke keranjang.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="material-icons text-gray-300 text-8xl mb-4">inventory_2</span>
        <p className="text-xl text-gray-700 mb-6">Produk tidak ditemukan</p>
        <Link to="/" className="text-blue-600 hover:underline">← Kembali ke beranda</Link>
      </div>
    );
  }

  const imageUrl = product.image || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600 flex items-center space-x-1">
            <span className="material-icons text-sm">home</span>
            <span>Home</span>
          </Link>
          <span className="material-icons text-sm">chevron_right</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Product Image */}
            <div className="bg-gray-50 p-8 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              {/* Price */}
              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  Rp {parseFloat(product.price).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Deskripsi Produk
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'Tidak ada deskripsi tersedia.'}
                </p>
              </div>

              {/* Stock Info */}
              <div className="flex items-center space-x-2 mb-6 p-4 bg-blue-50 rounded-lg">
                <span className="material-icons text-blue-600">inventory</span>
                <span className="text-gray-700">Stok Tersedia:</span>
                <span className="font-bold text-gray-800">{product.stock} unit</span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Jumlah
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <span className="material-icons text-gray-600">remove</span>
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={product.stock}
                    className="w-20 text-center px-3 py-2 border-2 border-gray-200 rounded-lg font-semibold text-lg focus:outline-none focus:border-blue-500"
                  />

                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <span className="material-icons text-gray-600">add</span>
                  </button>

                  <span className="text-gray-500 text-sm">Max: {product.stock}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <span className="material-icons">add_shopping_cart</span>
                  <span>Tambah ke Keranjang</span>
                </button>

                <Link
                  to="/"
                  className="block w-full text-center border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Kembali ke Etalase
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;