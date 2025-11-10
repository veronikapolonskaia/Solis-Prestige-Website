import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const result = await register(form);
      if (result.success) {
        setSuccess('Account created successfully. You are now logged in.');
        
        // Redirect to the booking page if user was trying to book
        setTimeout(() => {
          const redirectUrl = localStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectUrl);
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 bg-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-center text-gray-900">Create account</h1>
          <div className="h-1 w-16 bg-orange-400 mx-auto my-4 rounded-full" />
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 sm:mt-6">
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="md:col-span-2 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="md:col-span-2 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />

            {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
            {success && <p className="md:col-span-2 text-sm text-green-700">{success}</p>}

            <div className="md:col-span-2 flex justify-center mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 ${
                  loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#1a3a52] hover:bg-[#2a4a62] text-white'
                }`}
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;


