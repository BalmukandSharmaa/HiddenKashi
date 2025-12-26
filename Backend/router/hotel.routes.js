import express from "express";
import { 
    createHotel,
    getAllHotels,
    getHotelById,
    getMyHotels,
    updateHotel,
    deleteHotel,
    getAllHotelsAdmin,
    updateHotelStatus
} from "../controllers/hotel.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllHotels);
router.get("/:id", getHotelById);

// Hotel owner routes
router.post("/", verifyJWT, verifyRole('hotel_owner'), createHotel);
router.get("/owner/my-hotels", verifyJWT, verifyRole('hotel_owner'), getMyHotels);
router.patch("/:id", verifyJWT, verifyRole('hotel_owner'), updateHotel);
router.delete("/:id", verifyJWT, verifyRole('hotel_owner'), deleteHotel);

// Admin routes
router.get("/admin/all", verifyJWT, verifyRole('admin'), getAllHotelsAdmin);
router.patch("/admin/:id/status", verifyJWT, verifyRole('admin'), updateHotelStatus);

export default router;
