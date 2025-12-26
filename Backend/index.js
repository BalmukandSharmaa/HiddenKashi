import app from "./app.js";
import DBConnections from "./db.js";
import dotenv from "dotenv";

dotenv.config({ override: true });

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

const startServer = async ()=>{
    try {
        await DBConnections();
        const port = process.env.PORT || 8000;
        const server = app.listen(port, 'localhost', (error) => {
            if (error) {
                console.error('Failed to start server:', error);
                return;
            }
            console.log(`Server is running on port ${port}`);
            console.log(`Server listening on http://localhost:${port}`);
            console.log(`Server address:`, server.address());
        });
        
        server.on('error', (error) => {
            console.error('Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${port} is already in use. Please choose a different port.`);
            }
        });
        
        server.on('listening', () => {
            console.log('Server started listening successfully');
        });
        
        // Keep process alive
        process.stdin.resume();
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer()