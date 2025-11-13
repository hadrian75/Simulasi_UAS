// frontend/src/components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl hover:text-blue-200">
          E-Commerce
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>

          {user ? (
            <>
              <span className="font-semibold">Halo, {user.email}</span>
              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
