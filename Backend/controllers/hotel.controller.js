import { Hotel } from "../models/hotel.models.js";

// Create hotel (Hotel Owner)
export const createHotel = async (req, res) => {
    try {
        const hotelData = {
            ...req.body,
            owner: req.user._id,
            status: 'approved' // Auto-approve for demo purposes
        };

        const hotel = await Hotel.create(hotelData);

        return res.status(201).json({
            success: true,
            message: "Hotel created successfully and is now live",
            data: hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all hotels (Public)
export const getAllHotels = async (req, res) => {
    try {
        const { city, page = 1, limit = 10, minPrice, maxPrice, rating } = req.query;
        
        let query = { status: 'approved', isActive: true };
        
        if (city) {
            query['address.city'] = new RegExp(city, 'i');
        }
        
        if (minPrice || maxPrice) {
            query['roomTypes.price'] = {};
            if (minPrice) query['roomTypes.price'].$gte = Number(minPrice);
            if (maxPrice) query['roomTypes.price'].$lte = Number(maxPrice);
        }
        
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        const hotels = await Hotel.find(query)
            .populate('owner', 'fullName businessName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Hotel.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: hotels,
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

// Get hotel by ID (Public)
export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const hotel = await Hotel.findById(id).populate('owner', 'fullName businessName phone email');
        
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get hotels by owner (Hotel Owner)
export const getMyHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ owner: req.user._id });

        return res.status(200).json({
            success: true,
            data: hotels
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update hotel (Hotel Owner)
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        
        const hotel = await Hotel.findOne({ _id: id, owner: req.user._id });
        
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found or you don't have permission"
            });
        }

        Object.assign(hotel, req.body);
        await hotel.save();

        return res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            data: hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete hotel (Hotel Owner)
export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        
        const hotel = await Hotel.findOneAndDelete({ _id: id, owner: req.user._id });
        
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found or you don't have permission"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all hotels (pending, approved, rejected)
export const getAllHotelsAdmin = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = status ? { status } : {};

        const hotels = await Hotel.find(query)
            .populate('owner', 'fullName businessName email phone')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Hotel.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: hotels,
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

// Admin: Approve/Reject hotel
export const updateHotelStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const hotel = await Hotel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Hotel ${status} successfully`,
            data: hotel
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
