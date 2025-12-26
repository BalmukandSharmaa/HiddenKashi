import express from "express";
import { 
    createTicket,
    getMyTickets,
    getTicketById,
    addMessage,
    getAllTickets,
    assignTicket,
    resolveTicket,
    updateTicketStatus
} from "../controllers/support.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", verifyJWT, createTicket);
router.get("/my-tickets", verifyJWT, getMyTickets);
router.get("/:id", verifyJWT, getTicketById);
router.post("/:id/message", verifyJWT, addMessage);

// Admin routes
router.get("/admin/all", verifyJWT, verifyRole('admin'), getAllTickets);
router.patch("/admin/:id/assign", verifyJWT, verifyRole('admin'), assignTicket);
router.patch("/admin/:id/resolve", verifyJWT, verifyRole('admin'), resolveTicket);
router.patch("/admin/:id/status", verifyJWT, verifyRole('admin'), updateTicketStatus);

export default router;
