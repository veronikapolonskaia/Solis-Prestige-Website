import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate, getStatusColor, getInitials } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch, selectedStatus, selectedDateRange, currentPage]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        status: selectedStatus,
        dateRange: selectedDateRange,
      };

      const response = await api.get('/users', { params });
      
      // Handle the API response structure according to documentation
      if (response.data?.success && response.data?.data) {
        const { users, pagination } = response.data.data;
        setCustomers(Array.isArray(users) ? users : []);
        setTotalPages(pagination?.totalPages || 1);
        setTotalItems(pagination?.totalItems || 0);
      } else {
        // Fallback for different response structure
        setCustomers(Array.isArray(response.data?.data) ? response.data.data : []);
        setTotalPages(response.data?.totalPages || 1);
        setTotalItems(response.data?.totalItems || 0);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
      // Set empty array on error to prevent map errors
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await api.delete(`/users/${customerId}`);
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) {
      toast.error('Please select customers to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedCustomers.length} customers?`)) {
      return;
    }

    try {
      try {
        await api.delete('/users/bulk', { data: { ids: selectedCustomers } });
      } catch (err) {
        // Fallback for environments where DELETE body is stripped or route captured by /:id
        await api.post('/users/bulk/delete', { ids: selectedCustomers });
      }
      toast.success('Customers deleted successfully');
      setSelectedCustomers([]);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customers:', error);
      toast.error('Failed to delete customers');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedDateRange('');
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

  const getCustomerAvatar = (customer) => {
    if (customer.avatar) {
      return (
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={customer.avatar}
          alt={`${customer.firstName} ${customer.lastName}`}
        />
      );
    }
    
    return (
      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
        <span className="text-sm font-medium text-primary-600">
          {getInitials(`${customer.firstName} ${customer.lastName}`)}
        </span>
      </div>
    );
  };

  const getCustomerStats = (customer) => {
    const totalOrders = customer.orders?.length || 0;
    const totalSpent = customer.orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const lastOrder = customer.orders?.length > 0 
      ? customer.orders[customer.orders.length - 1]?.createdAt 
      : null;

    return { totalOrders, totalSpent, lastOrder };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your customer database and view customer analytics
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  placeholder="Search customers..."
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
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
        </div>
      )}

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCustomers.length} customer(s) selected
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
        </div>
      )}

      {/* Results Summary */}
      {!loading && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {totalItems > 0 ? (
                <>
                  Found <span className="font-medium">{totalItems}</span> customers
                  {debouncedSearch && (
                    <> matching "<span className="font-medium">{debouncedSearch}</span>"</>
                  )}
                  {selectedStatus && (
                    <> with status <span className="font-medium">{selectedStatus}</span></>
                  )}
                </>
              ) : (
                'No customers found'
              )}
            </div>
            <div className="text-sm text-gray-500">
              {selectedDateRange && (
                <>Filtered by {selectedDateRange}</>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="ml-2 text-gray-500">Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : !Array.isArray(customers) || customers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const stats = getCustomerStats(customer);
                  
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getCustomerAvatar(customer)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {customer.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center mt-1">
                              <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ShoppingBagIcon className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {stats.totalOrders} orders
                          </span>
                        </div>
                        {stats.lastOrder && (
                          <div className="text-xs text-gray-500 mt-1">
                            Last: {formatDate(stats.lastOrder)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {formatCurrency(stats.totalSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(customer.isActive ? 'active' : 'inactive')}
                          {customer.emailVerified && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          )}
                          {customer.role && customer.role !== 'customer' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {customer.role}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(customer.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/customers/${customer.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                  Showing <span className="font-medium">{customers.length}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> customers{' '}
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
      </div>
    </div>
  );
};

export default Customers; 