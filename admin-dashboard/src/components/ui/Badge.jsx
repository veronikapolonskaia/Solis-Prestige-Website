import React from 'react';

const COLOR_MAP = {
  gray: 'bg-gray-100 text-gray-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  purple: 'bg-purple-100 text-purple-800',
  pink: 'bg-pink-100 text-pink-800',
  peach: 'bg-gradient-to-r from-peach/20 to-gold/20 text-peach border border-peach/30',
  aqua: 'bg-gradient-to-r from-aqua/20 to-coral/20 text-aqua border border-aqua/30',
  rose: 'bg-gradient-to-r from-rose/20 to-pink/20 text-rose border border-rose/30',
};

const Badge = ({ color = 'gray', children, className = '' }) => {
  const colorClasses = COLOR_MAP[color] || COLOR_MAP.gray;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClasses} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;


