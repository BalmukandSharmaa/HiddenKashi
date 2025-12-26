import express from 'express';

const app = express();
const port = 3002;

app.get('/test', (req, res) => {
    console.log('Received test request');
    res.json({ message: 'Hello World!' });
});

console.log('Starting server...');
app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log(`Minimal server running on http://localhost:${port}`);
    }
});