import React from 'react';

function About() {
  const stats = [
    { number: "13+", label: "Years of Excellence" },
    { number: "50K+", label: "Happy Customers" },
    { number: "100+", label: "Signature Dishes" },
    { number: "24/7", label: "Customer Support" }
  ];

  const values = [
    {
      icon: "🍽️",
      title: "Quality First",
      description: "We source only the finest ingredients and maintain the highest standards in food preparation."
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Values",
      description: "Our restaurant is built on the foundation of family, bringing warmth and care to every dish."
    },
    {
      icon: "🌟",
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from food to customer experience."
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description: "Committed to eco-friendly practices and supporting local farmers and suppliers."
    }
  ];

  const team = [
    {
      name: "Chef Maria Perla",
      role: "Head Chef & Founder",
      image: "/images/chef-maria.jpg",
      description: "With over 20 years of culinary experience, Chef Maria brings passion and creativity to every dish."
    },
    {
      name: "Antonio Perla",
      role: "Restaurant Manager",
      image: "/images/antonio.jpg",
      description: "Ensuring every guest receives exceptional service and a memorable dining experience."
    },
    {
      name: "Isabella Perla",
      role: "Pastry Chef",
      image: "/images/isabella.jpg",
      description: "Creating sweet masterpieces that are as beautiful as they are delicious."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 pt-24 md:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6">
              About <span className="text-primary-600">Perla's</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Where passion meets flavor, and every meal tells a story of tradition, 
              innovation, and the love of good food.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Welcome to <strong className="text-secondary-900">Perla's</strong>, where passion meets flavor! 
                  We are a family-owned restaurant dedicated to serving delicious, high-quality meals made from 
                  the freshest ingredients.
                </p>
                <p className="text-lg">
                  Our journey began in 2010 with a simple mission: to create a dining experience that feels like home. 
                  What started as a small family kitchen has grown into a beloved destination for food lovers everywhere.
                </p>
                <p className="text-lg">
                  At Perla's, we believe that food is more than just sustenance—it's an art form. Our chefs are 
                  passionate about crafting dishes that delight the senses and bring people together.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg leading-relaxed">
                  To create memorable dining experiences through exceptional food, warm hospitality, 
                  and a commitment to quality that exceeds expectations.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="text-4xl">🏆</div>
                <p className="text-sm text-gray-600 mt-2">Award Winning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and make Perla's more than just a restaurant.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind every delicious meal and exceptional service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="text-6xl">👨‍🍳</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience Perla's?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Join us and discover why Perla's has become a beloved destination for food lovers everywhere. 
            We look forward to serving you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transform hover:-translate-y-1 transition-all duration-200 shadow-lg">
              View Our Menu
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transform hover:-translate-y-1 transition-all duration-200">
              Book a Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
