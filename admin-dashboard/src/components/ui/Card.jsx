import React from 'react';

const Card = ({ className = '', children, padding = 'p-6', title, subtitle, headerAction }) => {
  return (
    <div className={`glass shadow-luxe rounded-2xl border border-white/20 ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className={`border-b border-white/20 px-6 py-5 flex items-center justify-between`}>
          <div>
            {title && <h3 className="text-xl font-bold text-gray-900 luxe-heading">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1 luxe-text">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex items-center space-x-3">{headerAction}</div>}
        </div>
      )}
      <div className={padding}>{children}</div>
    </div>
  );
};

export default Card;


