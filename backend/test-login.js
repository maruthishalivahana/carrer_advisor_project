// Test script to verify login endpoint
const axios = require('axios');

const BASE_URL = 'https://career-advisor-backend-46920913764.us-central1.run.app';

async function testLogin() {
    try {
        console.log('Testing login endpoint...');
        
        const response = await axios.post(`${BASE_URL}/user/login`, {
            email: 'test@example.com',
            password: 'testpass'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Login endpoint working!');
        console.log('Response:', response.data);
        
    } catch (error) {
        console.log('❌ Login endpoint error:');
        console.log('Status:', error.response?.status);
        console.log('Message:', error.response?.data?.message || error.message);
        console.log('Full error:', error.response?.data);
    }
}

testLogin();