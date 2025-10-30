import React, { useState, useEffect } from 'react';
import { 
  PuzzlePieceIcon, CheckCircleIcon, XCircleIcon,
  CogIcon, InformationCircleIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import api from '../services/api';

const Plugins = () => {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [showSettings, setShowSettings] = useState(false);


  useEffect(() => {
    loadPlugins();
  }, []);

  const loadPlugins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/plugins');
      setPlugins(response.data.data || []);
    } catch (error) {
      console.error('Error loading plugins:', error);
      toast.error('Failed to load plugins');
    } finally {
      setLoading(false);
    }
  };

  const togglePlugin = async (pluginName, enabled) => {
    try {
      setLoading(true);
      const action = enabled ? 'disable' : 'enable';
      await api.post(`/plugins/${pluginName}/${action}`);
      
      setPlugins(plugins.map(plugin => 
        plugin.name === pluginName 
          ? { ...plugin, enabled: !enabled }
          : plugin
      ));
      
      toast.success(`Plugin ${enabled ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      console.error('Error toggling plugin:', error);
      toast.error('Failed to update plugin status');
    } finally {
      setLoading(false);
    }
  };

  const updatePluginSettings = async (pluginName, settings) => {
    try {
      setLoading(true);
      // For now, we'll just update the local state
      // In a real implementation, you'd call an API endpoint
      // await api.put(`/plugins/${pluginName}/settings`, settings);
      
      setPlugins(plugins.map(plugin => 
        plugin.name === pluginName 
          ? { ...plugin, config: { ...plugin.config, ...settings } }
          : plugin
      ));
      
      toast.success('Plugin settings updated successfully');
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating plugin settings:', error);
      toast.error('Failed to update plugin settings');
    } finally {
      setLoading(false);
    }
  };

  const PluginCard = ({ plugin }) => (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <PuzzlePieceIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{plugin.name}</h3>
              <p className="text-sm text-gray-600">{plugin.description || 'No description available'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {plugin.core && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Core
              </span>
            )}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              plugin.enabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {plugin.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Version {plugin.version}</span>
            <span>by Ecommerce Module</span>
            <span>{plugin.core ? 'Core' : 'Optional'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedPlugin(plugin);
                setShowSettings(true);
              }}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CogIcon className="h-4 w-4 mr-1" />
              Settings
            </button>
            
            {!plugin.core && (
              <button
                onClick={() => togglePlugin(plugin.name, plugin.enabled)}
                disabled={loading}
                className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  plugin.enabled
                    ? 'border-red-300 text-red-700 bg-white hover:bg-red-50'
                    : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                }`}
              >
                {plugin.enabled ? (
                  <>
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    Disable
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Enable
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {plugin.dependencies && plugin.dependencies.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-sm text-yellow-800">
                Dependencies: {plugin.dependencies.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const PluginSettingsModal = () => {
    const [settings, setSettings] = useState(selectedPlugin?.config || {});

    useEffect(() => {
      if (selectedPlugin) {
        setSettings(selectedPlugin.config || {});
      }
    }, [selectedPlugin]);

    if (!selectedPlugin) return null;

    const handleSave = () => {
      if (selectedPlugin) {
        updatePluginSettings(selectedPlugin.name, settings);
      }
    };

    const renderSettingField = (key, value, type = 'text') => {
      switch (type) {
        case 'boolean':
          return (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
            </div>
          );
        case 'number':
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <input
                type="number"
                value={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
        default:
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <input
                type="text"
                value={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedPlugin.name} Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(settings).map(([key, value]) => 
                renderSettingField(key, value, typeof value === 'boolean' ? 'boolean' : 'text')
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plugin Management</h1>
        <p className="text-gray-600">Enable, disable, and configure plugins for your store</p>
      </div>

      {/* Plugin Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Core Plugins</h2>
          <p className="text-sm text-gray-600 mt-1">
            Core plugins are essential for the store functionality and cannot be disabled.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {plugins.filter(p => p.core).map(plugin => (
            <PluginCard key={plugin.name} plugin={plugin} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Optional Plugins</h2>
          <p className="text-sm text-gray-600 mt-1">
            Optional plugins add additional functionality to your store.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {plugins.filter(p => !p.core).map(plugin => (
            <PluginCard key={plugin.name} plugin={plugin} />
          ))}
        </div>
      </div>

      {/* Plugin Marketplace Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <InformationCircleIcon className="h-6 w-6 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900">Plugin Marketplace</h3>
            <p className="text-blue-700 mt-1">
              Discover and install additional plugins from our marketplace to extend your store's functionality.
              New plugins are regularly added to help you customize your ecommerce experience.
            </p>
            <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Browse Marketplace
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <PluginSettingsModal />}
    </div>
  );
};

export default Plugins; 