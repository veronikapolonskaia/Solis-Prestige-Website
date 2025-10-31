import { Link } from 'react-router-dom';
import { Menu, X, User2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: 'Collection', path: '/collection' },
    { name: 'Bespoke', path: '/bespoke' },
    { name: 'Editorials', path: '/editorials' },
    { name: 'Events', path: '/events' },
    { name: 'Membership', path: '/membership' },
  ];

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const openLogin = (e) => {
    if (e) e.preventDefault();
    setShowLogin(true);
    try {
      document.body.style.overflow = 'hidden';
      const videos = document.querySelectorAll('video');
      videos.forEach((v) => {
        try { v.pause(); } catch {}
      });
    } catch {}
  };
  const closeLogin = () => {
    setShowLogin(false);
    try {
      document.body.style.overflow = '';
      const videos = document.querySelectorAll('video');
      videos.forEach((v) => {
        try { v.play(); } catch {}
      });
    } catch {}
  };

  const openSignup = (e) => {
    if (e) e.preventDefault();
    setShowSignup(true);
    try {
      document.body.style.overflow = 'hidden';
      const videos = document.querySelectorAll('video');
      videos.forEach((v) => {
        try { v.pause(); } catch {}
      });
    } catch {}
  };
  const closeSignup = () => {
    setShowSignup(false);
    try {
      document.body.style.overflow = '';
      const videos = document.querySelectorAll('video');
      videos.forEach((v) => {
        try { v.play(); } catch {}
      });
    } catch {}
  };

  return (
    <header
      style={{
        backgroundColor: isScrolled ? '#ffffff' : 'transparent'
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : 'backdrop-blur-sm'
      }`}
    >
      <nav className="container-custom">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/SOLIS_Logo.png" 
              alt="SOLIS" 
              className="h-20 md:h-24 w-auto transition-all duration-300"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-14 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link relative hover:text-purple-600 transition-colors font-semibold text-lg md:text-xl tracking-wider ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Area - Right */}
          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <div className={`flex items-center gap-2 font-semibold text-lg md:text-xl ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                  <User2 className="w-6 h-6" />
                  <span>{user?.firstName || 'Account'}</span>
                </div>
                <button
                  onClick={logout}
                  className={`px-6 py-3 rounded-full font-semibold text-base md:text-lg transition-all duration-300 ${
                    isScrolled
                      ? 'bg-gray-900 text-white hover:bg-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#login"
                  onClick={openLogin}
                  className={`hover:text-purple-600 transition-colors font-semibold text-lg md:text-xl ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Login
                </a>
                <button
                  onClick={openSignup}
                  className={`px-8 py-3.5 rounded-full font-semibold text-lg md:text-xl transition-all duration-300 ${
                    isScrolled
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-white text-purple-600 hover:bg-gray-100'
                  }`}
                >
                  Join
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'hover:bg-gray-100'
                : 'hover:bg-white/20'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`w-8 h-8 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`w-8 h-8 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden pb-6 pt-2 border-t ${
            isScrolled ? 'border-gray-100 bg-white' : 'border-white/20 bg-black/50 backdrop-blur-md'
          }`}>
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`hover:text-purple-600 transition-colors font-semibold text-xl ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className={`pt-4 border-t space-y-3 ${
                isScrolled ? 'border-gray-100' : 'border-white/20'
              }`}>
                {isAuthenticated ? (
                  <>
                    <div className={`flex items-center gap-2 font-semibold text-xl ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                      <User2 className="w-6 h-6" />
                      <span>{user?.firstName || 'Account'}</span>
                    </div>
                    <button
                      onClick={() => { setIsMenuOpen(false); logout(); }}
                      className={`block w-full text-center px-8 py-3.5 rounded-full font-semibold text-xl transition-all duration-300 ${
                        isScrolled
                          ? 'bg-gray-900 text-white hover:bg-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="#login"
                      className={`block hover:text-purple-600 transition-colors font-semibold text-xl ${
                        isScrolled ? 'text-gray-700' : 'text-white'
                      }`}
                      onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); openLogin(); }}
                    >
                      Login
                    </a>
                    <button
                      onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); openSignup(); }}
                      className={`block w-full text-center px-8 py-3.5 rounded-full font-semibold text-xl transition-all duration-300 ${
                        isScrolled
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-white text-purple-600 hover:bg-gray-100'
                      }`}
                    >
                      Join
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <LoginModal open={showLogin} onClose={closeLogin} />
      <SignupModal open={showSignup} onClose={closeSignup} />
    </header>
  );
};

export default Header;

