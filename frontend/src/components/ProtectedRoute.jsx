// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;

    // If not logged in → go to login
    if (!token || !user) {
        return <Navigate to="/auth" replace />;
    }

    // If logged in but not onboarded → go to onboarding
    if (!user.onboarding?.isOnboarded) {
        return <Navigate to="/onboarding" replace />;
    }

    // Otherwise → allow access
    return children;
};


// src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// export function ProtectedRoute({ children, requireOnboarding = true }) {
//     const { token, user, loading } = useAuth();

//     if (loading) return <div className="p-8">Loading...</div>;

//     if (!token) return <Navigate to="/auth" replace />;

//     if (!user) return <Navigate to="/auth" replace />;

//     if (requireOnboarding && !user.onboarding?.isOnboarded) {
//         return <Navigate to="/onboarding" replace />;
//     }

//     return children;
// }
