import { Tour } from "../models/tour.models.js";

// Create tour (Hotel Owner)
export const createTour = async (req, res) => {
    try {
        const tourData = {
            ...req.body,
            owner: req.user._id,
            status: 'approved' // Auto-approve for demo purposes
        };

        const tour = await Tour.create(tourData);

        return res.status(201).json({
            success: true,
            message: "Tour created successfully and is now live",
            data: tour
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all tours (Public)
export const getAllTours = async (req, res) => {
    try {
        const { destination, page = 1, limit = 10, minPrice, maxPrice, difficulty, rating } = req.query;
        
        let query = { status: 'approved', isActive: true };
        
        if (destination) {
            query.destination = new RegExp(destination, 'i');
        }
        
        if (minPrice || maxPrice) {
            query['price.perPerson'] = {};
            if (minPrice) query['price.perPerson'].$gte = Number(minPrice);
            if (maxPrice) query['price.perPerson'].$lte = Number(maxPrice);
        }
        
        if (difficulty) {
            query.difficulty = difficulty;
        }
        
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        const tours = await Tour.find(query)
            .populate('owner', 'fullName businessName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Tour.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: tours,
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

// Get tour by ID (Public)
export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const tour = await Tour.findById(id).populate('owner', 'fullName businessName phone email');
        
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: tour
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get tours by owner (Hotel Owner)
export const getMyTours = async (req, res) => {
    try {
        const tours = await Tour.find({ owner: req.user._id });

        return res.status(200).json({
            success: true,
            data: tours
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update tour (Hotel Owner)
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        
        const tour = await Tour.findOne({ _id: id, owner: req.user._id });
        
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found or you don't have permission"
            });
        }

        Object.assign(tour, req.body);
        await tour.save();

        return res.status(200).json({
            success: true,
            message: "Tour updated successfully",
            data: tour
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete tour (Hotel Owner)
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        
        const tour = await Tour.findOneAndDelete({ _id: id, owner: req.user._id });
        
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found or you don't have permission"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Tour deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all tours
export const getAllToursAdmin = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = status ? { status } : {};

        const tours = await Tour.find(query)
            .populate('owner', 'fullName businessName email phone')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Tour.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: tours,
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

// Admin: Approve/Reject tour
export const updateTourStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const tour = await Tour.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Tour ${status} successfully`,
            data: tour
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
