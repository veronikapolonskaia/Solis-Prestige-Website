import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon,
  ShieldCheckIcon, BellIcon
} from '@heroicons/react/24/outline';
import FormField from '../forms/FormField';
import toast from 'react-hot-toast';

const CustomerForm = ({ 
  customer = null, 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [addresses, setAddresses] = useState(customer?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      dateOfBirth: customer?.dateOfBirth || '',
      gender: customer?.gender || '',
      isActive: customer?.isActive ?? true,
      emailVerified: customer?.emailVerified ?? false,
      phoneVerified: customer?.phoneVerified ?? false,
      newsletter: customer?.preferences?.newsletter ?? true,
      marketing: customer?.preferences?.marketing ?? false,
      notifications: customer?.preferences?.notifications ?? true,
      language: customer?.preferences?.language || 'en',
      currency: customer?.preferences?.currency || 'USD'
    }
  });

  const handleFormSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        addresses: addresses
      };

      await onSubmit(formData);
      toast.success(customer ? 'Customer updated successfully' : 'Customer created successfully');
    } catch (error) {
      toast.error('Failed to save customer');
    }
  };

  const handleAddAddress = (addressData) => {
    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
      );
      setAddresses(updatedAddresses);
    } else {
      // Add new address
      const newAddress = {
        id: Date.now(),
        ...addressData
      };
      setAddresses([...addresses, newAddress]);
    }
    
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  const getGenderOptions = () => [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

  const getLanguageOptions = () => [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' }
  ];

  const getCurrencyOptions = () => [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' }
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            name="firstName"
            type="text"
            register={register}
            error={errors.firstName}
            required
            placeholder="Enter first name"
          />

          <FormField
            label="Last Name"
            name="lastName"
            type="text"
            register={register}
            error={errors.lastName}
            required
            placeholder="Enter last name"
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            required
            placeholder="Enter email address"
          />

          <FormField
            label="Phone"
            name="phone"
            type="tel"
            register={register}
            error={errors.phone}
            placeholder="Enter phone number"
          />

          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            register={register}
            error={errors.dateOfBirth}
          />

          <FormField
            label="Gender"
            name="gender"
            type="select"
            register={register}
            error={errors.gender}
            options={getGenderOptions()}
          />
        </div>

        <div className="mt-6">
          <FormField
            label="Active Status"
            name="isActive"
            type="checkbox"
            register={register}
            error={errors.isActive}
            helpText="Inactive customers won't be able to place orders"
          />
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPinIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Addresses</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddressForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add Address
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 capitalize">
                    {address.type} Address
                  </h4>
                  <div className="flex items-center space-x-2">
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditAddress(address)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>{address.firstName} {address.lastName}</p>
                  {address.company && <p>{address.company}</p>}
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p>{address.country}</p>
                  <p>{address.phone}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No addresses added yet.
          </div>
        )}

        {/* Address Form Modal */}
        {showAddressForm && (
          <AddressForm
            address={editingAddress}
            onSubmit={handleAddAddress}
            onCancel={() => {
              setShowAddressForm(false);
              setEditingAddress(null);
            }}
          />
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Email Verified"
                name="emailVerified"
                type="checkbox"
                register={register}
                error={errors.emailVerified}
                helpText="Mark if email has been verified"
              />

              <FormField
                label="Phone Verified"
                name="phoneVerified"
                type="checkbox"
                register={register}
                error={errors.phoneVerified}
                helpText="Mark if phone has been verified"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Language"
                name="language"
                type="select"
                register={register}
                error={errors.language}
                options={getLanguageOptions()}
              />

              <FormField
                label="Currency"
                name="currency"
                type="select"
                register={register}
                error={errors.currency}
                options={getCurrencyOptions()}
              />
            </div>
          </div>
        )}
      </div>

      {/* Communication Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <BellIcon className="h-6 w-6 text-orange-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Communication Preferences</h3>
        </div>

        <div className="space-y-4">
          <FormField
            label="Newsletter Subscription"
            name="newsletter"
            type="checkbox"
            register={register}
            error={errors.newsletter}
            helpText="Receive updates about new products and promotions"
          />

          <FormField
            label="Marketing Communications"
            name="marketing"
            type="checkbox"
            register={register}
            error={errors.marketing}
            helpText="Receive marketing emails and promotional offers"
          />

          <FormField
            label="Push Notifications"
            name="notifications"
            type="checkbox"
            register={register}
            error={errors.notifications}
            helpText="Receive order updates and important notifications"
          />
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
          {loading ? 'Saving...' : (customer ? 'Update Customer' : 'Create Customer')}
        </button>
      </div>
    </form>
  );
};

// Address Form Component
const AddressForm = ({ address = null, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      type: address?.type || 'shipping',
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      company: address?.company || '',
      address1: address?.address1 || '',
      address2: address?.address2 || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      country: address?.country || 'US',
      phone: address?.phone || '',
      isDefault: address?.isDefault || false
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {address ? 'Edit Address' : 'Add Address'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Type"
                name="type"
                type="select"
                register={register}
                error={errors.type}
                options={[
                  { value: 'shipping', label: 'Shipping' },
                  { value: 'billing', label: 'Billing' }
                ]}
              />

              <FormField
                label="Default"
                name="isDefault"
                type="checkbox"
                register={register}
                error={errors.isDefault}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                type="text"
                register={register}
                error={errors.firstName}
                required
              />

              <FormField
                label="Last Name"
                name="lastName"
                type="text"
                register={register}
                error={errors.lastName}
                required
              />
            </div>

            <FormField
              label="Company"
              name="company"
              type="text"
              register={register}
              error={errors.company}
            />

            <FormField
              label="Address Line 1"
              name="address1"
              type="text"
              register={register}
              error={errors.address1}
              required
            />

            <FormField
              label="Address Line 2"
              name="address2"
              type="text"
              register={register}
              error={errors.address2}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="City"
                name="city"
                type="text"
                register={register}
                error={errors.city}
                required
              />

              <FormField
                label="State"
                name="state"
                type="text"
                register={register}
                error={errors.state}
                required
              />

              <FormField
                label="ZIP Code"
                name="zipCode"
                type="text"
                register={register}
                error={errors.zipCode}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Country"
                name="country"
                type="select"
                register={register}
                error={errors.country}
                options={[
                  { value: 'US', label: 'United States' },
                  { value: 'CA', label: 'Canada' },
                  { value: 'GB', label: 'United Kingdom' },
                  { value: 'AU', label: 'Australia' }
                ]}
                required
              />

              <FormField
                label="Phone"
                name="phone"
                type="tel"
                register={register}
                error={errors.phone}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                {address ? 'Update' : 'Add'} Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm; 