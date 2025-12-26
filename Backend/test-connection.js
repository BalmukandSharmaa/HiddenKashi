const fetch = require('node-fetch');

async function testServer() {
    try {
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        console.log('Server response:', data);
        console.log('Status:', response.status);
    } catch (error) {
        console.error('Connection error:', error.message);
    }
}

testServer();