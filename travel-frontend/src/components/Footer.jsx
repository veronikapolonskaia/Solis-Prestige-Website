import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="hover:text-purple-400 transition-colors">
                  Partnerships
                </Link>
              </li>
              <li>
                <Link to="/corporate" className="hover:text-purple-400 transition-colors">
                  Corporate
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-purple-400 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
              Travel
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/collection" className="hover:text-purple-400 transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link to="/bespoke" className="hover:text-purple-400 transition-colors">
                  Bespoke
                </Link>
              </li>
              <li>
                <Link to="/editorials" className="hover:text-purple-400 transition-colors">
                  Editorials
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-purple-400 transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-purple-400 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-purple-400 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-purple-400 transition-colors">
                  Manage Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
              Newsletter
            </h3>
            <p className="text-sm mb-4">
              Subscribe to receive daily travel inspiration
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-purple-500 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
          {/* Social Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a
              href="https://facebook.com"
              className="hover:text-purple-400 transition-colors"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-purple-400 transition-colors"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              className="hover:text-purple-400 transition-colors"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://youtube.com"
              className="hover:text-purple-400 transition-colors"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              className="hover:text-purple-400 transition-colors"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-center md:text-right">
            <p>Copyright © {currentYear} LuxeTravel. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

