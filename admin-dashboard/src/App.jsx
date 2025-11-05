import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Categories from './pages/Categories.jsx';
import Orders from './pages/Orders.jsx';
import Customers from './pages/Customers.jsx';
import Analytics from './pages/Analytics.jsx';
import Settings from './pages/Settings.jsx';
import Plugins from './pages/Plugins.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ProductCreate from './pages/ProductCreate.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import CustomerDetail from './pages/CustomerDetail.jsx';
import Gallery from './pages/Gallery.jsx';
import GalleryForm from './pages/GalleryForm.jsx';
import CategoryCreate from './pages/CategoryCreate.jsx';
import CategoryDetail from './pages/CategoryDetail.jsx';
import Editorials from './pages/Editorials.jsx';
import EditorialCreate from './pages/EditorialCreate.jsx';
import Hotels from './pages/Hotels.jsx';
import HotelCreate from './pages/HotelCreate.jsx';
import HotelEdit from './pages/HotelEdit.jsx';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 luxe-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App content component
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductCreate />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <Categories />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryCreate />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <Orders />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Layout>
                  <Customers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/plugins"
            element={
              <ProtectedRoute>
                <Layout>
                  <Plugins />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrderDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Layout>
                  <Gallery />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <GalleryForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <GalleryForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editorials"
            element={
              <ProtectedRoute>
                <Layout>
                  <Editorials />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editorials/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditorialCreate />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                <Layout>
                  <Hotels />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <HotelCreate />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <HotelEdit />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Add more routes here as we build them */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
