import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  StarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader, Card, Badge, EmptyState, ConfirmDialog } from '../components';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [sortBy, setSortBy] = useState('display_order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState({ type: null, id: null });
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDescModal, setShowDescModal] = useState(false);
  const [descItem, setDescItem] = useState(null);
  const [descValue, setDescValue] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);

const fetchCategories = useCallback(async () => {
  try {
    const response = await api.get('/gallery/categories');
    setCategories(response.data.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}, []);

const fetchGalleryItems = useCallback(async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      limit: 12,
    });

    if (debouncedSearch) params.append('search', debouncedSearch);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedStatus) params.append('status', selectedStatus);
    if (featuredFilter) params.append('featured', featuredFilter);

    const response = await api.get(`/gallery?${params}`);
    setGalleryItems(response.data.data);
    setTotalPages(response.data.pagination.pages);
    setTotalItems(response.data.pagination.total);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    toast.error('Failed to fetch gallery items');
  } finally {
    setLoading(false);
  }
}, [currentPage, debouncedSearch, featuredFilter, selectedCategory, selectedStatus, sortBy, sortOrder]);

useEffect(() => {
  fetchCategories();
}, [fetchCategories]);

useEffect(() => {
  fetchGalleryItems();
}, [fetchGalleryItems]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Gallery item deleted successfully');
      fetchGalleryItems();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Failed to delete gallery item');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      await api.put(`/gallery/${id}`, {
        featured: !currentFeatured
      });
      toast.success(`Gallery item ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
      fetchGalleryItems();
    } catch (error) {
      console.error('Error updating gallery item:', error);
      toast.error('Failed to update gallery item');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to perform bulk action');
      return;
    }

    try {
      if (action === 'delete') {
        await Promise.all(selectedItems.map(id => api.delete(`/gallery/${id}`)));
        toast.success(`${selectedItems.length} gallery items deleted successfully`);
      } else if (action === 'feature') {
        await Promise.all(selectedItems.map(id => api.put(`/gallery/${id}`, { featured: true })));
        toast.success(`${selectedItems.length} gallery items featured successfully`);
      } else if (action === 'unfeature') {
        await Promise.all(selectedItems.map(id => api.put(`/gallery/${id}`, { featured: false })));
        toast.success(`${selectedItems.length} gallery items unfeatured successfully`);
      }
      
      setSelectedItems([]);
      fetchGalleryItems();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const openImageModal = (item) => {
    setSelectedImage(item);
    setShowImageModal(true);
  };

  const openDescModal = (item) => {
    setDescItem(item);
    setDescValue(item.description || '');
    setShowDescModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setFeaturedFilter('');
    setSortBy('display_order');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : '🎉';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery Management"
        subtitle="Manage your event gallery images and showcase your work"
        actions={
          <Link
            to="/gallery/new"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Gallery Item</span>
          </Link>
        }
      />

      {/* Filters and Search */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gallery items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center space-x-2"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {totalItems} total items
              </span>
              {selectedItems.length > 0 && (
                <Badge variant="info">
                  {selectedItems.length} selected
                </Badge>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured
                  </label>
                  <select
                    value={featuredFilter}
                    onChange={(e) => setFeaturedFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">All Items</option>
                    <option value="true">Featured Only</option>
                    <option value="false">Not Featured</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="display_order-asc">Display Order (A-Z)</option>
                    <option value="display_order-desc">Display Order (Z-A)</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="btn-outline text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="btn-outline text-sm flex items-center space-x-1"
                >
                  <StarIcon className="h-4 w-4" />
                  <span>Feature</span>
                </button>
                <button
                  onClick={() => handleBulkAction('unfeature')}
                  className="btn-outline text-sm flex items-center space-x-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Unfeature</span>
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn-danger text-sm flex items-center space-x-1"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : galleryItems.length === 0 ? (
        <EmptyState
          icon={PhotoIcon}
          title="No Gallery Items Found"
          description="Get started by adding your first gallery item to showcase your events."
          action={
            <Link to="/gallery/new" className="btn-primary">
              Add Gallery Item
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={item.image_url}
                      alt={item.alt_text || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbGxlcnkgSW1hZ2U8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openImageModal(item)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        title="View Image"
                      >
                        <EyeIcon className="h-5 w-5 text-gray-700" />
                      </button>
                      <Link
                        to={`/gallery/${item.id}/edit`}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        title="Edit Item"
                      >
                        <PencilIcon className="h-5 w-5 text-gray-700" />
                      </Link>
                      <button
                        onClick={() => openDescModal(item)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                        title={item.description ? 'Edit Description' : 'Add Description'}
                      >
                        <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5h2m-1-1v2m-6 4h10M6 15h8M5 7h.01M19 7h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                  </div>

                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-2 right-2">
                      <div className="p-1 bg-yellow-400 rounded-full">
                        <StarSolidIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate flex-1">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => handleToggleFeatured(item.id, item.featured)}
                      className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                      title={item.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {item.featured ? (
                        <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(item.category)}</span>
                    <span className="text-sm text-gray-600 capitalize">
                      {item.category}
                    </span>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Order: {item.display_order}</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalItems)} of {totalItems} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 text-sm border rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.alt_text || selectedImage.title}
                className="max-w-full max-h-96 object-contain mx-auto"
              />
              {selectedImage.description && (
                <p className="mt-4 text-gray-600">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (confirmContext.type === 'delete') {
            handleDelete(confirmContext.id);
          }
          setConfirmOpen(false);
        }}
        title="Confirm Action"
        message={`Are you sure you want to delete this gallery item? This action cannot be undone.`}
      />

      {/* Description Modal */}
      {showDescModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {descItem?.description ? 'Edit Description' : 'Add Description'}
              </h3>
              <button
                onClick={() => setShowDescModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">For: {descItem?.title}</label>
                <textarea
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Write a compelling description to showcase this event..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDescModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await api.put(`/gallery/${descItem.id}`, { description: descValue });
                      toast.success('Description saved');
                      setShowDescModal(false);
                      fetchGalleryItems();
                    } catch (err) {
                      toast.error('Failed to save description');
                    }
                  }}
                  className="btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
