import express from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser, 
    updateUserProfile, 
    changePassword,
    getAllUsers,
    toggleUserStatus
} from "../controllers/user.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update-profile", verifyJWT, updateUserProfile);
router.patch("/change-password", verifyJWT, changePassword);

// Admin only routes
router.get("/all", verifyJWT, verifyRole('admin'), getAllUsers);
router.patch("/:userId/toggle-status", verifyJWT, verifyRole('admin'), toggleUserStatus);

export default router;
