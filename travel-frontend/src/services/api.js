import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle specific error cases
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        success: false,
        error: 'Network error. Please check your connection.',
      });
    } else {
      // Something else happened
      return Promise.reject({
        success: false,
        error: error.message || 'An unexpected error occurred.',
      });
    }
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/password', passwords),
  logout: () => api.post('/auth/logout'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoriesAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (item) => api.post('/cart', item),
  update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
  getCount: () => api.get('/cart/count'),
};

export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getTracking: (id) => api.get(`/orders/${id}/tracking`),
};

export const checkoutAPI = {
  calculate: (checkoutData) => api.post('/checkout/calculate', checkoutData),
  createOrder: (orderData) => api.post('/checkout/create-order', orderData),
  guestOrder: (orderData) => api.post('/checkout/guest', orderData),
  getShippingOptions: () => api.get('/checkout/shipping-options'),
};

export default api;

