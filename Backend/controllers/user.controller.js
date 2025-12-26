import { User } from "../models/user.models.js";

// Register user
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone, role, businessName, businessLicense } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            phone,
            role: role || 'customer',
            businessName,
            businessLicense
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: createdUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('User found, comparing password...');
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('Invalid password for:', email);
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if (!user.isActive) {
            console.log('User account deactivated:', email);
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        console.log('Generating tokens...');
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.log('Updating user with refresh token...');
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        console.log('Fetching logged in user...');
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        console.log('Preparing response...');
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        console.log('Sending success response...');
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "User logged in successfully",
                data: {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                }
            });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Logout user
export const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "User logged out successfully"
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { fullName, phone, address, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName,
                    phone,
                    address,
                    avatar
                }
            },
            { new: true }
        ).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
        }

        const user = await User.findById(req.user._id);
        const isPasswordValid = await user.comparePassword(oldPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid old password"
            });
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { role, page = 1, limit = 10 } = req.query;
        const query = role ? { role } : {};

        const users = await User.find(query)
            .select("-password -refreshToken")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: users,
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

// Admin: Toggle user status
export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
