// frontend/src/pages/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/AxiosInstance';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/orders/');
        setOrders(response.data.results);
      } catch (error) {
        console.error("Gagal mengambil riwayat order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'PROCESSING': 'bg-blue-100 text-blue-700',
      'SHIPPED': 'bg-purple-100 text-purple-700',
      'DELIVERED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': 'schedule',
      'PROCESSING': 'sync',
      'SHIPPED': 'local_shipping',
      'DELIVERED': 'check_circle',
      'CANCELLED': 'cancel',
    };
    return icons[status] || 'info';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Memuat riwayat order...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <span className="material-icons text-blue-600 text-4xl">receipt_long</span>
          <h1 className="text-3xl font-bold text-gray-800">Riwayat Pesanan</h1>
          {orders.length > 0 && (
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {orders.length} pesanan
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <span className="material-icons text-gray-300 text-8xl mb-4">receipt_long</span>
            <p className="text-xl text-gray-700 mb-2 font-medium">Belum Ada Riwayat Pesanan</p>
            <p className="text-gray-500 mb-6">Yuk mulai belanja dan buat pesanan pertamamu!</p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <span className="material-icons">store</span>
              <span>Mulai Belanja</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">

                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="material-icons text-blue-600">receipt</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <span className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      <span className="material-icons text-sm">{getStatusIcon(order.status)}</span>
                      <span>{order.status}</span>
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-gray-600">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                    <span className="material-icons text-sm">inventory_2</span>
                    <span>Item Pesanan</span>
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-blue-600">inventory</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.quantity}x @ Rp {parseFloat(item.price).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">
                          Rp {(parseFloat(item.price) * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="material-icons text-blue-600 text-sm mt-0.5">location_on</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Alamat Pengiriman</p>
                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;