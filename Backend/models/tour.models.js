import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
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
    destination: {
        type: String,
        required: true
    },
    duration: {
        days: {
            type: Number,
            required: true
        },
        nights: {
            type: Number,
            required: true
        }
    },
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        activities: [String]
    }],
    price: {
        perPerson: {
            type: Number,
            required: true
        },
        child: {
            type: Number
        }
    },
    inclusions: [{
        type: String
    }],
    exclusions: [{
        type: String
    }],
    availableDates: [{
        startDate: Date,
        endDate: Date,
        availableSeats: Number
    }],
    maxGroupSize: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'difficult'],
        default: 'moderate'
    },
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

export const Tour = mongoose.model('Tour', tourSchema);
