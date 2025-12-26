import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingType: {
        type: String,
        enum: ['hotel', 'tour'],
        required: true
    },
    // Hotel booking details
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    },
    roomType: String,
    numberOfRooms: Number,
    checkInDate: Date,
    checkOutDate: Date,
    
    // Tour booking details
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    tourDate: Date,
    numberOfAdults: Number,
    numberOfChildren: Number,
    
    // Common fields
    totalAmount: {
        type: Number,
        required: true
    },
    guestDetails: {
        primaryGuest: {
            name: String,
            email: String,
            phone: String
        },
        additionalGuests: [{
            name: String,
            age: Number
        }]
    },
    specialRequests: String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    cancellationReason: String,
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cancelledAt: Date
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
