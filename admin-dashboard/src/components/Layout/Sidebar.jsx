import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  PuzzlePieceIcon,
  PhotoIcon,
  XMarkIcon,
  NewspaperIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getFullName } from '../../utils/helpers';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Categories', href: '/categories', icon: CubeIcon },
  { name: 'Gallery', href: '/gallery', icon: PhotoIcon },
  { name: 'Editorials', href: '/editorials', icon: NewspaperIcon },
  { name: 'Hotels', href: '/hotels', icon: BuildingOfficeIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
  { name: 'Plugins', href: '/plugins', icon: PuzzlePieceIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 glass shadow-luxe-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-peach-gold flex items-center justify-center shadow-luxe">
                <span className="text-white font-bold text-lg">DS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 luxe-heading">
                  Deluxe Soiree
                </h1>
                <p className="text-xs text-gray-500 luxe-alt">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-white/50 transition-all duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-rose-pink text-white shadow-luxe'
                      : 'text-gray-600 hover:bg-white/50 hover:text-rose-600 hover:shadow-md'
                  }`}
                >
                  <item.icon className={`mr-4 h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-rose-600'}`} />
                  <span className="luxe-text">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="border-t border-white/20 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-xl bg-gradient-aqua-coral flex items-center justify-center shadow-luxe">
                  <span className="text-sm font-semibold text-white">
                    {getInitials(user?.firstName, user?.lastName)}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-semibold text-gray-900 luxe-text">
                  {getFullName(user?.firstName, user?.lastName)}
                </p>
                <p className="text-xs text-gray-500 luxe-alt">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-white/50 transition-all duration-200"
                title="Logout"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 