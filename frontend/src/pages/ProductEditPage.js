import React, { useState, useEffect } from 'react';
import AxiosInstance from '../api/AxiosInstance';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosInstance.get('/categories/');
        setCategories(response.data.results);
      } catch (error) {
        console.error('Failed to fetch categories', error);
        toast.error('Gagal memuat kategori');
      }
    };

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get(`/dashboard/products/${id}/`);
        const product = response.data;

        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setCurrentImage(product.image);

        if (product.category) {
          setSelectedCategory(product.category.id);
        }

      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
        toast.error("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error('Silakan pilih kategori produk.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', selectedCategory);

    if (image) {
      formData.append('image', image, image.name);
    }

    try {
      await AxiosInstance.patch(`/dashboard/products/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produk berhasil diperbarui!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Gagal update produk:', error.response.data);
      toast.error(`Gagal: ${JSON.stringify(error.response.data)}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !name) {
    return <p className="p-8 text-center text-xl">Loading form edit...</p>;
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Produk</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg">

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Nama Produk
          </label>
          <input
            type="text" id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded" required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
            Kategori
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-white"
            required
          >
            <option value="" disabled>Pilih Kategori...</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
            Deskripsi
          </label>
          <textarea
            id="description" value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded" rows="4"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
            Harga (Rp)
          </label>
          <input
            type="number" id="price" value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded" min="0" required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="stock">
            Stok
          </label>
          <input
            type="number" id="stock" value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-3 py-2 border rounded" min="0" required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
            Ganti Gambar Produk
          </label>
          {currentImage && (
            <div className="mb-2">
              <p>Gambar saat ini:</p>
              <img src={currentImage} alt="Gambar produk saat ini" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          <input
            type="file" id="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Update Produk'}
          </button>
          <Link to="/dashboard" className="text-gray-600 hover:underline">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;