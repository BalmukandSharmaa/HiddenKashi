import app from "./app.js";
import DBConnections from "./db.js";
import dotenv from "dotenv";

dotenv.config();

// Handle errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await DBConnections();

        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

        server.on('error', (error) => {
            console.error('Server error:', error);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();