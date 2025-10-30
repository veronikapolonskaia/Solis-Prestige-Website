import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a3a52] text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-8">
          {/* Logo, Social, and App Links */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                SOLIS
              </span>
            </Link>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://instagram.com"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://youtube.com"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://linkedin.com"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* App Store Buttons */}
            <div className="space-y-2">
              <a href="#" className="block">
                <img 
                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1632268800" 
                  alt="Download on App Store" 
                  className="h-10"
                />
              </a>
              <a href="#" className="block">
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play" 
                  className="h-14 -ml-2"
                />
              </a>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors uppercase tracking-wide">
                  CONTACT US
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors uppercase tracking-wide">
                  FAQS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/partnerships" className="hover:text-white transition-colors uppercase tracking-wide">
                  PARTNERSHIPS
                </Link>
              </li>
              <li>
                <Link to="/corporate" className="hover:text-white transition-colors uppercase tracking-wide">
                  CORPORATE
                </Link>
              </li>
              <li>
                <Link to="/foundation" className="hover:text-white transition-colors uppercase tracking-wide">
                  ASW FOUNDATION
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors uppercase tracking-wide">
                  CAREERS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors uppercase tracking-wide">
                  MANAGE COOKIES
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors uppercase tracking-wide">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors uppercase tracking-wide">
                  TERMS OF SERVICE
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              SIGN UP TO OUR NEWSLETTER
            </h3>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-4 py-3 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#c07855] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#a86747] transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            <p className="text-xs mt-3 text-gray-400">
              * Subscribe to receive daily travel inspiration from around the world
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-sm text-center text-gray-400">
            Copyright © 2004 - {currentYear} ASMALLWORLD AG
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

