import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-400 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
                Perla<span className="text-primary-500">'s</span>
              </span>
              <span className="text-xs text-gray-500 -mt-1 font-medium">RESTAURANT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" isActive={isActive} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/menu" isActive={isActive} onClick={closeMenu}>
              Menu
            </NavLink>
            <NavLink to="/login" isActive={isActive} onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/about" isActive={isActive} onClick={closeMenu}>
              About Us
            </NavLink>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 hover:from-primary-600 hover:to-primary-700">
              Book a Table
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary-500 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`}></span>
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'max-h-96 opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="pb-4 space-y-2">
            <MobileNavLink to="/" isActive={isActive} onClick={closeMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/about" isActive={isActive} onClick={closeMenu}>
              About Us
            </MobileNavLink>
            <MobileNavLink to="/menu" isActive={isActive} onClick={closeMenu}>
              Menu
            </MobileNavLink>
            <MobileNavLink to="/login" isActive={isActive} onClick={closeMenu}>
              Login
            </MobileNavLink>
            <div className="pt-4">
              <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                Book a Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
      isActive 
        ? 'text-primary-600' 
        : 'text-gray-700 hover:text-primary-600'
    }`}
  >
    {children}
    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transform transition-all duration-300 ${
      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
    }`}></span>
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' 
        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
