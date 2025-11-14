import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const CartPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isLoggedIn, navigate]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data.cart);
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (quantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const response = await api.patch('/cart/' + productId, { quantity });
      setCart(response.data.cart);
    } catch (err) {
      setError('Failed to update item. Please try again.');
      console.error('Error updating cart item:', err);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const removeCartItem = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const response = await api.delete('/cart/' + productId);
      setCart(response.data.cart);
    } catch (err) {
      setError('Failed to remove item. Please try again.');
      console.error('Error removing cart item:', err);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your cart..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {!cart?.items || cart.items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-gray-600">{item.product.brand} {item.product.model}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.product.discountPrice || item.product.price}
                        </span>
                        {item.product.discountPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${item.product.price}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                          disabled={updatingItems.has(item.product._id)}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-center min-w-12">
                          {updatingItems.has(item.product._id) ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                          disabled={updatingItems.has(item.product._id)}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeCartItem(item.product._id)}
                        disabled={updatingItems.has(item.product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block mt-6"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center block mt-3"
              >
                Continue Shopping
              </Link>

              {calculateSubtotal() < 100 && (
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Add ${(100 - calculateSubtotal()).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
