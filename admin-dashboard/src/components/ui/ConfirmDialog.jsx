import React from 'react';

const ConfirmDialog = ({ open, title = 'Are you sure?', description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-sm mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="px-6 py-4">
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">{cancelText}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;


