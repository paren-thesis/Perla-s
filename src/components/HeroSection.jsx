import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaCalendarAlt } from 'react-icons/fa';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleBookTable = () => {
    alert("Table booking feature coming soon!");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-secondary-900">Delicious Food</span>
                <br />
                <span className="text-primary-600">Is Waiting For You</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Our team of registered cooks and chefs provide you with the best continental dishes 
                and provide you with the best services to your satisfaction
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/menu")}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-primary-600 hover:to-primary-700"
              >
                <FaUtensils className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Explore Menu
              </button>
              <button
                onClick={handleBookTable}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white border-2 border-primary-500 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-primary-50"
              >
                <FaCalendarAlt className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Book a Table
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">Delicious Dishes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">5★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div className="w-80 h-80 mx-auto lg:ml-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-2xl">
                <FaUtensils className="text-white text-8xl" />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 -left-10 w-20 h-20 bg-secondary-200 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <div className="w-3 h-3 bg-secondary-600 rounded-full"></div>
            </div>
            <div className="absolute bottom-20 -right-10 w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-1000">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            </div>
            <div className="absolute top-1/2 -right-20 w-12 h-12 bg-secondary-300 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-2000">
              <div className="w-2 h-2 bg-secondary-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
