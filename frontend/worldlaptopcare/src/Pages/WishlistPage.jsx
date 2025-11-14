import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const WishlistPage = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isLoggedIn, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data.wishlist || []);
    } catch (err) {
      setError('Failed to load wishlist. Please try again.');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      await api.delete('/wishlist/' + productId);
      setWishlist(prev => prev.filter(item => item.product._id !== productId));
    } catch (err) {
      setError('Failed to remove item from wishlist. Please try again.');
      console.error('Error removing from wishlist:', err);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const addToCart = async (product) => {
    setUpdatingItems(prev => new Set(prev).add(product._id));

    try {
      await api.post('/cart', { productId: product._id, quantity: 1 });
      // Optionally, remove from wishlist after adding to cart
      // setWishlist(prev => prev.filter(item => item.product._id !== product._id));
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
      console.error('Error adding to cart:', err);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product._id);
        return newSet;
      });
    }
  };

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your wishlist..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Heart className="h-8 w-8 text-red-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your wishlist!</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${item.product._id}`}>
                <img
                  src={item.product.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.product.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link
                  to={`/products/${item.product._id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {item.product.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{item.product.brand} {item.product.model}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xl font-bold text-gray-900">
                    ${item.product.discountPrice || item.product.price}
                  </span>
                  {item.product.discountPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${item.product.price}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => addToCart(item.product)}
                    disabled={updatingItems.has(item.product._id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {updatingItems.has(item.product._id) ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
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
      )}
    </div>
  );
};

export default WishlistPage;
