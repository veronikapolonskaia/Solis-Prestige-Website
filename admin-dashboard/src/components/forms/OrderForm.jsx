import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  ShoppingBagIcon, UserIcon, TruckIcon, CreditCardIcon,
  PlusIcon, TrashIcon
} from '@heroicons/react/24/outline';
import FormField from '../forms/FormField';
import toast from 'react-hot-toast';

const OrderForm = ({ 
  order = null, 
  customers = [], 
  products = [], 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(order?.customerId || '');
  const [orderItems, setOrderItems] = useState(order?.items || []);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      orderNumber: order?.orderNumber || '',
      customerId: order?.customerId || '',
      status: order?.status || 'pending',
      paymentStatus: order?.paymentStatus || 'pending',
      paymentMethod: order?.paymentMethod || 'credit_card',
      shippingMethod: order?.shippingMethod || 'standard',
      notes: order?.notes || '',
      subtotal: order?.subtotal || 0,
      taxAmount: order?.taxAmount || 0,
      shippingAmount: order?.shippingAmount || 0,
      discountAmount: order?.discountAmount || 0,
      total: order?.total || 0
    }
  });

  const watchedSubtotal = watch('subtotal');
  const watchedTaxAmount = watch('taxAmount');
  const watchedShippingAmount = watch('shippingAmount');
  const watchedDiscountAmount = watch('discountAmount');

  // Calculate total when values change
  useEffect(() => {
    const total = watchedSubtotal + watchedTaxAmount + watchedShippingAmount - watchedDiscountAmount;
    setValue('total', Math.max(0, total));
  }, [watchedSubtotal, watchedTaxAmount, watchedShippingAmount, watchedDiscountAmount, setValue]);

  const handleAddItem = () => {
    if (!selectedProduct || itemQuantity <= 0) {
      toast.error('Please select a product and quantity');
      return;
    }

    const product = products.find(p => p.id.toString() === selectedProduct);
    if (!product) return;

    const existingItem = orderItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update existing item quantity
      const updatedItems = orderItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + itemQuantity }
          : item
      );
      setOrderItems(updatedItems);
    } else {
      // Add new item
      const newItem = {
        id: Date.now(), // Temporary ID
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: product.price,
        quantity: itemQuantity,
        total: product.price * itemQuantity
      };
      setOrderItems([...orderItems, newItem]);
    }

    // Reset form
    setSelectedProduct('');
    setItemQuantity(1);
  };

  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handleUpdateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    const updatedItems = orderItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    );
    setOrderItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (!selectedCustomer) {
        toast.error('Please select a customer');
        return;
      }

      if (orderItems.length === 0) {
        toast.error('Please add at least one item to the order');
        return;
      }

      const formData = {
        ...data,
        customerId: selectedCustomer,
        items: orderItems,
        subtotal: calculateSubtotal(),
        total: data.total
      };

      await onSubmit(formData);
      toast.success(order ? 'Order updated successfully' : 'Order created successfully');
    } catch (error) {
      toast.error('Failed to save order');
    }
  };

  const getStatusOptions = () => [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getPaymentStatusOptions = () => [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const getPaymentMethodOptions = () => [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash_on_delivery', label: 'Cash on Delivery' }
  ];

  const getShippingMethodOptions = () => [
    { value: 'standard', label: 'Standard Shipping' },
    { value: 'express', label: 'Express Shipping' },
    { value: 'overnight', label: 'Overnight Shipping' },
    { value: 'pickup', label: 'Store Pickup' }
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer *
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Order Number"
            name="orderNumber"
            type="text"
            register={register}
            error={errors.orderNumber}
            placeholder="Auto-generated if empty"
            helpText="Leave empty to auto-generate"
          />
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ShoppingBagIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Order Items List */}
        {orderItems.length > 0 && (
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
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${item.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orderItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items added to the order yet.
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <CreditCardIcon className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Order Status"
            name="status"
            type="select"
            register={register}
            error={errors.status}
            options={getStatusOptions()}
          />

          <FormField
            label="Payment Status"
            name="paymentStatus"
            type="select"
            register={register}
            error={errors.paymentStatus}
            options={getPaymentStatusOptions()}
          />

          <FormField
            label="Payment Method"
            name="paymentMethod"
            type="select"
            register={register}
            error={errors.paymentMethod}
            options={getPaymentMethodOptions()}
          />

          <FormField
            label="Shipping Method"
            name="shippingMethod"
            type="select"
            register={register}
            error={errors.shippingMethod}
            options={getShippingMethodOptions()}
          />
        </div>

        <div className="mt-6">
          <FormField
            label="Order Notes"
            name="notes"
            type="textarea"
            register={register}
            error={errors.notes}
            placeholder="Any special instructions or notes for this order"
            rows={3}
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <TruckIcon className="h-6 w-6 text-orange-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Subtotal:</span>
            <span className="text-sm font-medium text-gray-900">
              ${calculateSubtotal().toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tax Amount:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('taxAmount')}
              className="w-24 text-right border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Shipping Amount:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('shippingAmount')}
              className="w-24 text-right border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Discount Amount:</span>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('discountAmount')}
              className="w-24 text-right border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-medium text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                ${watch('total').toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (order ? 'Update Order' : 'Create Order')}
        </button>
      </div>
    </form>
  );
};

export default OrderForm; 