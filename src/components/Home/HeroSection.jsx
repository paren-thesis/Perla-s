import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaCalendarAlt } from 'react-icons/fa';

const HeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBookTable = () => {
    navigate("/book-table");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-4 sm:left-20 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-4 sm:right-20 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-8 sm:left-20 lg:left-40 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero Content */}
          <div className={`text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-secondary-900">Delicious Food</span>
                <br />
                <span className="text-primary-600">Is Waiting For You</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
                Our team of registered cooks and chefs provide you with the best continental dishes
                and provide you with the best services to your satisfaction
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start px-4 sm:px-0">
              <button
                onClick={() => navigate("/menu")}
                className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-primary-600 hover:to-primary-700"
              >
                <FaUtensils className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Explore Menu
              </button>
              <button
                onClick={handleBookTable}
                className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-primary-600 bg-white border-2 border-primary-500 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-primary-50"
              >
                <FaCalendarAlt className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Book a Table
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-6 sm:pt-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary-600">500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary-600">50+</div>
                <div className="text-xs sm:text-sm text-gray-600">Delicious Dishes</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-primary-600">5★</div>
                <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className={`relative order-1 lg:order-2 mb-8 lg:mb-0 transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
            <img
              src="/images/jollof1.png"
              alt="Jollof Rice"
              className="w-64 h-64 sm:w-80 sm:h-80 mx-auto lg:ml-auto rounded-full shadow-2xl object-cover"
            />

            {/* Floating Elements - Constrained within container */}
            <div className="absolute top-8 sm:top-10 left-0 sm:-left-8 lg:-left-10 w-16 h-16 sm:w-20 sm:h-20 bg-secondary-200 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-secondary-600 rounded-full"></div>
            </div>
            <div className="absolute bottom-16 sm:bottom-20 right-0 sm:-right-8 lg:-right-10 w-12 h-12 sm:w-16 sm:h-16 bg-primary-200 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-1000">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-600 rounded-full"></div>
            </div>
            <div className="absolute top-1/2 right-0 sm:-right-12 lg:-right-20 w-8 h-8 sm:w-12 sm:h-12 bg-secondary-300 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-2000">
              <div className="w-1 h-1 sm:w-2 sm:h-2 bg-secondary-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;