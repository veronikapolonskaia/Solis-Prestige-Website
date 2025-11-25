import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import { formatDate } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader, Card, EmptyState, ConfirmDialog, Badge } from '../components';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState({ type: null, id: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
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
      toast.error('Failed to fetch categories');
      // Set empty array on error to prevent map errors
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setConfirmContext({ type: 'single', id: categoryId });
    setConfirmOpen(true);
  };

  const confirmDeletion = async () => {
    try {
      if (confirmContext.type === 'single' && confirmContext.id) {
        await api.delete(`/categories/${confirmContext.id}`);
      } else if (confirmContext.type === 'bulk') {
        try {
          await api.delete('/categories/bulk', { data: { ids: selectedCategories, cascade: true, force: true } });
        } catch (err) {
          // Fallback: some environments strip DELETE bodies – retry with POST
          await api.post('/categories/bulk', { ids: selectedCategories, cascade: true, force: true });
        }
        setSelectedCategories([]);
      }
      toast.success('Category(ies) deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting categories:', error);
      toast.error('Failed to delete categories');
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      toast.error('Please select categories to delete');
      return;
    }
    setConfirmContext({ type: 'bulk' });
    setConfirmOpen(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCategories(categories.map(c => c.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId, checked) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusBadge = (status) => {
    const active = status === 'active' || status === true;
    return <Badge color={active ? 'green' : 'red'}>{active ? 'active' : 'inactive'}</Badge>;
  };

  const renderCategoryTree = (categoryList, level = 0) => {
    return categoryList
      .filter(category => 
        !searchTerm || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((category) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.id);
        const isSelected = selectedCategories.includes(category.id);

        return (
          <div key={category.id}>
            <div 
              className={`flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 ${
                level > 0 ? 'ml-' + (level * 4) : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleSelectCategory(category.id, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                
                {hasChildren && (
                  <button
                    onClick={() => toggleExpanded(category.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
                
                <FolderIcon className="h-5 w-5 text-gray-400" />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {category.name}
                    </h3>
                    {getStatusBadge(category.isActive ? 'active' : 'inactive')}
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{category.products?.length || 0} products</span>
                    <span>Created {formatDate(category.createdAt)}</span>
                    {category.sortOrder && (
                      <span>Sort: {category.sortOrder}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link
                  to={`/categories/${category.id}`}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
                <Link
                  to={`/categories/${category.id}/edit`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {hasChildren && isExpanded && (
              <div className="border-l border-gray-200 ml-4">
                {renderCategoryTree(category.children, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  const buildCategoryTree = (flatCategories) => {
    const categoryMap = {};
    const rootCategories = [];

    // Create a map of all categories
    flatCategories.forEach(category => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    // Build the tree structure
    flatCategories.forEach(category => {
      if (category.parentId && categoryMap[category.parentId]) {
        categoryMap[category.parentId].children.push(categoryMap[category.id]);
      } else {
        rootCategories.push(categoryMap[category.id]);
      }
    });

    return rootCategories;
  };

  const categoryTree = buildCategoryTree(categories);

  return (
      <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Manage your product categories"
        actions={(
          <>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Search
            </button>
            <Link
              to="/categories/new"
              className="btn-primary"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Category
            </Link>
          </>
        )}
      />

      {/* Search */}
      {showFilters && (
        <Card className="border border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCategories.length} category(ies) selected
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
      {!loading && searchTerm && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-md">
          <div className="text-sm text-gray-600">
            {categories.length > 0 ? (
              <>
                Found <span className="font-medium">{categories.length}</span> categories
                matching "<span className="font-medium">{searchTerm}</span>"
              </>
            ) : (
              'No categories found matching your search'
            )}
          </div>
        </div>
      )}

      {/* Categories List */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">All Categories</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.length === categories.length && categories.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-500">Select All</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-500">Loading categories...</span>
            </div>
          </div>
        ) : !Array.isArray(categories) || categories.length === 0 ? (
          <div className="p-8">
            <EmptyState title="No categories found" description="Try searching again or create a new category." action={(
              <Link to="/categories/new" className="btn-primary">Add Category</Link>
            )} />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {renderCategoryTree(categoryTree)}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title={confirmContext.type === 'bulk' ? 'Delete selected categories?' : 'Delete this category?'}
        description={confirmContext.type === 'bulk' ? `This will delete ${selectedCategories.length} categories. This action cannot be undone.` : 'This action cannot be undone.'}
        confirmText="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeletion}
      />
    </div>
  );
};

export default Categories; 