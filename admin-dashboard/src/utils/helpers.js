import { format, parseISO } from 'date-fns';

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Format date and time
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

// Get initials from name
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

// Get full name
export const getFullName = (firstName, lastName) => {
  return `${firstName || ''} ${lastName || ''}`.trim();
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Get order status color
export const getOrderStatusColor = (status) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  };
  
  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Get order status text
export const getOrderStatusText = (status) => {
  const statusTexts = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  
  return statusTexts[status.toLowerCase()] || status;
};

// Get user role text
export const getUserRoleText = (role) => {
  const roleTexts = {
    admin: 'Administrator',
    customer: 'Customer',
    manager: 'Manager',
  };
  
  return roleTexts[role.toLowerCase()] || role;
};

// Get user role color
export const getUserRoleColor = (role) => {
  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    customer: 'bg-blue-100 text-blue-800',
    manager: 'bg-green-100 text-green-800',
  };
  
  return roleColors[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Get status color for general status badges
export const getStatusColor = (status) => {
  const statusColors = {
    active: { bg: 'bg-green-100', text: 'text-green-800' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
    verified: { bg: 'bg-green-100', text: 'text-green-800' },
    unverified: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  };
  
  return statusColors[status.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

// Convert object to query string
export const objectToQueryString = (obj) => {
  const params = new URLSearchParams();
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      params.append(key, obj[key]);
    }
  });
  
  return params.toString();
};

// Parse query string to object
export const queryStringToObject = (queryString) => {
  const params = new URLSearchParams(queryString);
  const obj = {};
  
  for (const [key, value] of params) {
    obj[key] = value;
  }
  
  return obj;
};

// Generate pagination info
export const generatePaginationInfo = (currentPage, totalPages, totalItems, itemsPerPage) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    startItem,
    endItem,
    totalItems,
    currentPage,
    totalPages,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

// Generate pagination array
export const generatePaginationArray = (currentPage, totalPages, maxVisible = 5) => {
  const pages = [];
  const halfVisible = Math.floor(maxVisible / 2);
  
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);
  
  if (endPage - startPage + 1 < maxVisible) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisible - 1);
    } else {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
}; 