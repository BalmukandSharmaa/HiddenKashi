import { Booking } from "../models/booking.models.js";
import { Hotel } from "../models/hotel.models.js";
import { Tour } from "../models/tour.models.js";
import { Payment } from "../models/payment.models.js";

// Create booking (Customer)
export const createBooking = async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            customer: req.user._id
        };

        // Validate hotel or tour exists
        if (bookingData.bookingType === 'hotel' && bookingData.hotel) {
            const hotel = await Hotel.findById(bookingData.hotel);
            if (!hotel || hotel.status !== 'approved') {
                return res.status(404).json({
                    success: false,
                    message: "Hotel not found or not approved"
                });
            }
        } else if (bookingData.bookingType === 'tour' && bookingData.tour) {
            const tour = await Tour.findById(bookingData.tour);
            if (!tour || tour.status !== 'approved') {
                return res.status(404).json({
                    success: false,
                    message: "Tour not found or not approved"
                });
            }
        }

        const booking = await Booking.create(bookingData);

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get my bookings (Customer)
export const getMyBookings = async (req, res) => {
    try {
        const { status, bookingType } = req.query;
        let query = { customer: req.user._id };
        
        if (status) query.status = status;
        if (bookingType) query.bookingType = bookingType;

        const bookings = await Booking.find(query)
            .populate('hotel', 'name address images')
            .populate('tour', 'title destination duration images')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const booking = await Booking.findById(id)
            .populate('customer', 'fullName email phone')
            .populate('hotel', 'name address images owner')
            .populate('tour', 'title destination duration images owner')
            .populate('paymentId');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Check permission
        if (req.user.role === 'customer' && booking.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this booking"
            });
        }

        return res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel booking (Customer)
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancellationReason } = req.body;

        const booking = await Booking.findOne({ _id: id, customer: req.user._id });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === 'cancelled' || booking.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel ${booking.status} booking`
            });
        }

        booking.status = 'cancelled';
        booking.cancellationReason = cancellationReason;
        booking.cancelledBy = req.user._id;
        booking.cancelledAt = new Date();
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get bookings for hotel owner's properties
export const getBookingsForOwner = async (req, res) => {
    try {
        const { status, bookingType } = req.query;
        
        // Find owner's hotels and tours
        const hotels = await Hotel.find({ owner: req.user._id }).select('_id');
        const tours = await Tour.find({ owner: req.user._id }).select('_id');
        
        const hotelIds = hotels.map(h => h._id);
        const tourIds = tours.map(t => t._id);

        let query = {
            $or: [
                { hotel: { $in: hotelIds } },
                { tour: { $in: tourIds } }
            ]
        };

        if (status) query.status = status;
        if (bookingType) query.bookingType = bookingType;

        const bookings = await Booking.find(query)
            .populate('customer', 'fullName email phone')
            .populate('hotel', 'name')
            .populate('tour', 'title')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const { status, bookingType, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (bookingType) query.bookingType = bookingType;

        const bookings = await Booking.find(query)
            .populate('customer', 'fullName email phone')
            .populate('hotel', 'name address')
            .populate('tour', 'title destination')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Booking.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: bookings,
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

// Admin: Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
