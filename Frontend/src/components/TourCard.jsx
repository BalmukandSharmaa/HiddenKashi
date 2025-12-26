import React from 'react';
import { FiStar, FiClock, FiUsers } from 'react-icons/fi';

const TourCard = ({ tour, onClick }) => {
  return (
    <div onClick={onClick} className="card p-4 cursor-pointer">
      <div className="relative h-48 mb-4">
        <img
          src={tour.images?.[0] || 'https://via.placeholder.com/400x300?text=Tour+Image'}
          alt={tour.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <span className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-xs">
          {tour.difficulty}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
      
      <div className="flex items-center mb-2">
        <FiStar className="text-yellow-400 fill-current" />
        <span className="ml-1 text-sm text-gray-600">
          {tour.rating?.toFixed(1) || '0.0'} ({tour.totalReviews || 0} reviews)
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        Destination: {tour.destination}
      </p>
      
      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
        <div className="flex items-center">
          <FiClock className="mr-1" />
          {tour.duration?.days}D/{tour.duration?.nights}N
        </div>
        <div className="flex items-center">
          <FiUsers className="mr-1" />
          Max {tour.maxGroupSize}
        </div>
      </div>
      
      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{tour.description}</p>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-primary-500">₹{tour.price?.perPerson}</span>
          <span className="text-sm text-gray-500"> / person</span>
        </div>
        <button className="btn-primary text-sm">View Details</button>
      </div>
    </div>
  );
};

export default TourCard;
