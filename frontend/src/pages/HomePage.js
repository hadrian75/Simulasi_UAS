import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchProducts = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setProducts(response.data.results);
      setNextPageUrl(response.data.next);
    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageUrl) return;
    try {
      const response = await axios.get(nextPageUrl);
      setProducts(prevProducts => [...prevProducts, ...response.data.results]);
      setNextPageUrl(response.data.next);
    } catch (error) {
      console.error("Gagal memuat halaman berikutnya:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/categories/");
        setCategories(response.data.results);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let url = `http://127.0.0.1:8000/api/v1/products/?search=${searchTerm}`;

    if (selectedCategory) {
      url += `&category__slug=${selectedCategory}`;
    }

    fetchProducts(url);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-8">

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.first_name ? `Halo, ${user.first_name}! 👋` : 'Selamat Datang! 🛒'}
              </h1>
              <p className="text-gray-600 mt-1">Temukan produk terbaik untuk Anda</p>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Filter Kategori</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors
                ${!selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
            >
              Semua Kategori
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors
                  ${selectedCategory === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <span className="material-icons text-blue-600">store</span>
            <h2 className="text-2xl font-bold text-gray-800">Etalase Produk</h2>
            {!loading && products.length > 0 && (
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {products.length} produk
              </span>
            )}
          </div>

          {loading && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Memuat produk...</p>
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl">
                  <span className="material-icons text-gray-300 text-8xl mb-4">inventory_2</span>
                  <p className="text-gray-600 text-lg font-medium">Tidak ada produk ditemukan</p>
                  <p className="text-gray-400 text-sm mt-2">Coba cari dengan kata kunci lain</p>
                </div>
              )}

              {nextPageUrl && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center space-x-2 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm"
                  >
                    <span>Muat Lebih Banyak</span>
                    <span className="material-icons">expand_more</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;