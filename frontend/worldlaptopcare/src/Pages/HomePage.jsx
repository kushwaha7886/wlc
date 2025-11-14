import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Shield, Truck, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/categories')
        ]);

        setFeaturedProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data.categories || []);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Laptop Repair Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Expert repair and maintenance for all major laptop brands.
              Fast, reliable, and affordable service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Browse Products
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/categories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">All repairs backed by our quality guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick delivery of parts and repaired devices</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">24/7 customer support from certified technicians</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing on all services and parts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find the perfect solution for your laptop needs</p>
          </div>

          {error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center group"
                >
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/categories"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Categories
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Discover our most popular and highly-rated products</p>
          </div>

          {error ? (
            <ErrorMessage message={error} />
          ) : featuredProducts.length > 0 ? (
            <div className="grid-responsive">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Products
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real experiences from satisfied customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Excellent service! My laptop was repaired quickly and professionally.
                The technicians were knowledgeable and the price was very reasonable."
              </p>
              <div className="font-semibold text-gray-900">John Smith</div>
              <div className="text-sm text-gray-500">Verified Customer</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "WorldLaptopCare saved my business laptop! They diagnosed and fixed
                the issue within hours. Highly recommend their services."
              </p>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-500">Business Owner</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Fast shipping and great customer support. The replacement parts
                were genuine and the installation was perfect."
              </p>
              <div className="font-semibold text-gray-900">Mike Davis</div>
              <div className="text-sm text-gray-500">Tech Enthusiast</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Laptop Repair Services?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Get your laptop back in working condition with our expert repair services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="tel:+15551234567"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Call Now: (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
