import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 luxe-heading heading-script">{title}</h1>
        {subtitle && <p className="mt-2 text-base text-gray-600 luxe-text">{subtitle}</p>}
      </div>
      {actions && <div className="mt-6 sm:mt-0 flex space-x-4">{actions}</div>}
    </div>
  );
};

export default PageHeader;


