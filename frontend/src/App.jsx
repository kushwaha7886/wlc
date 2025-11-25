import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ProductsPage from "./Pages/ProductsPage";
import ProductDetailPage from "./Pages/Productdetail";
import CategoriesPage from "./Pages/CategoriesPage";
import CartPage from "./Pages/CartPage";
import WishlistPage from "./Pages/WishlistPage";
import CheckoutPage from "./Pages/CheckoutPage";
import OrdersPage from "./Pages/OrdersPage";
import ProfilePage from "./Pages/ProfilePage";
import AdminDashboardPage from "./Pages/AdminDashboardPage";
import AdminProductsPage from "./Pages/AdminProductsPage";
import AdminProductFormPage from "./Pages/AdminProductFormPage";
import AdminCategoriesPage from "./Pages/AdminCategoriesPage";
import AdminCategoryFormPage from "./Pages/AdminCategoryFormPage";
import AdminUsersPage from "./Pages/AdminUsersPage";
import AdminOrdersPage from "./Pages/AdminOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="categories" element={<CategoriesPage />} />

          {/* Protected Routes */}
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/products"
            element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/products/new"
            element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/products/:id/edit"
            element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/categories"
            element={
              <AdminRoute>
                <AdminCategoriesPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
