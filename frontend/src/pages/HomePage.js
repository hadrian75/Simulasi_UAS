// frontend/src/pages/HomePage.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
const HomePage = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/v1/products/"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-8">
        {user && (
          <h1 className="text-3xl font-bold text-blue-600 mb-8">
            Selamat datang, <span className="font-semibold">{user.email}</span>!
          </h1>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Etalase Produk
        </h2>

        {loading ? (
          <p className="text-center text-xl">Loading produk...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-gray-700">Belum ada produk yang tersedia.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
