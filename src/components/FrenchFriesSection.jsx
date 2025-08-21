import React from 'react';
import { FaUtensils, FaStar, FaLeaf } from 'react-icons/fa';

const FrenchFriesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900">
                Best French Fries
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Russet potatoes are ideal. Since they're dense, they don't contain as much water inside, 
                which allows them to get extra crispy. Our secret blend of spices and double-frying technique 
                ensures the perfect golden crunch every time.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Hand-cut fresh potatoes daily</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Double-fried for perfect crispiness</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Secret blend of herbs and spices</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Served piping hot and fresh</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-orange-600 hover:to-red-600">
              <FaUtensils className="mr-2" />
              Order French Fries
            </button>
          </div>

          {/* Visual Elements */}
          <div className="relative">
            {/* Main Fries Icon */}
            <div className="relative z-10">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <FaUtensils className="text-white text-8xl" />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 -left-10 w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <FaStar className="text-yellow-600 text-xl" />
            </div>
            <div className="absolute bottom-20 -right-10 w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-1000">
              <FaLeaf className="text-orange-600 text-lg" />
            </div>
            <div className="absolute top-1/2 -right-20 w-12 h-12 bg-red-200 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-2000">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            </div>

            {/* Decorative Fries */}
            <div className="absolute -bottom-10 left-10 w-24 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transform rotate-12"></div>
            <div className="absolute -bottom-16 left-20 w-20 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transform -rotate-12"></div>
            <div className="absolute -bottom-12 left-32 w-16 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transform rotate-6"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrenchFriesSection;
