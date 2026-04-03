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
        const server = app.listen(port, 'localhost', (error) => {
            if (error) {
                console.error('Failed to start server:', error);
                return;
            }
            const PORT = process.env.PORT || 5000;

            app.listen(PORT, "0.0.0.0", () => {
              console.log(`Server running on port ${PORT}`);
            });
            
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