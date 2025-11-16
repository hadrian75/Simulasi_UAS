import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orders } = location.state || { orders: [] };

  if (orders.length === 0) {
    return <Navigate to="/" replace />;
  }

  const grandTotal = orders.reduce((total, order) => total + parseFloat(order.total_amount), 0);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-2xl text-center">

        <div className="bg-white p-10 rounded-xl shadow-lg">
          <span className="material-icons text-8xl text-green-500 mb-4">
            check_circle
          </span>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Checkout Berhasil!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Terima kasih atas pesanan Anda. Silakan selesaikan pembayaran untuk diproses oleh penjual.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Instruksi Pembayaran</h2>
            <p className="text-gray-700 mb-2">
              Silakan lakukan transfer sejumlah:
            </p>
            <p className="text-3xl font-bold text-gray-900 mb-4">
              Rp {grandTotal.toLocaleString('id-ID')}
            </p>
            <p className="text-gray-700 font-medium">Ke rekening berikut:</p>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li><strong>Bank:</strong> BCA</li>
              <li><strong>No. Rekening:</strong> 1234567890</li>
              <li><strong>Atas Nama:</strong> PT MarketPlace Majalengka</li>
            </ul>
            <p className="text-sm text-red-600 mt-4 font-medium">
              PENTING: Harap transfer sesuai total tagihan. Order akan diproses oleh penjual setelah pembayaran diverifikasi (maks. 1x24 jam).
            </p>
          </div>

          <div className="text-left mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Rincian Order Anda</h3>
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">Order #{order.id}</span>
                  <span className="font-semibold text-gray-700">Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Penjual: <strong>{order.seller.email}</strong>
                </p>
                <ul className="list-disc list-inside pl-5 mt-2 text-sm text-gray-500">
                  {order.items.map(item => (
                    <li key={item.product.id}>
                      {item.quantity}x {item.product.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link
            to="/orders"
            className="w-full inline-block bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Lihat Riwayat Order Saya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;