import React from 'react';
import { FaStar, FaUtensils, FaFish, FaLeaf } from 'react-icons/fa';

const TopListSection = () => {
  const menuItems = [
    {
      id: 1,
      name: "Banku",
      description: "with fried fish",
      rating: 4.1,
      price: "¢25",
      icon: FaUtensils,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      name: "Kenkey",
      description: "with fried fish",
      rating: 4.2,
      price: "¢25",
      icon: FaFish,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: 3,
      name: "Gob3",
      description: "with fried plantain",
      rating: 4.5,
      price: "¢45",
      icon: FaLeaf,
      color: "from-green-400 to-green-600"
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={i} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStar key="half" className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaStar key={`empty-${i}`} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary-900 mb-3 sm:mb-4">
            Top List
          </h2>
          <h3 className="text-lg sm:text-xl md:text-2xl text-primary-600 font-semibold">
            Our Mainstay Menu
          </h3>
          <div className="w-20 sm:w-24 h-1 bg-primary-500 mx-auto mt-3 sm:mt-4 rounded-full"></div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Icon Header */}
                <div className={`bg-gradient-to-br ${item.color} p-6 sm:p-8 flex items-center justify-center`}>
                  <IconComponent className="text-white text-4xl sm:text-6xl group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {item.name}
                  </h4>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm">
                    {item.description}
                  </p>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {item.rating}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-primary-600">
                      {item.price}
                    </div>
                  </div>

                  {/* Order Button */}
                  <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base">
                    Order Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Menu Button */}
        <div className="text-center mt-10 sm:mt-12">
          <button className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-primary-600 bg-white border-2 border-primary-500 rounded-full hover:bg-primary-50 hover:border-primary-600 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
            <FaUtensils className="mr-2" />
            View Full Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopListSection;
