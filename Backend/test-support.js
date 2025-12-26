import axios from 'axios';

// Test support ticket creation
async function testSupportTicket() {
    try {
        // First login to get a token
        const loginResponse = await axios.post('http://127.0.0.1:5000/api/v1/users/login', {
            email: 'customer@test.com', // Use a customer account
            password: 'password123'
        });

        const token = loginResponse.data.data.accessToken;
        console.log('Logged in successfully');

        // Create support ticket
        const supportResponse = await axios.post('http://127.0.0.1:5000/api/v1/support', {
            subject: 'Test Support Ticket',
            message: 'This is a test support ticket to verify functionality',
            priority: 'medium'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Support ticket created successfully:', supportResponse.data);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            code: error.code
        });
    }
}

testSupportTicket();