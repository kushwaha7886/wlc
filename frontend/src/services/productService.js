import api from './api';

export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryString}`);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get(`/products?search=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get user wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlists');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post('/wishlists', { productId });
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete('/wishlists/' + productId);
    return response.data;
  },

  // Delete current user wishlist
  deleteWishlist: async () => {
    const response = await api.delete('/wishlists/current');
    return response.data;
  },

  // Get user orders
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Checkout (create order)
  checkout: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get single order
  getOrderById: async (orderId) => {
    const response = await api.get('/orders/' + orderId);
    return response.data;
  },

  // Delete current user order
  deleteCurrentOrder: async () => {
    const response = await api.delete('/orders/current');
    return response.data;
  }
};

export default productService;
