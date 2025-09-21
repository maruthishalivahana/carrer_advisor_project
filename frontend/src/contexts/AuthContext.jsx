// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://career-advisor-backend-3yvuar6t5a-uc.a.run.app' // Google Cloud Run backend
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(Boolean(token)); // true while fetching /me

    // set token on axios defaults whenever token changes
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // If token exists on mount, fetch /user/me
    useEffect(() => {
        let mounted = true;
        async function fetchMe() {
            if (!token) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await api.get('/user/me');
                if (mounted) setUser(res.data.user || res.data);
            } catch (err) {
                console.error('Failed to fetch /user/me', err);
                // token invalid -> logout
                logout();
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetchMe();
        return () => { mounted = false; };
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post('/user/login', { email, password });
        const _token = res.data.token;
        if (!_token) throw new Error('No token returned from login');
        localStorage.setItem('token', _token);
        setToken(_token);
        // fetch /me (will happen automatically because token changed), but immediately fetch to return user
        const me = await api.get('/user/me');
        setUser(me.data.user || me.data);
        return me.data.user || me.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const signup = async (fullname, email, password) => {
        // call register; backend returns 201 but not token typically
        const res = await api.post('/user/register', { fullname, email, password });
        return res.data;
    };

    const updateOnboarding = async (payload) => {
        const res = await api.post('/user/onboarding', payload);
        // we expect backend to return updated user (res.data.user)
        const updatedUser = res.data.user || res.data;
        setUser(updatedUser);
        return updatedUser;
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, loading, login, logout, signup, updateOnboarding, api }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default api;
