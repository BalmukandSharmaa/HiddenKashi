import express from "express";
import { 
    createTour,
    getAllTours,
    getTourById,
    getMyTours,
    updateTour,
    deleteTour,
    getAllToursAdmin,
    updateTourStatus
} from "../controllers/tour.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllTours);
router.get("/:id", getTourById);

// Hotel owner routes
router.post("/", verifyJWT, verifyRole('hotel_owner'), createTour);
router.get("/owner/my-tours", verifyJWT, verifyRole('hotel_owner'), getMyTours);
router.patch("/:id", verifyJWT, verifyRole('hotel_owner'), updateTour);
router.delete("/:id", verifyJWT, verifyRole('hotel_owner'), deleteTour);

// Admin routes
router.get("/admin/all", verifyJWT, verifyRole('admin'), getAllToursAdmin);
router.patch("/admin/:id/status", verifyJWT, verifyRole('admin'), updateTourStatus);

export default router;
