import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import TourCard from '../components/TourCard';
import { FiSearch } from 'react-icons/fi';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDestination, setSearchDestination] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    difficulty: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchDestination && { destination: searchDestination }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
      };
      const response = await apiService.getAllTours(params);
      setTours(response.data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTours();
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slideUp">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Explore Tours
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing tour packages across India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12 animate-slideUp shadow-lg" style={{animationDelay: '0.2s'}}>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Search by destination..."
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                className="input-field"
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              >
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="difficult">Difficult</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
            <p className="text-xl text-gray-600 animate-pulse">Finding tours for you...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center animate-slideUp">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <span className="text-4xl">🗺️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Tours Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any tours matching your criteria. Try adjusting your filters or search for a different destination.
            </p>
            <button 
              onClick={() => {
                setSearchDestination('');
                setFilters({ minPrice: '', maxPrice: '', difficulty: '' });
                fetchTours();
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <div 
                key={tour._id} 
                className="animate-slideUp" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <TourCard
                  tour={tour}
                  onClick={() => navigate(`/tours/${tour._id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;
