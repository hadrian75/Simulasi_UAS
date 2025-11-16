import React, { useState, useEffect } from 'react';
import AxiosInstance from '../api/AxiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosInstance.get('/categories/');
        setCategories(response.data.results);
        if (response.data.results.length > 0) {
          setSelectedCategory(response.data.results[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
        toast.error('Gagal memuat kategori');
      }
    };
    fetchCategories();
  }, []);

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

    if (image) {
      formData.append('image', image, image.name);
    }

    formData.append('category', selectedCategory);

    try {
      await AxiosInstance.post('/dashboard/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produk baru berhasil ditambahkan!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Gagal menambah produk:', error.response.data);
      toast.error(`Gagal: ${JSON.stringify(error.response.data)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Tambah Produk Baru</h1>
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
            Gambar Produk
          </label>
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
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
          <Link to="/dashboard" className="text-gray-600 hover:underline">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductCreatePage;