import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, PencilIcon, PrinterIcon, EnvelopeIcon,
  TruckIcon, CreditCardIcon, UserIcon, MapPinIcon,
  CheckCircleIcon, ClockIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: PencilIcon },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: TruckIcon },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: ExclamationTriangleIcon }
  };

  const paymentStatusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
      if (response.data?.success) {
        const fetched = response.data.data;
        // Parse notes if JSON to surface inquiry details in UI
        let parsedNotes = null;
        if (typeof fetched.notes === 'string') {
          try { parsedNotes = JSON.parse(fetched.notes); } catch {}
        }
        setOrder({ ...fetched, _parsedNotes: parsedNotes });
      } else {
        toast.error('Failed to load order');
      }
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setLoading(true);
      await ordersAPI.updateStatus(id, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.downloadInvoicePdf(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order?.orderNumber || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice generated');
    } catch (error) {
      console.error('Download invoice error:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order?.currency || 'USD',
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
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
    { id: 'items', name: 'Items' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'payment', name: 'Payment' },
    { id: 'history', name: 'History' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <p className="text-gray-600 mt-2">The order you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status] || statusConfig.pending;
  const currentPaymentStatus = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.pending;
  const inquiry = order._parsedNotes && order._parsedNotes.type === 'inquiry' ? order._parsedNotes : null;
  const contact = inquiry?.contact || {};
  const shipping = order.shippingAddress || {};
  const billing = order.billingAddress || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadInvoice}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Generate Invoice
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
              <currentStatus.icon className="h-4 w-4 mr-2" />
              {currentStatus.label}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentPaymentStatus.color}`}>
              {currentPaymentStatus.label}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={loading}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customer</p>
              <p className="text-lg font-semibold text-gray-900">
                {order.user?.firstName} {order.user?.lastName}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TruckIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Items</p>
              <p className="text-2xl font-bold text-gray-900">{order.items?.length || 0}</p>
              <p className="text-sm text-gray-500">products</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Shipping</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {order.shippingMethod || 'Standard'}
              </p>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="text-sm text-gray-900">
                        {(order.user?.firstName || '') + ' ' + (order.user?.lastName || '') || contact.name || 'Not provided'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{order.user?.email || contact.email || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{order.user?.phone || contact.phone || 'Not provided'}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(order.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Tax</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(order.taxAmount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(order.shippingAmount)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Discount</dt>
                      <dd className="text-sm text-gray-900">-{formatCurrency(order.discountAmount)}</dd>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <dt className="text-sm font-bold text-gray-900">Total</dt>
                      <dd className="text-sm font-bold text-gray-900">{formatCurrency(order.total)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {(inquiry || order.notes) && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h3>
                  {inquiry ? (
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 space-y-2">
                      <div><span className="font-medium">Type:</span> Inquiry</div>
                      <div><span className="font-medium">Event Type:</span> {inquiry.eventType}</div>
                      {inquiry.eventDate && (<div><span className="font-medium">Event Date:</span> {inquiry.eventDate}</div>)}
                      {inquiry.eventStartTime && (<div><span className="font-medium">Start Time:</span> {inquiry.eventStartTime}</div>)}
                      {inquiry.eventLocationType && (<div><span className="font-medium">Location Type:</span> {inquiry.eventLocationType}</div>)}
                      {inquiry.eventFullAddress && (<div><span className="font-medium">Full Address:</span> {inquiry.eventFullAddress}</div>)}
                      {inquiry.preferredLanguage && (<div><span className="font-medium">Preferred Language:</span> {inquiry.preferredLanguage}</div>)}
                      {inquiry.eventEnvironment && (<div><span className="font-medium">Environment:</span> {inquiry.eventEnvironment}</div>)}
                      {inquiry.venueDetails && (<div><span className="font-medium">Venue Details:</span> {inquiry.venueDetails}</div>)}
                      {inquiry.guestAgeRange && (<div><span className="font-medium">Guest Age Range:</span> {inquiry.guestAgeRange}</div>)}
                      {inquiry.numberOfGuests && (<div><span className="font-medium">Number of Guests:</span> {inquiry.numberOfGuests}</div>)}
                      {inquiry.partyTheme && (<div><span className="font-medium">Party Theme:</span> {inquiry.partyTheme}</div>)}
                      {inquiry.workingWithPlanner && (<div><span className="font-medium">Working with Planner:</span> {inquiry.workingWithPlanner}</div>)}
                      {Array.isArray(inquiry.packageInterest) && inquiry.packageInterest.length > 0 && (
                        <div><span className="font-medium">Package Interest:</span> {inquiry.packageInterest.join(', ')}</div>
                      )}
                      {Array.isArray(inquiry.productIds) && inquiry.productIds.length > 0 && (
                        <div><span className="font-medium">Selected Products:</span> {inquiry.productIds.length} product(s)</div>
                      )}
                      {inquiry.notes && (<div><span className="font-medium">Additional Notes:</span> {inquiry.notes}</div>)}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'items' && (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">IMG</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                              <div className="text-sm text-gray-500">{item.variantName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{shipping.fullName || `${shipping.firstName || ''} ${shipping.lastName || ''}`}</p>
                    <p className="text-sm text-gray-900">{shipping.line1 || shipping.address1}</p>
                    {shipping.address2 && (<p className="text-sm text-gray-900">{shipping.address2}</p>)}
                    <p className="text-sm text-gray-900">{shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.postalCode || shipping.zipCode}</p>
                    <p className="text-sm text-gray-900">{shipping.country}</p>
                    <p className="text-sm text-gray-900">{shipping.phone || contact.phone}</p>
                    {shipping.email && (<p className="text-sm text-gray-900">{shipping.email}</p>)}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Method</dt>
                      <dd className="text-sm text-gray-900 capitalize">{order.shippingMethod || 'Standard'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Cost</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(order.shippingAmount)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
                      <dd className="text-sm text-gray-900">{order.trackingNumber || 'Not available'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Shipped At</dt>
                      <dd className="text-sm text-gray-900">{formatDate(order.shippedAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Delivered At</dt>
                      <dd className="text-sm text-gray-900">{formatDate(order.deliveredAt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Method</dt>
                      <dd className="text-sm text-gray-900 capitalize">{order.paymentMethod?.replace('_', ' ') || 'Not specified'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentPaymentStatus.color}`}>
                          {currentPaymentStatus.label}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Amount</dt>
                      <dd className="text-sm text-gray-900">{formatCurrency(order.total)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Currency</dt>
                      <dd className="text-sm text-gray-900">{order.currency}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{billing.fullName || `${billing.firstName || ''} ${billing.lastName || ''}`}</p>
                    <p className="text-sm text-gray-900">{billing.line1 || billing.address1}</p>
                    {billing.address2 && (<p className="text-sm text-gray-900">{billing.address2}</p>)}
                    <p className="text-sm text-gray-900">{billing.city}{billing.state ? `, ${billing.state}` : ''} {billing.postalCode || billing.zipCode}</p>
                    <p className="text-sm text-gray-900">{billing.country}</p>
                    <p className="text-sm text-gray-900">{billing.phone || contact.phone}</p>
                    {billing.email && (<p className="text-sm text-gray-900">{billing.email}</p>)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Order placed</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                
                {order.paymentStatus === 'paid' && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCardIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Payment received</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                )}

                {order.status === 'processing' && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <PencilIcon className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Order processing</p>
                      <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}

                {order.status === 'shipped' && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <TruckIcon className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Order shipped</p>
                      <p className="text-sm text-gray-500">{formatDate(order.shippedAt)}</p>
                    </div>
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Order delivered</p>
                      <p className="text-sm text-gray-500">{formatDate(order.deliveredAt)}</p>
                    </div>
                  </div>
                )}

                {order.status === 'cancelled' && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Order cancelled</p>
                      <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 