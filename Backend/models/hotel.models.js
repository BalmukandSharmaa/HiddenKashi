import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    amenities: [{
        type: String
    }],
    roomTypes: [{
        type: {
            type: String,
            required: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        },
        available: {
            type: Number,
            required: true
        }
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    checkInTime: {
        type: String,
        default: '14:00'
    },
    checkOutTime: {
        type: String,
        default: '11:00'
    },
    policies: {
        cancellation: String,
        childPolicy: String,
        petPolicy: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'inactive'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Create geospatial index
hotelSchema.index({ location: '2dsphere' });

export const Hotel = mongoose.model('Hotel', hotelSchema);
