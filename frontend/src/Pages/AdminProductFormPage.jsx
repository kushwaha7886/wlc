import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    category: '',
    specs: {
      processor: '',
      ram: '',
      storage: '',
      display: '',
      graphics: '',
      os: ''
    },
    condition: {
      grade: 'A',
      description: '',
      warrantyMonths: 6
    },
    price: '',
    discountPrice: '',
    stock: '',
    images: [],
    description: '',
    featured: false
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCategories();
      if (isEditing) {
        fetchProduct();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data.data;
      setFormData({
        title: product.title || '',
        brand: product.brand || '',
        model: product.model || '',
        category: product.category?._id || '',
        specs: {
          processor: product.specs?.processor || '',
          ram: product.specs?.ram || '',
          storage: product.specs?.storage || '',
          display: product.specs?.display || '',
          graphics: product.specs?.graphics || '',
          os: product.specs?.os || ''
        },
        condition: {
          grade: product.condition?.grade || 'A',
          description: product.condition?.description || '',
          warrantyMonths: product.condition?.warrantyMonths || 6
        },
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        stock: product.stock || '',
        images: product.images || [],
        description: product.description || '',
        featured: product.featured || false
      });
      setImageUrls(product.images || []);
    } catch (err) {
      setError('Failed to load product. Please try again.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      try {
        const response = await api.post('/upload/image', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedUrls.push(response.data.url);
      } catch (err) {
        console.error('Error uploading image:', err);
        setError('Failed to upload image. Please try again.');
      }
    }

    setImageUrls(prev => [...prev, ...uploadedUrls]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));
  };

  const removeImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock),
        condition: {
          ...formData.condition,
          warrantyMonths: parseInt(formData.condition.warrantyMonths)
        }
      };

      if (isEditing) {
        await api.put(`/products/${id}`, submitData);
      } else {
        await api.post('/products', submitData);
      }

      navigate('/admin/products');
    } catch (err) {
      setError('Failed to save product. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            to="/admin/products"
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter model name"
            />
          </div>

          {/* Specifications */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
          </div>

          <div>
            <label htmlFor="specs.processor" className="block text-sm font-medium text-gray-700 mb-2">
              Processor
            </label>
            <input
              type="text"
              id="specs.processor"
              name="specs.processor"
              value={formData.specs.processor}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Intel Core i5-12400F"
            />
          </div>

          <div>
            <label htmlFor="specs.ram" className="block text-sm font-medium text-gray-700 mb-2">
              RAM
            </label>
            <input
              type="text"
              id="specs.ram"
              name="specs.ram"
              value={formData.specs.ram}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 16GB DDR4"
            />
          </div>

          <div>
            <label htmlFor="specs.storage" className="block text-sm font-medium text-gray-700 mb-2">
              Storage
            </label>
            <input
              type="text"
              id="specs.storage"
              name="specs.storage"
              value={formData.specs.storage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 512GB SSD"
            />
          </div>

          <div>
            <label htmlFor="specs.display" className="block text-sm font-medium text-gray-700 mb-2">
              Display
            </label>
            <input
              type="text"
              id="specs.display"
              name="specs.display"
              value={formData.specs.display}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder='e.g., 15.6" FHD 1920x1080'
            />
          </div>

          <div>
            <label htmlFor="specs.graphics" className="block text-sm font-medium text-gray-700 mb-2">
              Graphics
            </label>
            <input
              type="text"
              id="specs.graphics"
              name="specs.graphics"
              value={formData.specs.graphics}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., NVIDIA GTX 1650"
            />
          </div>

          <div>
            <label htmlFor="specs.os" className="block text-sm font-medium text-gray-700 mb-2">
              Operating System
            </label>
            <input
              type="text"
              id="specs.os"
              name="specs.os"
              value={formData.specs.os}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Windows 11 Home"
            />
          </div>

          {/* Condition */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Condition</h2>
          </div>

          <div>
            <label htmlFor="condition.grade" className="block text-sm font-medium text-gray-700 mb-2">
              Grade *
            </label>
            <select
              id="condition.grade"
              name="condition.grade"
              value={formData.condition.grade}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="A">A (Excellent)</option>
              <option value="B">B (Good)</option>
              <option value="C">C (Fair)</option>
            </select>
          </div>

          <div>
            <label htmlFor="condition.warrantyMonths" className="block text-sm font-medium text-gray-700 mb-2">
              Warranty (Months) *
            </label>
            <input
              type="number"
              id="condition.warrantyMonths"
              name="condition.warrantyMonths"
              value={formData.condition.warrantyMonths}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="condition.description" className="block text-sm font-medium text-gray-700 mb-2">
              Condition Description
            </label>
            <textarea
              id="condition.description"
              name="condition.description"
              value={formData.condition.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the condition of the product"
            />
          </div>

          {/* Pricing and Stock */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Stock</h2>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Discount Price ($)
            </label>
            <input
              type="number"
              id="discountPrice"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00 (optional)"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        {'×'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Link
            to="/admin/products"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {isEditing ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
