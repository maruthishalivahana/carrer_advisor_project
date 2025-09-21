// Test script to verify registration endpoint
const axios = require('axios');

const BASE_URL = 'https://career-advisor-backend-46920913764.us-central1.run.app';

async function testRegister() {
    try {
        console.log('Testing registration endpoint...');

        const response = await axios.post(`${BASE_URL}/user/register`, {
            fullname: 'Test User',
            email: 'test@example.com',
            password: 'testpass123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Registration endpoint working!');
        console.log('Response:', response.data);

    } catch (error) {
        console.log('❌ Registration endpoint error:');
        console.log('Status:', error.response?.status);
        console.log('Message:', error.response?.data?.message || error.message);
    }
}

testRegister();
