import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMap, FiStar, FiCheckCircle } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-float"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-slideUp">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-green-400">Swagatam Kashi</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
              Over 10,000+ hotels and tour packages across India
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slideUp" style={{animationDelay: '0.2s'}}>
              <Link 
                to="/hotels" 
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
              >
                🏨 Browse Hotels
              </Link>
              <Link 
                to="/tours" 
                className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                🗺️ Explore Tours
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium services and curated experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FiHome, title: "Premium Hotels", desc: "Handpicked luxury hotels for your comfort", color: "from-green-500 to-green-600" },
              { icon: FiMap, title: "Amazing Tours", desc: "Expertly curated tour packages", color: "from-gray-600 to-gray-700" },
              { icon: FiStar, title: "Top Rated", desc: "Excellent customer reviews & ratings", color: "from-yellow-500 to-orange-500" },
              { icon: FiCheckCircle, title: "Easy Booking", desc: "Quick, secure & hassle-free bookings", color: "from-green-500 to-green-600" }
            ].map((feature, index) => (
              <div key={index} className="text-center glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 animate-slideUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className={`bg-gradient-to-br ${feature.color} rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <feature.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full animate-bounce"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-slideUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Are You a Hotel Owner?
            </h2>
            <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto">
              Join our platform and reach thousands of travelers worldwide. List your property and start earning today!
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-white text-green-600 px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl animate-float"
            >
              🚀 Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
