import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const ProductCard = ({ product }) => {
  const { isLoggedIn } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    try {
      await api.post('/cart', {
        productId: product._id,
        quantity: 1
      });
      // Show success message or update cart count
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) return;

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await api.delete(`/wishlist/${product._id}`);
      } else {
        // Add to wishlist
        await api.post('/wishlist', { productId: product._id });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        </Link>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            Featured
          </span>
        )}
        {product.discountPrice && (
          <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </span>
        )}
        {isLoggedIn && (
          <button
            onClick={handleToggleWishlist}
            className={`absolute bottom-2 right-2 p-2 rounded-full ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
            } hover:scale-110 transition-transform`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-2">{product.brand} {product.model}</p>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(4)} {/* Placeholder rating */}
          </div>
          <span className="text-sm text-gray-500 ml-2">(0 reviews)</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ${product.discountPrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>
          <span className={`text-sm px-2 py-1 rounded ${
            product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Condition:</span> {product.condition?.grade || 'N/A'}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isLoggedIn || product.stock === 0 || isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              !isLoggedIn || product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
