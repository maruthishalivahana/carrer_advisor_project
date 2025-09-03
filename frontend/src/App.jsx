// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import React from 'react'

// import React, { useState, useEffect } from 'react';
// import { OnboardingFlow } from './components/OnboardingFlow';
// import { Dashboard } from './components/Dashboard';
// import { CareerRecommendations } from './components/CareerRecommendations';
// import { LearningRoadmap } from './components/LearningRoadmap';
// import { UserProfile } from './components/UserProfile';
// import { ChatInterface } from './components/ChatInterface';
import React, { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { ChatInterface } from "./components/ChatInterface";
import { LearningRoadmap } from "./components/LearningRoadmap";
import { CareerRecommendations } from "./components/CareerRecommendations";
import { UserProfile } from "./components/UserProfile";
import { Navigation } from "./components/Navigation";
import { OnboardingFlow } from "./components/OnboardingFlow";

// ✅ Use react-hot-toast instead of sonner
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("onboarding");
  const [userProfile, setUserProfile] = useState(null);
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    badges: [],
    completedTasks: [],
  });

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    const savedProgress = localStorage.getItem("userProgress");

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setCurrentScreen("dashboard");
    }

    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
  }, [userProgress]);

  // Handlers
  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile);
    setCurrentScreen("dashboard");
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

    setCurrentScreen("onboarding");
    toast("Profile reset. Starting fresh 🔄");
  };

  // Onboarding first
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Global Navigation */}
      <Navigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        userProgress={userProgress}
      />

      {/* Screens */}
      <main className="pt-16 px-4">
        {currentScreen === "dashboard" && (
          <Dashboard
            userProfile={userProfile}
            userProgress={userProgress}
            onTaskComplete={handleTaskComplete}
          />
        )}

        {currentScreen === "chat" && (
          <ChatInterface
            userProfile={userProfile}
            userProgress={userProgress}
          />
        )}

        {currentScreen === "roadmap" && (
          <LearningRoadmap
            userProfile={userProfile}
            userProgress={userProgress}
            onTaskComplete={handleTaskComplete}
          />
        )}

        {currentScreen === "careers" && (
          <CareerRecommendations userProfile={userProfile} />
        )}

        {currentScreen === "profile" && (
          <UserProfile
            userProfile={userProfile}
            userProgress={userProgress}
            onUpdateProfile={handleUpdateProfile}
            onResetProfile={handleResetProfile}
          />
        )}
      </main>

      {/* ✅ Hot Toast Toaster */}
      <Toaster position="top-right" />
    </div>
  );
}



// export default function App() {
//   return (
//     // <OnboardingFlow />
//     // <Dashboard />
//     // <CareerRecommendations />
//     // <LearningRoadmap />
//     // <UserProfile />
//     <ChatInterface />
//   )
// } 
