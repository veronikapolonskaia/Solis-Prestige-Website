import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await login(data);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-peach-gold flex items-center justify-center shadow-luxe">
            <span className="text-white font-bold text-2xl">DS</span>
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 luxe-heading">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-base text-gray-600 luxe-text">
            Sign in to your Deluxe Soiree admin dashboard
          </p>
        </div>
        
        <div className="glass shadow-luxe-lg rounded-3xl border border-white/20 p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 luxe-text">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`mt-2 block w-full px-4 py-3 border border-white/30 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all duration-200 sm:text-sm ${
                    errors.email ? 'border-red-300 ring-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 luxe-text">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 luxe-text">
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className={`block w-full px-4 py-3 pr-12 border border-white/30 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/60 backdrop-blur-sm transition-all duration-200 sm:text-sm ${
                      errors.password ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 luxe-text">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-rose-pink hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-luxe hover:shadow-luxe-lg transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 luxe-alt">
                Demo credentials: admin@example.com / admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 