import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import HotelCard from '../components/HotelCard';
import { FiSearch } from 'react-icons/fi';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    rating: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchCity && { city: searchCity }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.rating && { rating: filters.rating }),
      };
      const response = await apiService.getAllHotels(params);
      setHotels(response.data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Hotels 🏨
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect place to stay for your next adventure. From luxury resorts to cozy boutique hotels.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-3xl p-8 mb-12 animate-slideUp">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🏙️ Destination
              </label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-12"
                  placeholder="Which city are you exploring?"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💰 Min Price
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💸 Max Price
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="$999"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FiSearch /> Search Hotels
              </button>
            </div>
          </form>
        </div>

        {/* Hotels Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
            <p className="text-xl text-gray-600 animate-pulse">Finding hotels for you...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center animate-slideUp">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-4xl">🏨</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Hotels Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any hotels matching your criteria. Try adjusting your filters or search for a different city.
            </p>
            <button 
              onClick={() => {
                setSearchCity('');
                setFilters({ minPrice: '', maxPrice: '', rating: '' });
                fetchHotels();
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel, index) => (
              <div 
                key={hotel._id} 
                className="animate-slideUp" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <HotelCard
                  hotel={hotel}
                  onClick={() => navigate(`/hotels/${hotel._id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
