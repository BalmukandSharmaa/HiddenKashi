import React from 'react';
import { FiStar } from 'react-icons/fi';

const HotelCard = ({ hotel, onClick }) => {
  const lowestPrice = hotel.roomTypes?.reduce((min, room) => 
    room.price < min ? room.price : min, 
    hotel.roomTypes[0]?.price || 0
  );

  return (
    <div onClick={onClick} className="card p-4 cursor-pointer">
      <div className="relative h-48 mb-4">
        <img
          src={hotel.images?.[0] || 'https://via.placeholder.com/400x300?text=Hotel+Image'}
          alt={hotel.name}
          className="w-full h-full object-cover rounded-lg"
        />
        {hotel.status === 'approved' && (
          <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            Available
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{hotel.name}</h3>
      
      <div className="flex items-center mb-2">
        <FiStar className="text-yellow-400 fill-current" />
        <span className="ml-1 text-sm text-gray-600">
          {hotel.rating?.toFixed(1) || '0.0'} ({hotel.totalReviews || 0} reviews)
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        {hotel.address?.city}, {hotel.address?.state}
      </p>
      
      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{hotel.description}</p>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-primary-500">₹{lowestPrice}</span>
          <span className="text-sm text-gray-500"> / night</span>
        </div>
        <button className="btn-primary text-sm">View Details</button>
      </div>
    </div>
  );
};

export default HotelCard;
