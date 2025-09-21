// Test script to verify login functionality
const axios = require('axios');

const BACKEND_URL = 'https://career-advisor-backend-46920913764.us-central1.run.app';

async function testLogin() {
    try {
        console.log('🧪 Testing backend login functionality...\n');

        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${BACKEND_URL}/health`);
        console.log('✅ Health check passed:', healthResponse.data);

        // Test 2: Register a test user
        console.log('\n2. Registering test user...');
        const testUser = {
            fullname: 'Test User',
            email: 'test@example.com',
            password: 'testpassword123'
        };

        try {
            const registerResponse = await axios.post(`${BACKEND_URL}/user/register`, testUser);
            console.log('✅ User registration:', registerResponse.data.message);
        } catch (error) {
            if (error.response?.data?.message?.includes('already exists')) {
                console.log('ℹ️  User already exists, continuing with login test...');
            } else {
                throw error;
            }
        }

        // Test 3: Login with test user
        console.log('\n3. Testing login...');
        const loginResponse = await axios.post(`${BACKEND_URL}/user/login`, {
            email: testUser.email,
            password: testUser.password
        });

        console.log('✅ Login successful!');
        console.log('   Token received:', loginResponse.data.token ? 'Yes' : 'No');
        console.log('   User data:', {
            id: loginResponse.data.user?.id,
            email: loginResponse.data.user?.email,
            fullname: loginResponse.data.user?.fullname
        });

        // Test 4: Test protected endpoint
        console.log('\n4. Testing protected endpoint (/user/me)...');
        const meResponse = await axios.get(`${BACKEND_URL}/user/me`, {
            headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`
            }
        });
        console.log('✅ Protected endpoint access successful!');
        console.log('   User data from /me:', meResponse.data);

        console.log('\n🎉 All tests passed! Login functionality is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

testLogin();
