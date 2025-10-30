import React, { useState } from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen" style={{ background: 'linear-gradient(135deg, var(--brand-muted) 0%, #f1f5f9 100%)' }}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="glass border-b border-white/20 shadow-luxe">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-white/50 transition-all duration-200"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex-1 flex items-center px-4">
              <div className="hidden md:block w-full max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-3 border border-white/30 rounded-xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-aqua)] focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right side of header */}
            <HeaderActions />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 

const HeaderActions = () => {
  const { user } = useAuth();
  const initials = (user?.firstName?.[0] || '?') + (user?.lastName?.[0] || '');
  return (
    <div className="flex items-center space-x-4">
      <button className="p-2.5 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-white/50 transition-all duration-200" title="Notifications">
        <BellIcon className="h-6 w-6" />
      </button>
      <div className="h-10 w-10 rounded-full bg-gradient-rose-pink text-white flex items-center justify-center text-sm font-semibold shadow-luxe">
        {initials}
      </div>
    </div>
  );
};