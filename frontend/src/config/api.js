// API Configuration
const API_BASE_URL = "https://career-advisor-backend-46920913764.us-central1.run.app";

// API endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    REGISTER: `${API_BASE_URL}/user/register`,
    LOGIN: `${API_BASE_URL}/user/login`,
    LOGOUT: `${API_BASE_URL}/logout`,

    // User endpoints
    USER_ME: `${API_BASE_URL}/user/me`,
    ONBOARDING: `${API_BASE_URL}/user/onboarding`,

    // Career endpoints
    ROADMAP: `${API_BASE_URL}/user/roadmap`,
    CAREER_RECOMMENDATIONS: `${API_BASE_URL}/user/career-recommendations/me`,

    // Chat endpoints
    CHATBOT: (id) => `${API_BASE_URL}/user/chatbot/${id}`,

    // Health endpoints
    HEALTH: `${API_BASE_URL}/health`,
    DB_STATUS: `${API_BASE_URL}/db-status`,
    TEST_DB_CONNECTION: `${API_BASE_URL}/test-db-connection`,
};

// Axios configuration
export const axiosConfig = {
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_BASE_URL;
