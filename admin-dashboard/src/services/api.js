import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(process.env.REACT_APP_JWT_STORAGE_KEY || 'ecommerce_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, let the browser set the multipart boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear tokens but don't redirect automatically
      // Let the components handle the redirect using React Router
      localStorage.removeItem(process.env.REACT_APP_JWT_STORAGE_KEY || 'ecommerce_admin_token');
      localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_KEY || 'ecommerce_admin_refresh_token');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getRelated: (id) => api.get(`/products/related/${id}`),
};

export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getProducts: (id, params) => api.get(`/categories/${id}/products`, { params }),
};

export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  updateBulkStatus: (orderIds, status) => api.patch('/orders/bulk/status', { orderIds, status }),
  getTracking: (id) => api.get(`/orders/${id}/tracking`),
  getInvoiceHtml: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'text' }),
  downloadInvoicePdf: (id) => api.get(`/orders/${id}/invoice.pdf`, { responseType: 'blob' }),
  deleteBulk: (ids) => api.delete('/orders/bulk', { data: { orderIds: ids } }),
  deleteBulkFallback: (ids) => api.post('/orders/bulk/delete', { orderIds: ids }),
};

export const cartAPI = {
  getItems: () => api.get('/cart'),
  addItem: (data) => api.post('/cart', data),
  updateItem: (id, data) => api.put(`/cart/${id}`, data),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
  mergeCart: (data) => api.post('/cart/merge', data),
  getCount: () => api.get('/cart/count'),
};

export const addressesAPI = {
  getAll: () => api.get('/addresses'),
  getById: (id) => api.get(`/addresses/${id}`),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id, type) => api.put(`/addresses/${id}/default`, { type }),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadVideo: (file) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  docxToHtml: (file) => {
    const formData = new FormData();
    formData.append('doc', file);
    return api.post('/upload/docx-to-html', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadProductImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return api.post('/upload/product-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteFile: (filename) => api.delete(`/upload/${filename}`),
};

export const searchAPI = {
  searchProducts: (query, params) => api.get('/search/products', { params: { q: query, ...params } }),
  searchCategories: (query, params) => api.get('/search/categories', { params: { q: query, ...params } }),
};

export const pluginsAPI = {
  getAll: () => api.get('/plugins'),
  getById: (name) => api.get(`/plugins/${name}`),
  enable: (name) => api.post(`/plugins/${name}/enable`),
  disable: (name) => api.post(`/plugins/${name}/disable`),
  install: (name) => api.post(`/plugins/${name}/install`),
  uninstall: (name) => api.post(`/plugins/${name}/uninstall`),
  getStatus: (name) => api.get(`/plugins/${name}/status`),
};

export const analyticsAPI = {
  getSales: (params) => api.get('/analytics/sales', { params }),
  getProducts: (params) => api.get('/analytics/products', { params }),
  getCustomers: (params) => api.get('/analytics/customers', { params }),
  getDashboard: () => api.get('/analytics/dashboard'),
  export: (params) => api.get('/analytics/export', { params, responseType: 'blob' }),
};

// Editorials (Articles)
export const editorialsAPI = {
  list: (params) => api.get('/editorials', { params }),
  getBySlug: (slug) => api.get(`/editorials/${slug}`),
  create: (data) => api.post('/editorials', data), // requires admin token
  update: (id, data) => api.put(`/editorials/${id}`, data),
  delete: (id) => api.delete(`/editorials/${id}`),
};

export default api; 