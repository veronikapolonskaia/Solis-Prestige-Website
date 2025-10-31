import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { register as registerUser } from '../services/auth';

const SignupModal = ({ open, onClose }) => {
  const dialogRef = useRef(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      onClose();
    } catch (err) {
      const apiErr = err?.response?.data;
      let msg = apiErr?.error || 'Registration failed';
      if (apiErr?.details && Array.isArray(apiErr.details) && apiErr.details.length) {
        // Show the first validator message for clarity
        msg = apiErr.details[0]?.msg || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        onClick={stop}
        className="relative w-[92%] max-w-3xl max-h-[88vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close signup"
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-gray-900">Create your free account</h2>
        <div className="h-0.5 w-16 bg-orange-400 mx-auto my-5 rounded-full" />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
          <input
            name="confirm"
            type="password"
            placeholder="Password confirmation"
            value={form.confirm}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />

          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}

          <div className="md:col-span-2 flex justify-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3.5 rounded-full font-semibold text-base md:text-lg transition-all duration-300 ${
                loading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#1a3a52] hover:bg-[#2a4a62] text-white'
              }`}
            >
              {loading ? 'CREATING...' : 'CREATE FREE ACCOUNT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default SignupModal;


