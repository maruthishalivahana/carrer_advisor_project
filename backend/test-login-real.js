// Test script to verify login with real user
const axios = require('axios');

const BASE_URL = 'https://career-advisor-backend-46920913764.us-central1.run.app';

async function testLoginWithRealUser() {
    try {
        console.log('Testing login with real user...');

        // First, let's try to register a new user
        console.log('1. Registering new user...');
        const registerResponse = await axios.post(`${BASE_URL}/user/register`, {
            fullname: 'Real Test User',
            email: 'realtest@example.com',
            password: 'password123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Registration successful:', registerResponse.data.message);

        // Now try to login with the same credentials
        console.log('2. Logging in with same credentials...');
        const loginResponse = await axios.post(`${BASE_URL}/user/login`, {
            email: 'realtest@example.com',
            password: 'password123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Login successful!');
        console.log('Token:', loginResponse.data.token ? 'Present' : 'Missing');
        console.log('User:', loginResponse.data.user);

    } catch (error) {
        console.log('❌ Error:');
        console.log('Status:', error.response?.status);
        console.log('Message:', error.response?.data?.message || error.message);
    }
}

testLoginWithRealUser();
