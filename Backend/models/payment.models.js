import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'netbanking', 'wallet'],
        required: true
    },
    transactionId: {
        type: String,
        unique: true
    },
    paymentGateway: {
        type: String,
        default: 'razorpay'
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'refunded', 'partially_refunded'],
        default: 'pending'
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    refundedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    refundedAt: Date,
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
