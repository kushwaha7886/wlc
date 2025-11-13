import { Link } from "react-router-dom";
import { X, Home, ShoppingBag, User, ClipboardList, Settings, LogOut } from "lucide-react";

export default function Sidebar({ isOpen, onClose, isLoggedIn, isAdmin, logout }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                <Home size={20} />
                Home
              </Link>
            </li>
            <li>
              <Link to="/category/laptops" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                <ShoppingBag size={20} />
                Laptops
              </Link>
            </li>
            <li>
              <Link to="/category/desktops" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                <ShoppingBag size={20} />
                Desktops
              </Link>
            </li>
            <li>
              <Link to="/category/accessories" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                <ShoppingBag size={20} />
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/orders" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                <ClipboardList size={20} />
                Orders
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link to="/cart" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                  <ShoppingBag size={20} />
                  Cart
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link to="/profile" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                  <User size={20} />
                  Profile
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link to="/admin" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                  <Settings size={20} />
                  Admin Dashboard
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button onClick={() => { logout(); onClose(); }} className="flex items-center gap-3 text-gray-700 hover:text-red-600 w-full text-left">
                  <LogOut size={20} />
                  Logout
                </button>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <Link to="/login" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                  <User size={20} />
                  Login
                </Link>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <Link to="/register" className="flex items-center gap-3 text-gray-700 hover:text-blue-600" onClick={onClose}>
                  <User size={20} />
                  Register
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
