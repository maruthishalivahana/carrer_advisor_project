import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Map,
    Clock,
    Trophy,
    CheckCircle2,
    Circle,
    Star,
    Target,
    BookOpen,
    Video,
    Code,
    FileText,
    Users,
    Calendar,
    Flame,
    Award,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function LearningRoadmap({ userProfile = {}, userProgress = {}, onTaskComplete }) {
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tasksByWeek, setTasksByWeek] = useState({});

    // Safe defaults
    const completedTasks = Array.isArray(userProgress?.completedTasks)
        ? userProgress.completedTasks
        : [];
    const streak = Number(userProgress?.streak || 0);

    // Fetch AI Roadmap from backend (robust, safe, and well-logged)
    useEffect(() => {
        let cancelled = false; // prevents state updates after unmount

        const fetchRoadmap = async () => {
            // Begin loading state for UX feedback
            if (!cancelled) setLoading(true);
            if (!cancelled) setError("");

            try {
                // 1) Safely fetch auth and user info
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("[LearningRoadmap] Missing JWT token in localStorage");
                    if (!cancelled) setError("You are not logged in. Please log in and try again.");
                    if (!cancelled) setLoading(false);
                    return;
                }

                const storedUserRaw = localStorage.getItem("user");
                let storedUser = null;
                try {
                    storedUser = JSON.parse(storedUserRaw || "null");
                } catch (e) {
                    console.warn("[LearningRoadmap] Failed to parse stored user from localStorage", e);
                }
                const userId = storedUser?.id || storedUser?._id;
                if (!userId) {
                    console.warn("[LearningRoadmap] Missing user id in local storage user object", storedUser);
                    if (!cancelled) setError("Missing user information. Please log in again.");
                    if (!cancelled) setLoading(false);
                    return;
                }

                // 2) Perform API request with Authorization header
                console.debug("[LearningRoadmap] Fetching roadmap for user", { userId });
                const response = await axios.get("https://career-advisor-backend-46920913764.us-central1.run.app/user/roadmap", {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 30000,
                });

                // 3) Validate and normalize backend payload
                // Expected: { roadmap: { week1: [{ task, status }], ... } }
                const backendRoadmap = response?.data?.roadmap;
                if (!backendRoadmap || typeof backendRoadmap !== "object") {
                    console.error("[LearningRoadmap] Invalid roadmap payload", response?.data);
                    throw new Error("Invalid roadmap data received from server");
                }


                const normalized = {};
                // Convert array -> object with week1, week2 keys
                backendRoadmap.forEach((weekItem) => {
                    const weekKey = `week${weekItem.week}`;
                    normalized[weekKey] = (weekItem.tasks || []).map((t, idx) => ({
                        id: `${weekKey}-${idx + 1}`,
                        title: t.task || `Task ${idx + 1}`,
                        description: t.description || "",
                        duration: "30 min",
                        xp: 100,
                        type: "reading",
                        difficulty: "beginner",
                        category: "Roadmap",
                        status: t.status === "completed" ? "completed" : "pending",
                    }));
                });

                setTasksByWeek(normalized);


                // 4) Update state
                if (!cancelled) setTasksByWeek(normalized);
                if (!cancelled) setLoading(false);
                console.debug("[LearningRoadmap] Roadmap loaded and normalized", normalized);
            } catch (error) {
                // 5) Robust error handling and helpful logs
                const backendMessage = error?.response?.data?.message || error?.response?.data?.error;
                const status = error?.response?.status;
                console.error("[LearningRoadmap] Roadmap fetch failed", {
                    status,
                    backendMessage,
                    errorMessage: error?.message,
                    stack: error?.stack,
                });
                const friendly = backendMessage || error?.message || "Failed to load roadmap";
                if (!cancelled) setError(friendly);
                if (!cancelled) setLoading(false);
            }
        };

        fetchRoadmap();

        // Cleanup to avoid setting state on unmounted component
        return () => {
            cancelled = true;
        };
    }, []);

    const getTasksByWeek = (week) => tasksByWeek[`week${week}`] || [];

    const getWeekProgress = (week) => {
        const weekTasks = getTasksByWeek(week);
        const completed = weekTasks.filter((task) => completedTasks.includes(task.id));
        return weekTasks.length > 0 ? (completed.length / weekTasks.length) * 100 : 0;
    };

    const getTotalProgress = () => {
        const all = Object.values(tasksByWeek).flat();
        const completedCount = all.filter((task) => completedTasks.includes(task.id)).length;
        return all.length > 0 ? (completedCount / all.length) * 100 : 0;
    };

    const getTaskIcon = (type) => {
        switch (type) {
            case "video":
                return Video;
            case "project":
                return Code;
            case "reading":
                return FileText;
            case "practice":
                return Target;
            case "assessment":
                return BookOpen;
            default:
                return Circle;
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "beginner":
                return "text-green-600 bg-green-50 border-green-200";
            case "intermediate":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "advanced":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const handleCompleteTask = (task) => {
        if (completedTasks.includes(task.id)) return;

        if (task.prerequisites) {
            const unmet = task.prerequisites.filter((p) => !completedTasks.includes(p));
            if (unmet.length > 0) {
                toast.error("Please complete prerequisite tasks first!");
                return;
            }
        }

        // onTaskComplete(task.id, task.xp);
        toast.success(`Great job! You earned ${task.xp} XP! 🎉`);
    };

    const weeks = [1, 2, 3, 4];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl flex items-center justify-center gap-2">
                    <Map className="w-8 h-8 text-purple-600" />
                    Your Learning Roadmap
                </h1>
                <p className="text-gray-600">
                    Personalized 4-week journey to achieve your goal:{" "}
                    {userProfile?.goals?.[0] || "Your Career Goal"}
                </p>
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="border rounded-lg shadow-sm p-4 text-center text-gray-600">Loading roadmap...</div>
            )}
            {error && !loading && (
                <div className="border rounded-lg shadow-sm p-4 text-center text-red-600">{error}</div>
            )}

            {/* Overall Progress */}
            {!loading && !error && (
                <div className="border border-gray-200 rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold">Overall Progress</h2>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border">
                            {Math.round(getTotalProgress())}% Complete
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black transition-all"
                            style={{ width: `${getTotalProgress()}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{completedTasks.length} tasks completed</span>
                        <span>{Math.max(Object.values(tasksByWeek).flat().length - completedTasks.length, 0)} tasks remaining</span>
                    </div>
                </div>
            )}

            {/* Week Navigation */}
            {!loading && !error && (
                <div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {weeks.map((week) => {
                            const progress = getWeekProgress(week);
                            const isActive = selectedWeek === week;
                            return (
                                <button
                                    key={week}
                                    onClick={() => setSelectedWeek(week)}
                                    className={`p-2 rounded-lg border border-gray-300 text-sm flex flex-col items-center ${isActive ? "border-black bg-gray-100" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <span>Week {week}</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                        <div
                                            className="bg-purple-600 h-1 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs">{Math.round(progress)}%</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Week Tasks */}
                    {weeks.map(
                        (week) =>
                            selectedWeek === week && (
                                <div
                                    key={week}
                                    className="border border-gray-200 rounded-lg shadow-sm p-4 space-y-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="flex items-center gap-2 font-semibold">
                                            <Calendar className="w-5 h-5" />
                                            Week {week} Tasks
                                        </h3>
                                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border">
                                            {getTasksByWeek(week).filter((t) => completedTasks.includes(t.id)).length}
                                            /{getTasksByWeek(week).length} Complete
                                        </span>
                                    </div>

                                    <AnimatePresence>
                                        {getTasksByWeek(week).map((task, index) => {
                                            const Icon = getTaskIcon(task.type);
                                            const isCompleted = completedTasks.includes(task.id);
                                            const canStart =
                                                !task.prerequisites ||
                                                task.prerequisites.every((p) => completedTasks.includes(p));

                                            return (
                                                <motion.div
                                                    key={task.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`p-4 rounded-lg border border-gray-200 transition ${isCompleted
                                                        ? "bg-green-50 border-green-200"
                                                        : canStart
                                                            ? "hover:border-purple-300"
                                                            : "bg-gray-50 border-gray-200 opacity-60"
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex gap-3 flex-1">
                                                            <div
                                                                className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : "bg-purple-100"
                                                                    }`}
                                                            >
                                                                <Icon
                                                                    className={`w-5 h-5 ${isCompleted ? "text-green-600" : "text-purple-600"
                                                                        }`}
                                                                />
                                                            </div>

                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-medium">{task.title}</h4>
                                                                    <span
                                                                        className={`px-2 py-0.5 rounded-full border border-amber-50 text-xs ${getDifficultyColor(
                                                                            task.difficulty
                                                                        )}`}
                                                                    >
                                                                        {task.difficulty}
                                                                    </span>
                                                                </div>

                                                                <p className="text-sm text-gray-600 mb-2">
                                                                    {task.description || ""}
                                                                </p>

                                                                <div className="flex items-center gap-4 flex-wrap">
                                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 border text-xs flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {task.duration}
                                                                    </span>
                                                                    <span className="px-2 py-0.5 rounded-full border text-xs flex items-center gap-1">
                                                                        <Star className="w-3 h-3" />+{task.xp} XP
                                                                    </span>
                                                                    <span className="px-2 py-0.5 rounded-full border text-xs">
                                                                        {task.category}
                                                                    </span>
                                                                </div>

                                                                {task.prerequisites?.length > 0 && (
                                                                    <div className="mt-2 text-xs text-gray-500">
                                                                        Prerequisites: {task.prerequisites.join(", ")}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            {isCompleted ? (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 border text-xs">
                                                                        +{task.xp} XP
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleCompleteTask(task)}
                                                                    disabled={!canStart}
                                                                    className={`px-3 py-2 rounded-md text-sm font-medium ${canStart
                                                                        ? "bg-black text-white hover:bg-gray-800"
                                                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                        }`}
                                                                >
                                                                    {canStart ? "Start" : "Locked"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            )
                    )}
                </div>
            )}

            {/* Achievements */}
            <div className="border border-amber-50 rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3 font-semibold">
                    <Award className="w-5 h-5" />
                    Roadmap Achievements
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            name: "First Step",
                            description: "Complete your first task",
                            condition: completedTasks.length >= 1,
                            icon: Target,
                        },
                        {
                            name: "Week Warrior",
                            description: "Complete all tasks in a week",
                            condition: weeks.some((week) => getWeekProgress(week) === 100),
                            icon: Trophy,
                        },
                        {
                            name: "Streak Master",
                            description: "Maintain a 7-day streak",
                            condition: streak >= 7,
                            icon: Flame,
                        },
                        {
                            name: "Roadmap Champion",
                            description: "Complete the entire roadmap",
                            condition: getTotalProgress() === 100,
                            icon: Star,
                        },
                    ].map((a, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded-lg border border-gray-200 text-center ${a.condition ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"
                                }`}
                        >
                            <a.icon
                                className={`w-8 h-8 mx-auto mb-2 ${a.condition ? "text-yellow-600" : "text-gray-400"
                                    }`}
                            />
                            <h4 className="font-medium text-sm">{a.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{a.description}</p>
                            {a.condition && (
                                <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-yellow-100 border text-xs">
                                    Unlocked!
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
