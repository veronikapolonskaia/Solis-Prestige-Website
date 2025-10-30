import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, PencilIcon, TrashIcon, EyeIcon,
  ShoppingBagIcon, StarIcon, TagIcon, PhotoIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock product data
  const mockProduct = {
    id: id,
    name: 'Premium Wireless Headphones',
    sku: 'WH-001',
    description: 'High-quality wireless headphones with noise cancellation technology. Perfect for music lovers and professionals who need crystal clear audio.',
    shortDescription: 'Premium wireless headphones with noise cancellation',
    price: 299.99,
    comparePrice: 399.99,
    costPrice: 150.00,
    quantity: 45,
    trackQuantity: true,
    weight: 0.5,
    taxable: true,
    isActive: true,
    category: {
      id: 1,
      name: 'Electronics',
      slug: 'electronics'
    },
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', altText: 'Headphones front view', isMain: true },
      { id: 2, url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', altText: 'Headphones side view', isMain: false },
      { id: 3, url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', altText: 'Headphones in case', isMain: false }
    ],
    variants: [
      { id: 1, name: 'Black', sku: 'WH-001-BLK', price: 299.99, quantity: 20, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
      { id: 2, name: 'White', sku: 'WH-001-WHT', price: 299.99, quantity: 15, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200' },
      { id: 3, name: 'Blue', sku: 'WH-001-BLU', price: 319.99, quantity: 10, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' }
    ],
    metaTitle: 'Premium Wireless Headphones - Best Audio Quality',
    metaDescription: 'Experience premium sound quality with our wireless headphones featuring noise cancellation technology.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    sales: 127,
    revenue: 38097.73,
    rating: 4.8,
    reviewCount: 89
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from API
      // const response = await api.get(`/products/${id}`);
      // setProduct(response.data);
      setProduct(mockProduct);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      // In a real app, this would call API
      // await api.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'variants', name: 'Variants' },
    { id: 'images', name: 'Images' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'reviews', name: 'Reviews' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/products')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={deleteProduct}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Product Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Price</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
              {product.comparePrice > product.price && (
                <p className="text-sm text-gray-500 line-through">{formatCurrency(product.comparePrice)}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <TagIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Stock</p>
              <p className="text-2xl font-bold text-gray-900">{product.quantity}</p>
              <p className="text-sm text-gray-500">units available</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <div className="flex items-center">
                <StarIconSolid className="h-4 w-4 text-yellow-400" />
                <span className="text-2xl font-bold text-gray-900 ml-1">{product.rating}</span>
              </div>
              <p className="text-sm text-gray-500">{product.reviewCount} reviews</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <EyeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sales</p>
              <p className="text-2xl font-bold text-gray-900">{product.sales}</p>
              <p className="text-sm text-gray-500">units sold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="text-sm text-gray-900">{product.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">SKU</dt>
                      <dd className="text-sm text-gray-900">{product.sku}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-900">{product.category.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Weight</dt>
                      <dd className="text-sm text-gray-900">{product.weight} kg</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Taxable</dt>
                      <dd className="text-sm text-gray-900">{product.taxable ? 'Yes' : 'No'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Selling Price</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(product.price)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Compare Price</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(product.comparePrice)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Cost Price</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(product.costPrice)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Profit Margin</dt>
                      <dd className="text-sm text-gray-900">
                        {((product.price - product.costPrice) / product.price * 100).toFixed(1)}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                <p className="text-sm text-gray-700">{product.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Meta Title</dt>
                      <dd className="text-sm text-gray-900">{product.metaTitle}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Meta Description</dt>
                      <dd className="text-sm text-gray-900">{product.metaDescription}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="text-sm text-gray-900">{formatDate(product.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="text-sm text-gray-900">{formatDate(product.updatedAt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'variants' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Add Variant
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {product.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={variant.image}
                              alt={variant.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{variant.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {variant.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(variant.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {variant.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  Add Image
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.altText}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <button className="p-2 bg-white rounded-md text-gray-700 hover:text-gray-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="p-2 bg-white rounded-md text-gray-700 hover:text-gray-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {image.isMain && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Main
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Sales</span>
                      <span className="text-sm font-medium text-gray-900">{product.sales} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <span className="text-sm font-medium text-gray-900">{product.rating}/5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Stock</span>
                      <span className="text-sm font-medium text-gray-900">{product.quantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Low Stock Alert</span>
                      <span className="text-sm font-medium text-gray-900">10 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`text-sm font-medium ${
                        product.quantity > 10 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.quantity > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Feedback</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Reviews</span>
                      <span className="text-sm font-medium text-gray-900">{product.reviewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Rating</span>
                      <span className="text-sm font-medium text-gray-900">{product.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rating Distribution</span>
                      <span className="text-sm font-medium text-gray-900">View Details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                  View All Reviews
                </button>
              </div>
              <div className="space-y-4">
                {/* Mock reviews */}
                {[1, 2, 3].map((review) => (
                  <div key={review} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Customer {review}</h4>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700">
                      Great product! The sound quality is amazing and the noise cancellation works perfectly.
                      Highly recommend for anyone looking for premium headphones.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 