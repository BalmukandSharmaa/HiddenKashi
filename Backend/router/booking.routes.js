import express from "express";
import { 
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getBookingsForOwner,
    getAllBookings,
    updateBookingStatus
} from "../controllers/booking.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Customer routes
router.post("/", verifyJWT, verifyRole('customer'), createBooking);
router.get("/my-bookings", verifyJWT, verifyRole('customer'), getMyBookings);
router.get("/:id", verifyJWT, getBookingById);
router.patch("/:id/cancel", verifyJWT, verifyRole('customer'), cancelBooking);

// Hotel owner routes
router.get("/owner/bookings", verifyJWT, verifyRole('hotel_owner'), getBookingsForOwner);

// Admin routes
router.get("/admin/all", verifyJWT, verifyRole('admin'), getAllBookings);
router.patch("/admin/:id/status", verifyJWT, verifyRole('admin'), updateBookingStatus);

export default router;
