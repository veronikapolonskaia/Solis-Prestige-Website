import React from 'react';

const EmptyState = ({ title = 'No data', description = 'There is nothing to display yet.', action }) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-xl">ⓘ</span>
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;


