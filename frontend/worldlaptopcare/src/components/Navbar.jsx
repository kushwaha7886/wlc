import { Link } from "react-router-dom";
import { ShoppingCart, User, Laptop, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn, isAdmin, logout, user } = useAuth();

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-gray-700 hover:text-indigo-600">
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold text-indigo-600">Refurbify</Link>
          </div>
          <div className="hidden md:flex items-center gap-6 text-gray-700">
            <Link to="/category/laptops" className="hover:text-indigo-600 transition-colors">Laptops</Link>
            <Link to="/category/desktops" className="hover:text-indigo-600 transition-colors">Desktops</Link>
            <Link to="/category/accessories" className="hover:text-indigo-600 transition-colors">Accessories</Link>
            <Link to="/orders" className="hover:text-indigo-600 transition-colors">Orders</Link>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-indigo-600 mr-4 transition-colors"><ShoppingCart size={22} /></Link>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600 mr-4 transition-colors"><User size={22} /></Link>
                {isAdmin && (
                  <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 mr-2 transition-colors">Admin</Link>
                )}
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 mr-2 transition-colors">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isLoggedIn={isLoggedIn} isAdmin={isAdmin} logout={logout} />
    </>
  );
}
