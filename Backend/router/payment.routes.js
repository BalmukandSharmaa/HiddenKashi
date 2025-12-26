import express from "express";
import { 
    createPayment,
    getPaymentByBooking,
    getMyPayments,
    processRefund,
    getAllPayments,
    getPaymentStats
} from "../controllers/payment.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Customer routes
router.post("/", verifyJWT, verifyRole('customer'), createPayment);
router.get("/my-payments", verifyJWT, verifyRole('customer'), getMyPayments);
router.get("/booking/:bookingId", verifyJWT, getPaymentByBooking);

// Admin routes
router.get("/admin/all", verifyJWT, verifyRole('admin'), getAllPayments);
router.get("/admin/stats", verifyJWT, verifyRole('admin'), getPaymentStats);
router.post("/admin/:paymentId/refund", verifyJWT, verifyRole('admin'), processRefund);

export default router;
