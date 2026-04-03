import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import userRoutes from "./router/user.routes.js";
import hotelRoutes from "./router/hotel.routes.js";
import tourRoutes from "./router/tour.routes.js";
import bookingRoutes from "./router/booking.routes.js";
import paymentRoutes from "./router/payment.routes.js";
import supportRoutes from "./router/support.routes.js";

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174','https://hidden-kashi.vercel.app/'],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Add size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add basic request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/support", supportRoutes);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

export default app;
