import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingType: {
        type: String,
        enum: ['hotel', 'tour'],
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    adminResponse: {
        comment: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);
