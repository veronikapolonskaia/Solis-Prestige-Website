import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader, Card, Badge, EmptyState } from '../components';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [prioritizeNew, setPrioritizeNew] = useState(true);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchOrders();
  }, [debouncedSearch, selectedStatus, selectedPaymentStatus, selectedDateRange, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        status: selectedStatus,
        paymentStatus: selectedPaymentStatus,
        dateRange: selectedDateRange,
      };

      const response = await ordersAPI.getAll(params);
      
      // Handle the API response structure according to documentation
      if (response.data?.success && response.data?.data) {
        const { orders, pagination } = response.data.data;
        setOrders(Array.isArray(orders) ? orders : []);
        setTotalPages(pagination?.totalPages || 1);
        setTotalItems(pagination?.totalItems || 0);
      } else {
        // Fallback for different response structure
        setOrders(Array.isArray(response.data?.data) ? response.data.data : []);
        setTotalPages(response.data?.totalPages || 1);
        setTotalItems(response.data?.totalItems || 0);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      // Set empty array on error to prevent map errors
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to update');
      return;
    }

    try {
      await ordersAPI.updateBulkStatus(selectedOrders, newStatus);
      toast.success('Orders status updated successfully');
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error('Error updating orders status:', error);
      toast.error('Failed to update orders status');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedPaymentStatus('');
    setSelectedDateRange('');
    setCurrentPage(1);
  };

  const quickPreset = (preset) => {
    if (preset === 'today') {
      setSelectedDateRange('today');
      setSelectedStatus('');
    } else if (preset === 'week') {
      setSelectedDateRange('week');
      setSelectedStatus('');
    } else if (preset === 'overdue') {
      setSelectedStatus('pending');
      setSelectedDateRange('week');
    }
    setCurrentPage(1);
  };

  const markCompleted = async (orderId) => {
    try {
      await ordersAPI.updateStatus(orderId, 'delivered');
      toast.success('Order marked as completed');
      fetchOrders();
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    }
  };

  const bulkComplete = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to complete');
      return;
    }
    try {
      await ordersAPI.updateBulkStatus(selectedOrders, 'delivered');
      toast.success('Selected orders marked as completed');
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      console.error('Error bulk completing orders:', error);
      toast.error('Failed to complete selected orders');
    }
  };

  const getAgeText = (dateStr) => {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  };

  const isNewOrder = (order) => {
    const hours = (Date.now() - new Date(order.createdAt).getTime()) / 36e5;
    return (order.status === 'pending' || order.status === 'processing') && hours <= 48;
  };

  const getStatusBadge = (status) => {
    const colors = getStatusColor(status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {status}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'processing':
        return <TruckIcon className="h-4 w-4" />;
      case 'shipped':
        return <TruckIcon className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const colors = paymentStatus === 'paid' 
      ? { bg: 'bg-green-100', text: 'text-green-800' }
      : { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
        {paymentStatus}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage customer orders and track shipments"
        actions={(
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
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
                  placeholder="Search orders..."
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
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment
              </label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <button
                onClick={() => setPrioritizeNew(!prioritizeNew)}
                className={`w-full px-3 py-2 rounded-md text-sm font-medium border ${prioritizeNew ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                {prioritizeNew ? 'Prioritizing New Orders' : 'Normal Priority'}
              </button>
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
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 mr-2">Quick presets:</span>
            <button onClick={() => quickPreset('today')} className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50">Today</button>
            <button onClick={() => quickPreset('week')} className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50">This Week</button>
            <button onClick={() => quickPreset('overdue')} className="px-2 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50">Overdue Pending</button>
          </div>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="flex space-x-2">
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <option value="">Update Status</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={bulkComplete} className="px-3 py-1.5 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50">Mark Completed</button>
              <button
                onClick={async () => {
                  try {
                    await ordersAPI.deleteBulk(selectedOrders);
                  } catch (e) {
                    await ordersAPI.deleteBulkFallback(selectedOrders);
                  }
                  toast.success('Selected orders deleted');
                  setSelectedOrders([]);
                  fetchOrders();
                }}
                className="px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
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
                  Found <span className="font-medium">{totalItems}</span> orders
                  {debouncedSearch && (
                    <> matching "<span className="font-medium">{debouncedSearch}</span>"</>
                  )}
                  {selectedStatus && (
                    <> with status <span className="font-medium">{selectedStatus}</span></>
                  )}
                </>
              ) : (
                'No orders found'
              )}
            </div>
            <div className="text-sm text-gray-500">
              {selectedDateRange && (<>Filtered by {selectedDateRange}</>)}
              {prioritizeNew && <span className="ml-3 text-primary-600">Prioritizing new orders</span>}
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
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
                      <span className="ml-2 text-gray-500">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : !Array.isArray(orders) || orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8">
                    <EmptyState title="No orders found" description="Try adjusting your filters to find orders." />
                  </td>
                </tr>
              ) : (
                [...orders]
                  .sort((a, b) => {
                    if (!prioritizeNew) return 0;
                    const aNew = isNewOrder(a) ? 1 : 0;
                    const bNew = isNewOrder(b) ? 1 : 0;
                    if (bNew !== aNew) return bNew - aNew;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                  })
                  .map((order, idx) => (
                  <tr key={order.id} className={`${isNewOrder(order) ? 'bg-yellow-50' : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50')} hover:bg-gray-50`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-900">
                            #{order.orderNumber}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length || 0} items
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{formatCurrency(order.total)}</div>
                        {order.discountAmount > 0 && (
                          <div className="text-xs text-green-600">
                            -{formatCurrency(order.discountAmount)} discount
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <Badge color={order.status === 'delivered' ? 'green' : order.status === 'cancelled' ? 'red' : order.status === 'shipped' ? 'blue' : 'yellow'}>
                          {order.status}
                        </Badge>
                      </div>
                      {(order.status === 'shipped' || order.status === 'delivered') && order.trackingNumber && (
                        <div className="text-xs text-gray-500 mt-1">
                          Track: {order.trackingNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getAgeText(order.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {(order.status !== 'delivered' && order.status !== 'cancelled') && (
                          <button onClick={() => markCompleted(order.id)} className="px-2 py-1 text-xs border border-green-300 rounded-md text-green-700 hover:bg-green-50">Complete</button>
                        )}
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
                  Showing <span className="font-medium">{orders.length}</span> of{' '}
                  <span className="font-medium">{totalItems}</span> orders{' '}
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
    </div>
  );
};

export default Orders; 