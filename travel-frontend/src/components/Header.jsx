import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span
              className={`text-2xl font-display font-bold tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-purple-600' : 'text-white'
              }`}
            >
              LuxeTravel
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link relative hover:text-purple-600 transition-colors font-medium text-sm tracking-wide ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Right */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className={`hover:text-purple-600 transition-colors font-medium text-sm ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                isScrolled
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              Join
            </Link>
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
              <X className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden pb-6 pt-2 border-t ${
            isScrolled ? 'border-gray-100 bg-white' : 'border-white/20 bg-black/50 backdrop-blur-md'
          }`}>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`hover:text-purple-600 transition-colors font-medium ${
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
                <Link
                  to="/login"
                  className={`block hover:text-purple-600 transition-colors font-medium ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block text-center px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-white text-purple-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

