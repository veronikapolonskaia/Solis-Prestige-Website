import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext.jsx';

const LoginModal = ({ open, onClose }) => {
  const dialogRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuthFromModal } = useAuth?.() || {};
  if (!open) return null;

  const stop = (e) => e.stopPropagation();

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
        className="relative w-[92%] max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close login"
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-100 text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-6">Login</h2>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
              const user = await login({ email, password });
              if (setAuthFromModal) setAuthFromModal(user);
              onClose();
            } catch (err) {
              const apiErr = err?.response?.data;
              let msg = apiErr?.error || 'Invalid email or password';
              if (apiErr?.details && Array.isArray(apiErr.details) && apiErr.details.length) {
                msg = apiErr.details[0]?.msg || msg;
              }
              setError(msg);
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-full text-white py-3 font-semibold text-sm tracking-wider ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a3a52] hover:bg-[#2a4a62]'
            }`}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
            <span aria-hidden>→</span>
          </button>
        </form>

        <div className="mt-3 text-center">
          <a href="#" className="text-xs text-purple-600 hover:underline">Forgot Login details?</a>
        </div>

        <p className="mt-6 text-[11px] text-center text-gray-500">
          If you need any help with your account please email
          <br />
          <a href="mailto:support@asw.com" className="text-purple-600 hover:underline">support@asw.com</a>
        </p>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default LoginModal;


