import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-md rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="email@anda.com"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Password Anda"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
