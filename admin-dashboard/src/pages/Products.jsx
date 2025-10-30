import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArchiveBoxIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader, Card, Badge, EmptyState, ConfirmDialog } from '../components';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState({ type: null, id: null });

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedCategory, selectedStatus, minPrice, maxPrice, sortBy, sortOrder, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      
      // Handle the API response structure according to documentation
      if (response.data?.success && response.data?.data) {
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        // Fallback for different response structure
        setCategories(response.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        category: selectedCategory, // This should be category slug, not ID
        inStock: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder || undefined,
      };

      const response = await api.get('/products', { params });
      
      // Handle the API response structure according to documentation
      if (response.data?.success && response.data?.data) {
        const { products, pagination } = response.data.data;
        setProducts(Array.isArray(products) ? products : []);
        setTotalPages(pagination?.totalPages || 1);
        setTotalItems(pagination?.totalItems || 0);
      } else {
        // Fallback for different response structure
        setProducts(Array.isArray(response.data?.data) ? response.data.data : []);
        setTotalPages(response.data?.totalPages || 1);
        setTotalItems(response.data?.totalItems || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      // Set empty array on error to prevent map errors
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    setConfirmContext({ type: 'single', id: productId });
    setConfirmOpen(true);
  };

  const confirmDeletion = async () => {
    try {
      if (confirmContext.type === 'single' && confirmContext.id) {
        await api.delete(`/products/${confirmContext.id}`);
      } else if (confirmContext.type === 'bulk') {
        await api.delete('/products/bulk', { data: { ids: selectedProducts } });
        setSelectedProducts([]);
      }
      toast.success('Product(s) deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }
    setConfirmContext({ type: 'bulk' });
    setConfirmOpen(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const colors = getStatusColor(status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        actions={(
          <>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
            <Link
              to="/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </>
        )}
      />

      {/* Filters */}
      {showFilters && (
        <Card className="border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="active">In Stock</option>
                <option value="inactive">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min price..."
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price..."
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Created Date</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      {!loading && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {totalItems > 0 ? (
                <>
                  Found <span className="font-medium">{totalItems}</span> products
                  {debouncedSearch && (
                    <> matching "<span className="font-medium">{debouncedSearch}</span>"</>
                  )}
                  {selectedCategory && (
                    <> in <span className="font-medium">{categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}</span></>
                  )}
                </>
              ) : (
                'No products found'
              )}
            </div>
            <div className="text-sm text-gray-500">
              {sortBy && (
                <>Sorted by {sortBy} ({sortOrder})</>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sale Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-500">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : !Array.isArray(products) || products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-8">
                    <EmptyState title="No products found" description="Try adjusting your filters or add a new product." action={(
                      <Link to="/products/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">Add Product</Link>
                    )} />
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr key={product.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-50`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={product.images?.[0]?.url || '/logo192.png'}
                            alt={product.name}
                            onError={(e) => {
                              const img = e.currentTarget;
                              const src = img.src || '';
                              // Avoid infinite loops
                              if (img.dataset.fallbackTried === 'done') return;
                              // Try alternate path between /api/uploads and /uploads
                              if (!img.dataset.triedSwap) {
                                img.dataset.triedSwap = '1';
                                if (src.includes('/api/uploads/')) {
                                  img.src = src.replace('/api/uploads/', '/uploads/');
                                  return;
                                }
                                if (src.includes('/uploads/')) {
                                  img.src = src.replace('/uploads/', '/api/uploads/');
                                  return;
                                }
                              }
                              // Try extension alternatives if .webp fails
                              if (!img.dataset.triedExt && src.endsWith('.webp')) {
                                img.dataset.triedExt = '1';
                                img.src = src.replace(/\.webp$/i, '.png');
                                return;
                              }
                              // Final fallback
                              img.dataset.fallbackTried = 'done';
                              img.src = '/logo192.png';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                SALE
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.comparePrice && product.comparePrice > product.price ? (
                        <span className="text-red-600 font-medium">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.trackQuantity ? product.quantity : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={product.quantity > 0 ? 'green' : 'red'}>
                        {product.quantity > 0 ? 'in stock' : 'out of stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{products.length}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> products{' '}
                  (page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title={confirmContext.type === 'bulk' ? 'Delete selected products?' : 'Delete this product?'}
        description={confirmContext.type === 'bulk' ? `This will delete ${selectedProducts.length} products. This action cannot be undone.` : 'This action cannot be undone.'}
        confirmText="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeletion}
      />
    </div>
  );
};

export default Products; 