import React from "react";
import {
    Trophy,
    Target,
    Clock,
    Star,
    TrendingUp,
    BookOpen,
    MessageCircle,
    Flame,
    Award,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { LinearProgress, Box } from "@mui/material";
import { Navigation } from "./Navigation";
import { useNavigate } from "react-router-dom";
import axios from 'axios'



export function Dashboard({ userProfile = {}, userProgress = {}, onTaskComplete }) {

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            const token = localStorage.getItem("token");

            // Optional: call backend logout
            await axios.post("https://career-advisor-backend-46920913764.us-central1.run.app/logout", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Clear token on client side
            localStorage.removeItem("token");

            // Redirect to login
            navigate("/auth");
        } catch (err) {
            console.error("Logout error", err);
            localStorage.removeItem("token");
            navigate("/auth");
        }
    };

    // Safe defaults
    const {
        xp = 0,
        level = 1,
        streak = 0,
        badges = [],
        completedTasks = [],
    } = userProgress;

    const { name = "Explorer", interests = [], skills = [], goals = [] } = userProfile;

    // Calculate progress within current level (0–100%)
    const levelProgress = ((xp % 1000) / 1000) * 100;
    const xpToNextLevel = 1000 - (xp % 1000);

    const quickTasks = [
        {
            id: "profile-review",
            title: "Review Your Profile",
            description: "Take 5 minutes to review and update your skills",
            duration: "5 min",
            xp: 50,
            icon: Target,
            completed: completedTasks.includes("profile-review"),
        },
        {
            id: "skill-assessment",
            title: "Quick Skill Assessment",
            description: "Answer 10 questions about your programming skills",
            duration: "15 min",
            xp: 150,
            icon: BookOpen,
            completed: completedTasks.includes("skill-assessment"),
        },
        {
            id: "career-chat",
            title: "Chat with AI Career Advisor",
            description: "Discuss your career goals with our AI",
            duration: "10 min",
            xp: 100,
            icon: MessageCircle,
            completed: completedTasks.includes("career-chat"),
        },
    ];

    const recentAchievements = [
        { name: "Profile Creator", description: "Completed your profile setup", date: "Today" },
        { name: "Goal Setter", description: "Added your career goals", date: "Today" },
        ...badges.slice(-3).map((badge) => ({
            name: badge,
            description: "Achievement unlocked!",
            date: "Recently",
        })),
    ];

    return (
        <>
            {/* <Navigation currentScreen="dashboard" userProgress={userProgress} /> */}
            <div className="flex items-center flex-row gap-4">
                <Navigation />
                <button className="  mt-10 cursor-pointer border p-4 rounded-2xl" onClick={handleLogout}>logout</button>
            </div>
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Welcome Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl">Welcome back, {name}! 👋</h1>
                    <p className="text-muted-foreground">
                        Ready to continue your career journey? You're on Level {level}!
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Level */}
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Star className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="text-2xl font-medium">{level}</div>
                        <div className="text-sm text-muted-foreground">Current Level</div>
                    </div>

                    {/* Streak */}
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Flame className="w-8 h-8 text-orange-500" />
                        </div>
                        <div className="text-2xl font-medium">{streak}</div>
                        <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>

                    {/* Badges */}
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-medium">{badges.length}</div>
                        <div className="text-sm text-muted-foreground">Badges Earned</div>
                    </div>

                    {/* Tasks */}
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <div className="text-2xl font-medium">{completedTasks.length}</div>
                        <div className="text-sm text-muted-foreground">Tasks Done</div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center gap-2 font-medium mb-4">
                        <TrendingUp className="w-5 h-5" />
                        Level Progress
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Level {level}</span>
                            <span>{xpToNextLevel} XP to Level {level + 1}</span>
                        </div>
                        <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                            <LinearProgress
                                variant="determinate"
                                value={levelProgress}
                                sx={{
                                    height: 12,
                                    backgroundColor: "#e0e0e0",
                                    "& .MuiLinearProgress-bar": { backgroundColor: "black" },
                                }}
                            />
                        </Box>
                        <div className="text-center text-sm text-muted-foreground">
                            {xp} / {level * 1000} XP
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Tasks */}
                    <div className="bg-white rounded-xl shadow">
                        <div className="flex items-center gap-2 font-medium p-4 border-b">
                            <Clock className="w-5 h-5" />
                            Quick Tasks (10-25 min)
                        </div>
                        <div className="space-y-3 p-4">
                            {quickTasks.map((task, index) => {
                                const Icon = task.icon;
                                return (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-4 rounded-lg border ${task.completed
                                            ? "bg-green-50 border-green-200"
                                            : "bg-gray-50 border-gray-200"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <Icon
                                                    className={`w-6 h-6 mt-1 ${task.completed ? "text-green-600" : "text-purple-600"
                                                        }`}
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{task.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <span className="px-2 py-1 text-xs border rounded-md bg-white">
                                                            {task.duration}
                                                        </span>
                                                        <span className="px-2 py-1 text-xs rounded-md bg-gray-200">
                                                            +{task.xp} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {task.completed ? (
                                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <button
                                                    onClick={() => onTaskComplete?.(task.id, task.xp)}
                                                    className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800 transition"
                                                >
                                                    Start
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="bg-white rounded-xl shadow">
                        <div className="flex items-center gap-2 font-medium p-4 border-b">
                            <Award className="w-5 h-5" />
                            Recent Achievements
                        </div>
                        <div className="space-y-3 p-4">
                            {recentAchievements.length > 0 ? (
                                recentAchievements.slice(0, 4).map((achievement, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                                    >
                                        <Trophy className="w-6 h-6 text-yellow-600" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm">{achievement.name}</h4>
                                            <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                        </div>
                                        <span className="px-2 py-1 text-xs border rounded-md bg-white">
                                            {achievement.date}
                                        </span>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground py-8">
                                    <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Complete tasks to earn your first achievements!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Overview */}
                <div className="bg-white rounded-xl shadow">
                    <div className="p-4 border-b font-medium">Your Profile Overview</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                        <div>
                            <h4 className="font-medium mb-2">Interests</h4>
                            <div className="flex flex-wrap gap-1">
                                {interests.map((interest, i) => (
                                    <span key={i} className="px-2 py-1 text-xs rounded-md bg-gray-200">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 text-xs border rounded-md bg-white">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Goals</h4>
                            <div className="flex flex-wrap gap-1">
                                {goals.map((goal, i) => (
                                    <span key={i} className="px-2 py-1 text-xs rounded-md bg-purple-100">
                                        {goal}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
