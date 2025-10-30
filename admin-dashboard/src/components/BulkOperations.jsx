import React, { useState } from 'react';
import { 
  ArrowDownTrayIcon, ArrowUpTrayIcon, DocumentArrowDownIcon,
  DocumentArrowUpIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const BulkOperations = ({ type, onImport, onExport, onBulkDelete, selectedItems = [] }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid CSV or Excel file');
        return;
      }
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      setImporting(true);
      // In a real app, this would upload the file and process it
      // const formData = new FormData();
      // formData.append('file', importFile);
      // await onImport(formData);
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${type} imported successfully`);
      setShowImportModal(false);
      setImportFile(null);
    } catch (error) {
      toast.error('Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      // In a real app, this would call the export API
      // await onExport();
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${type} exported successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to delete');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedItems.length} selected ${type}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      // In a real app, this would call the bulk delete API
      // await onBulkDelete(selectedItems);
      
      toast.success(`${selectedItems.length} ${type} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete selected items');
    }
  };

  const getExportOptions = () => {
    const options = {
      products: [
        { label: 'All Products', value: 'all' },
        { label: 'Active Products', value: 'active' },
        { label: 'Inactive Products', value: 'inactive' },
        { label: 'Low Stock Products', value: 'low_stock' }
      ],
      orders: [
        { label: 'All Orders', value: 'all' },
        { label: 'Pending Orders', value: 'pending' },
        { label: 'Completed Orders', value: 'completed' },
        { label: 'Cancelled Orders', value: 'cancelled' }
      ],
      customers: [
        { label: 'All Customers', value: 'all' },
        { label: 'Active Customers', value: 'active' },
        { label: 'Inactive Customers', value: 'inactive' },
        { label: 'VIP Customers', value: 'vip' }
      ]
    };
    return options[type] || [];
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        {selectedItems.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Delete Selected ({selectedItems.length})
          </button>
        )}
        
        <div className="relative">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
            Import
          </button>
        </div>

        <div className="relative group">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export'}
          </button>
          
          {/* Export dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <div className="py-1">
              {getExportOptions().map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleExport(option.value)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Import {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Import Guidelines</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• First row should contain column headers</li>
                    <li>• Required fields must be included</li>
                    <li>• Date formats: YYYY-MM-DD</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importFile || importing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {importing ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkOperations; 