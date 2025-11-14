import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const CheckoutPage = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

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
      if (!response.data.cart?.items || response.data.cart.items.length === 0) {
        navigate('/cart');
      }
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Create order
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price
        })),
        shippingAddress,
        paymentMethod,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal()
      };

      const response = await api.post('/orders', orderData);

      // Redirect to payment or order confirmation
      if (paymentMethod === 'card') {
        // Handle Stripe payment
        const paymentResponse = await api.post('/payments/create-intent', {
          orderId: response.data.order._id,
          amount: calculateTotal()
        });

        // Redirect to Stripe checkout or handle payment
        window.location.href = paymentResponse.data.checkoutUrl;
      } else {
        // For other payment methods, redirect to order confirmation
        navigate(`/orders/${response.data.order._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading checkout..." />
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your order</p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Shipping & Payment */}
        <div className="space-y-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Truck className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={shippingAddress.name}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={shippingAddress.email}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={shippingAddress.zipCode}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="card" className="ml-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span className="font-medium">Credit/Debit Card</span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="paypal" className="ml-3 flex items-center">
                  <span className="font-medium">PayPal</span>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  You will be redirected to Stripe's secure checkout page to complete your payment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-4">
                  <img
                    src={item.product.images?.[0] || '/placeholder-product.jpg'}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.product.discountPrice || item.product.price) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Order Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Your payment information is secure and encrypted.
              </span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {processing ? (
              <>
                <div className="spinner w-5 h-5 mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Place Order - ${calculateTotal().toFixed(2)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
