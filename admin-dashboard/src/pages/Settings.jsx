import React, { useState, useEffect } from 'react';
import { 
  CogIcon, CreditCardIcon, EnvelopeIcon, TruckIcon,
  ShieldCheckIcon, PhotoIcon, CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import settingsService from '../services/settings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: 'My Ecommerce Store',
      storeEmail: 'admin@myecommercestore.com',
      storePhone: '+1 (555) 123-4567',
      storeAddress: '123 Commerce St, Business City, BC 12345',
      timezone: 'America/New_York',
      currency: 'USD',
      language: 'en'
    },
    payment: {
      stripeEnabled: true,
      stripePublishableKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalEnabled: false,
      paypalClientId: '',
      paypalSecret: '',
      cashOnDelivery: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@myecommercestore.com',
      smtpPassword: '',
      fromEmail: 'noreply@myecommercestore.com',
      fromName: 'My Ecommerce Store'
    },
    shipping: {
      freeShippingThreshold: 50,
      flatRate: 5.99,
      weightBased: false,
      zones: [
        { name: 'Domestic', countries: ['US'], rate: 5.99 },
        { name: 'International', countries: ['CA', 'MX'], rate: 15.99 }
      ]
    },
    tax: {
      enabled: true,
      rate: 8.5,
      includeInPrice: true,
      exemptCategories: []
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      maxLoginAttempts: 5,
      sessionTimeout: 24,
      twoFactorAuth: false
    },
    media: {
      maxFileSize: 5,
      allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      imageQuality: 85,
      thumbnailSize: 300,
      watermark: false
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAllSettings();
      
      if (response.success) {
        // Transform the API response to match component structure
        const transformedSettings = transformSettingsFromAPI(response.data);
        setSettings(transformedSettings);
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Load settings error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const transformSettingsFromAPI = (apiData) => {
    // API returns data in format: { category: { key: value } }
    // Component expects: { category: { camelCaseKey: value } }
    const transformed = {
      general: {},
      payment: {},
      email: {},
      shipping: {},
      tax: {},
      security: {},
      media: {}
    };

    // Map API keys to component keys
    const keyMapping = {
      // General settings
      'store_name': 'storeName',
      'store_email': 'storeEmail',
      'store_phone': 'storePhone',
      'store_address': 'storeAddress',
      'timezone': 'timezone',
      'currency': 'currency',
      'language': 'language',
      
      // Payment settings
      'stripe_enabled': 'stripeEnabled',
      'stripe_publishable_key': 'stripePublishableKey',
      'stripe_secret_key': 'stripeSecretKey',
      'paypal_enabled': 'paypalEnabled',
      'paypal_client_id': 'paypalClientId',
      'paypal_secret': 'paypalSecret',
      'cash_on_delivery': 'cashOnDelivery',
      
      // Email settings
      'smtp_host': 'smtpHost',
      'smtp_port': 'smtpPort',
      'smtp_user': 'smtpUser',
      'smtp_password': 'smtpPassword',
      'from_email': 'fromEmail',
      'from_name': 'fromName',
      
      // Shipping settings
      'free_shipping_threshold': 'freeShippingThreshold',
      'flat_rate': 'flatRate',
      'weight_based': 'weightBased',
      'shipping_zones': 'zones',
      
      // Tax settings
      'tax_enabled': 'enabled',
      'tax_rate': 'rate',
      'include_in_price': 'includeInPrice',
      'exempt_categories': 'exemptCategories',
      
      // Security settings
      'require_email_verification': 'requireEmailVerification',
      'require_phone_verification': 'requirePhoneVerification',
      'max_login_attempts': 'maxLoginAttempts',
      'session_timeout': 'sessionTimeout',
      'two_factor_auth': 'twoFactorAuth',
      
      // Media settings
      'max_file_size': 'maxFileSize',
      'allowed_types': 'allowedTypes',
      'image_quality': 'imageQuality',
      'thumbnail_size': 'thumbnailSize',
      'watermark': 'watermark'
    };

    // Transform each category
    Object.keys(apiData).forEach(category => {
      if (transformed[category]) {
        Object.keys(apiData[category]).forEach(key => {
          const componentKey = keyMapping[key] || key;
          transformed[category][componentKey] = apiData[category][key];
        });
      }
    });

    return transformed;
  };

  const transformSettingsToAPI = (componentData) => {
    // Transform component data back to API format
    const transformed = {};
    
    // Reverse mapping
    const reverseKeyMapping = {
      'storeName': 'store_name',
      'storeEmail': 'store_email',
      'storePhone': 'store_phone',
      'storeAddress': 'store_address',
      'stripeEnabled': 'stripe_enabled',
      'stripePublishableKey': 'stripe_publishable_key',
      'stripeSecretKey': 'stripe_secret_key',
      'paypalEnabled': 'paypal_enabled',
      'paypalClientId': 'paypal_client_id',
      'paypalSecret': 'paypal_secret',
      'cashOnDelivery': 'cash_on_delivery',
      'smtpHost': 'smtp_host',
      'smtpPort': 'smtp_port',
      'smtpUser': 'smtp_user',
      'smtpPassword': 'smtp_password',
      'fromEmail': 'from_email',
      'fromName': 'from_name',
      'freeShippingThreshold': 'free_shipping_threshold',
      'flatRate': 'flat_rate',
      'weightBased': 'weight_based',
      'zones': 'shipping_zones',
      'enabled': 'tax_enabled',
      'rate': 'tax_rate',
      'includeInPrice': 'include_in_price',
      'exemptCategories': 'exempt_categories',
      'requireEmailVerification': 'require_email_verification',
      'requirePhoneVerification': 'require_phone_verification',
      'maxLoginAttempts': 'max_login_attempts',
      'sessionTimeout': 'session_timeout',
      'twoFactorAuth': 'two_factor_auth',
      'maxFileSize': 'max_file_size',
      'allowedTypes': 'allowed_types',
      'imageQuality': 'image_quality',
      'thumbnailSize': 'thumbnail_size'
    };

    Object.keys(componentData).forEach(category => {
      transformed[category] = {};
      Object.keys(componentData[category]).forEach(key => {
        const apiKey = reverseKeyMapping[key] || key;
        transformed[category][apiKey] = componentData[category][key];
      });
    });

    return transformed;
  };

  const saveSettings = async (section) => {
    try {
      setLoading(true);
      const sectionData = transformSettingsToAPI({ [section]: settings[section] });
      const response = await settingsService.updateSettingsByCategory(section, sectionData[section]);
      
      if (response.success) {
        toast.success(`${section} settings saved successfully`);
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'payment', name: 'Payment', icon: CreditCardIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon },
    { id: 'tax', name: 'Tax', icon: CurrencyDollarIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'media', name: 'Media', icon: PhotoIcon }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
          <input
            type="text"
            value={settings.general.storeName}
            onChange={(e) => updateSetting('general', 'storeName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
          <input
            type="email"
            value={settings.general.storeEmail}
            onChange={(e) => updateSetting('general', 'storeEmail', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Phone</label>
          <input
            type="tel"
            value={settings.general.storePhone}
            onChange={(e) => updateSetting('general', 'storePhone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => updateSetting('general', 'currency', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.general.language}
            onChange={(e) => updateSetting('general', 'language', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
        <textarea
          value={settings.general.storeAddress}
          onChange={(e) => updateSetting('general', 'storeAddress', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Stripe</h3>
            <p className="text-sm text-gray-600">Accept credit card payments</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.stripeEnabled}
              onChange={(e) => updateSetting('payment', 'stripeEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {settings.payment.stripeEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
              <input
                type="text"
                value={settings.payment.stripePublishableKey}
                onChange={(e) => updateSetting('payment', 'stripePublishableKey', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
              <input
                type="password"
                value={settings.payment.stripeSecretKey}
                onChange={(e) => updateSetting('payment', 'stripeSecretKey', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">PayPal</h3>
            <p className="text-sm text-gray-600">Accept PayPal payments</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.paypalEnabled}
              onChange={(e) => updateSetting('payment', 'paypalEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {settings.payment.paypalEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
              <input
                type="text"
                value={settings.payment.paypalClientId}
                onChange={(e) => updateSetting('payment', 'paypalClientId', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret</label>
              <input
                type="password"
                value={settings.payment.paypalSecret}
                onChange={(e) => updateSetting('payment', 'paypalSecret', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Cash on Delivery</h3>
            <p className="text-sm text-gray-600">Accept cash payments upon delivery</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.cashOnDelivery}
              onChange={(e) => updateSetting('payment', 'cashOnDelivery', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
          <input
            type="text"
            value={settings.email.smtpUser}
            onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
          <input
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
          <input
            type="number"
            value={settings.shipping.freeShippingThreshold}
            onChange={(e) => updateSetting('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Flat Rate</label>
          <input
            type="number"
            step="0.01"
            value={settings.shipping.flatRate}
            onChange={(e) => updateSetting('shipping', 'flatRate', parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.shipping.weightBased}
            onChange={(e) => updateSetting('shipping', 'weightBased', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Enable weight-based shipping</label>
        </div>
      </div>
    </div>
  );

  const renderTaxSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Tax Calculation</h3>
          <p className="text-sm text-gray-600">Enable automatic tax calculation</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.tax.enabled}
            onChange={(e) => updateSetting('tax', 'enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      {settings.tax.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.tax.rate}
              onChange={(e) => updateSetting('tax', 'rate', parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.tax.includeInPrice}
              onChange={(e) => updateSetting('tax', 'includeInPrice', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Include tax in product prices</label>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Email Verification</h3>
            <p className="text-sm text-gray-600">Require email verification for new accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.requireEmailVerification}
              onChange={(e) => updateSetting('security', 'requireEmailVerification', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Phone Verification</h3>
            <p className="text-sm text-gray-600">Require phone verification for new accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.requirePhoneVerification}
              onChange={(e) => updateSetting('security', 'requirePhoneVerification', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderMediaSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
          <input
            type="number"
            value={settings.media.maxFileSize}
            onChange={(e) => updateSetting('media', 'maxFileSize', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image Quality (%)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={settings.media.imageQuality}
            onChange={(e) => updateSetting('media', 'imageQuality', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Size (px)</label>
          <input
            type="number"
            value={settings.media.thumbnailSize}
            onChange={(e) => updateSetting('media', 'thumbnailSize', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.media.watermark}
            onChange={(e) => updateSetting('media', 'watermark', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Add watermark to images</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
          <input
            type="text"
            value={settings.media.allowedTypes.join(', ')}
            onChange={(e) => updateSetting('media', 'allowedTypes', e.target.value.split(',').map(t => t.trim()))}
            placeholder="jpg, jpeg, png, gif, webp"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'email':
        return renderEmailSettings();
      case 'shipping':
        return renderShippingSettings();
      case 'tax':
        return renderTaxSettings();
      case 'security':
        return renderSecuritySettings();
      case 'media':
        return renderMediaSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your store settings and preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => saveSettings(activeTab)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 