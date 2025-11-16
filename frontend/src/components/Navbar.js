// frontend/src/components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <span className="material-icons text-3xl">storefront</span>
            <span className="font-bold text-xl">MarketPlace</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <span className="material-icons text-xl">home</span>
              <span className="font-medium">Home</span>
            </Link>

            {user ? (
              <>
                <Link to="/cart" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <span className="material-icons text-xl">shopping_cart</span>
                  <span className="font-medium">Keranjang</span>
                </Link>

                <Link to="/orders" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <span className="material-icons text-xl">receipt_long</span>
                  <span className="font-medium">Orders</span>
                </Link>

                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <span className="material-icons text-xl">dashboard</span>
                  <span className="font-medium">Dashboard</span>
                </Link>

                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="material-icons text-2xl text-blue-600">account_circle</span>
                    <span className="font-medium text-sm">
                      <Link to="/profile" className="font-semibold hover:text-blue-200">
                        Halo, {user.first_name}
                      </Link>
                    </span>
                  </div>

                  <button
                    onClick={logoutUser}
                    className="flex items-center space-x-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <span className="material-icons text-xl">logout</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span className="material-icons text-xl">login</span>
                  <span className="font-medium">Login</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span className="material-icons text-xl">person_add</span>
                  <span className="font-medium">Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;