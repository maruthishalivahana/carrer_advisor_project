// Test script to verify backend endpoints
const axios = require('axios');

const BASE_URL = 'https://career-advisor-backend-46920913764.us-central1.run.app';

async function testEndpoints() {
    console.log('🧪 Testing Backend Endpoints...\n');

    try {
        // Test health endpoint
        console.log('1. Testing /health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check:', healthResponse.data);
        console.log('');

        // Test database status
        console.log('2. Testing /db-status endpoint...');
        const dbStatusResponse = await axios.get(`${BASE_URL}/db-status`);
        console.log('✅ Database status:', dbStatusResponse.data);
        console.log('');

        // Test database connection
        console.log('3. Testing /test-db-connection endpoint...');
        const dbTestResponse = await axios.get(`${BASE_URL}/test-db-connection`);
        console.log('✅ Database test:', dbTestResponse.data);
        console.log('');

        // Test registration endpoint (with invalid data to test validation)
        console.log('4. Testing /user/register endpoint validation...');
        try {
            await axios.post(`${BASE_URL}/user/register`, {
                // Missing required fields
            });
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Registration validation working:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }
        console.log('');

        // Test login endpoint (with invalid data to test validation)
        console.log('5. Testing /user/login endpoint validation...');
        try {
            await axios.post(`${BASE_URL}/user/login`, {
                // Missing required fields
            });
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Login validation working:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }
        console.log('');

        console.log('🎉 All endpoint tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run the tests
testEndpoints();
