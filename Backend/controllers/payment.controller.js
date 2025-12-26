import { Payment } from "../models/payment.models.js";
import { Booking } from "../models/booking.models.js";

// Create payment (Customer)
export const createPayment = async (req, res) => {
    try {
        const { bookingId, amount, paymentMethod, transactionId } = req.body;

        // Verify booking exists and belongs to user
        const booking = await Booking.findOne({ _id: bookingId, customer: req.user._id });
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.paymentStatus === 'completed') {
            return res.status(400).json({
                success: false,
                message: "Payment already completed for this booking"
            });
        }

        const payment = await Payment.create({
            booking: bookingId,
            customer: req.user._id,
            amount,
            paymentMethod,
            transactionId,
            status: 'success'
        });

        // Update booking payment status
        booking.paymentStatus = 'completed';
        booking.paymentId = payment._id;
        booking.status = 'confirmed';
        await booking.save();

        return res.status(201).json({
            success: true,
            message: "Payment successful",
            data: payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get payment by booking ID
export const getPaymentByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const payment = await Payment.findOne({ booking: bookingId })
            .populate('booking')
            .populate('customer', 'fullName email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get my payments (Customer)
export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ customer: req.user._id })
            .populate('booking')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Process refund
export const processRefund = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { refundAmount, refundReason } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        if (payment.status === 'refunded') {
            return res.status(400).json({
                success: false,
                message: "Payment already refunded"
            });
        }

        if (refundAmount > payment.amount) {
            return res.status(400).json({
                success: false,
                message: "Refund amount cannot exceed payment amount"
            });
        }

        payment.refundAmount = refundAmount;
        payment.refundReason = refundReason;
        payment.refundedBy = req.user._id;
        payment.refundedAt = new Date();
        payment.status = refundAmount === payment.amount ? 'refunded' : 'partially_refunded';
        await payment.save();

        // Update booking status
        const booking = await Booking.findById(payment.booking);
        if (booking) {
            booking.status = 'refunded';
            booking.paymentStatus = 'refunded';
            await booking.save();
        }

        return res.status(200).json({
            success: true,
            message: "Refund processed successfully",
            data: payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all payments
export const getAllPayments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (status) query.status = status;

        const payments = await Payment.find(query)
            .populate('customer', 'fullName email')
            .populate('booking')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Payment.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: payments,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get payment statistics
export const getPaymentStats = async (req, res) => {
    try {
        const totalPayments = await Payment.countDocuments();
        const successfulPayments = await Payment.countDocuments({ status: 'success' });
        const refundedPayments = await Payment.countDocuments({ status: 'refunded' });
        
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalRefunds = await Payment.aggregate([
            { $match: { status: { $in: ['refunded', 'partially_refunded'] } } },
            { $group: { _id: null, total: { $sum: '$refundAmount' } } }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalPayments,
                successfulPayments,
                refundedPayments,
                totalRevenue: totalRevenue[0]?.total || 0,
                totalRefunds: totalRefunds[0]?.total || 0
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
