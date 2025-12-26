import express from 'express';

const app = express();
const PORT = 5000;

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running on port ${PORT}`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

// Keep process alive
setInterval(() => {
    console.log('Server still running...');
}, 10000);
