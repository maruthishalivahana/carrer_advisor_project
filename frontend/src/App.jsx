

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./components/Auth";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { Dashboard } from "./components/Dashboard";
import { ChatInterface } from "./components/ChatInterface";
import { LearningRoadmap } from "./components/LearningRoadmap";
import { CareerRecommendations } from "./components/CareerRecommendations";
import { UserProfile } from "./components/UserProfile";
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute"

import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    badges: [],
    completedTasks: [],
  });


  // Handlers
  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
    toast.success("Welcome aboard! 🚀");
  };

  const handleTaskComplete = (taskId, xpReward) => {
    setUserProgress((prev) => {
      const newXp = prev.xp + xpReward;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        toast.success(`🎉 Congrats! You reached Level ${newLevel}`);
      } else {
        toast.success(`+${xpReward} XP earned!`);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedTasks: [...prev.completedTasks, taskId],
        streak: prev.streak + 1,
        badges: leveledUp
          ? [...prev.badges, `Level ${newLevel} Achiever`]
          : prev.badges,
      };
    });
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(updatedProfile);
    toast.success("Profile updated ✅");
  };

  const handleResetProfile = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userProgress");

    setUserProfile(null);
    setUserProgress({
      level: 1,
      xp: 0,
      streak: 0,
      badges: [],
      completedTasks: [],
    });

    toast("Profile reset. Starting fresh 🔄");
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Show nav only if user is onboarded */}
        {userProfile && (
          <Navigation
            userProgress={userProgress}
          />
        )}

        <main className="pt-16 px-4">
          <Routes>
            {/* Public route */}
            <Route path="/auth" element={<Auth />} />

            {/* Onboarding - only if not onboarded */}
            <Route
              path="/onboarding"
              element={
                !userProfile ? (
                  <OnboardingFlow onComplete={handleOnboardingComplete} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="/chat"
              element={
                <ChatInterface
                // userProfile={userProfile}
                // userProgress={userProgress}
                />

              }
            />

            <Route
              path="/roadmap"
              element={

                <LearningRoadmap
                // userProfile={userProfile}
                // userProgress={userProgress}
                // onTaskComplete={handleTaskComplete}
                />


              }
            />

            <Route
              path="/careers"
              element={
                <CareerRecommendations />
              }
            />

            <Route
              path="/profile"
              element={

                <UserProfile
                // userProfile={userProfile}
                // userProgress={userProgress}
                // onUpdateProfile={handleUpdateProfile}
                // onResetProfile={handleResetProfile}
                />

              }
            />

            {/* Default: redirect */}
            {/* <Route path="*" element={<Navigate to="/auth" replace />} /> */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireOnboarding={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all: redirect to dashboard if logged in */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>



        </main>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

