import React, { useState, useEffect } from "react";
import {
    User,
    Edit3,
    Plus,
    X,
    Calendar,
    Briefcase,
    Target,
    Brain,
    Award,
    Settings,
    Download,
    Trash2,
    Save,
    AlertTriangle,
    CheckCircle2,
    Star,
    Trophy,
    Flame,
    BookOpen,
    TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

// Predefined values
const predefinedInterests = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Design",
    "Engineering",
    "Business",
    "Science",
    "Arts",
    "Environment",
    "Sports",
    "Gaming",
    "Travel",
    "Music",
    "Writing",
    "Photography",
    "Cooking",
];

const predefinedSkills = [
    "Programming",
    "Communication",
    "Leadership",
    "Analytics",
    "Creative Writing",
    "Public Speaking",
    "Project Management",
    "Problem Solving",
    "Teamwork",
    "Research",
    "Data Analysis",
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Marketing",
    "Sales",
    "Customer Service",
    "Teaching",
    "Consulting",
    "Negotiation",
];

const predefinedGoals = [
    "Get an internship",
    "Land a full-time job",
    "Switch careers",
    "Learn new skills",
    "Get promoted",
    "Start a business",
    "Get certified",
    "Build a portfolio",
    "Network with professionals",
    "Improve salary",
    "Work remotely",
    "Lead a team",
];

export function UserProfile({
    userProfile = {
        name: "",
        age: "",
        gender: "",
        currentRole: "",
        experience: "",
        interests: [],
        skills: [],
        goals: [],
    },
    userProgress = {
        level: 1,
        xp: 0,
        streak: 0,
        badges: [],
        completedTasks: [],
    },
    onUpdateProfile = () => { },
    onResetProfile = () => { },
}) {
    const [editMode, setEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState(userProfile);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // Fetch user from API and map into local profile shape
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("https://career-advisor-backend-46920913764.us-central1.run.app/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const apiUser = res.data; // { fullname, onboarding: { age, currentRole, experience, interests, skills, goals, gender? } }

                const mappedProfile = {
                    name: apiUser.fullname || "",
                    age: apiUser?.onboarding?.age ?? "",
                    gender: apiUser?.onboarding?.gender ?? "",
                    currentRole: apiUser?.onboarding?.currentRole || "",
                    experience: apiUser?.onboarding?.experience || "",
                    interests: apiUser?.onboarding?.interests || [],
                    skills: apiUser?.onboarding?.skills || [],
                    goals: apiUser?.onboarding?.goals || [],
                };

                setEditedProfile(mappedProfile);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load user profile");
                setLoading(false);
            }
        };

        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const effectiveProfile = editedProfile;
    const [customInput, setCustomInput] = useState("");
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Profile Completion
    function calculateProfileCompletion(profile) {
        let score = 0;
        if (profile.name) score += 10;
        if (profile.age) score += 10;
        if (profile.currentRole) score += 10;
        if (profile.experience) score += 10;
        if (profile.interests?.length >= 2) score += 10;
        if (profile.interests?.length >= 5) score += 10;
        if (profile.skills?.length >= 2) score += 10;
        if (profile.skills?.length >= 5) score += 10;
        if (profile.goals?.length >= 1) score += 10;
        if (profile.goals?.length >= 3) score += 10;
        return score;
    }

    const profileCompletionScore = calculateProfileCompletion(effectiveProfile);

    // Handlers
    const handleSaveProfile = () => {
        onUpdateProfile(editedProfile);
        setEditMode(false);
        toast.success("Profile updated successfully! 🎉");
    };

    const handleCancelEdit = () => {
        setEditedProfile(effectiveProfile);
        setEditMode(false);
    };

    const addToArray = (field, value) => {
        if (value && !editedProfile[field].includes(value)) {
            setEditedProfile((prev) => ({
                ...prev,
                [field]: [...prev[field], value],
            }));
            setCustomInput("");
        }
    };

    const removeFromArray = (field, value) => {
        setEditedProfile((prev) => ({
            ...prev,
            [field]: prev[field].filter((item) => item !== value),
        }));
    };

    const handleExportProfile = () => {
        const data = {
            profile: userProfile,
            progress: userProgress,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `careerquest-profile-${userProfile.name
            .toLowerCase()
            .replace(/\s+/g, "-")}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Profile exported successfully!");
    };

    const handleResetProfile = () => {
        onResetProfile();
        setShowResetDialog(false);
        toast.success("Profile reset successfully. Please complete onboarding again.");
    };

    const getCompletionColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getInitials = (name) =>
        name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const stats = [
        { label: "Current Level", value: userProgress.level, icon: Star, color: "text-purple-600" },
        { label: "Total XP", value: userProgress.xp, icon: TrendingUp, color: "text-blue-600" },
        { label: "Day Streak", value: userProgress.streak, icon: Flame, color: "text-orange-600" },
        { label: "Badges Earned", value: userProgress.badges?.length || 0, icon: Trophy, color: "text-yellow-600" },
        { label: "Tasks Completed", value: userProgress.completedTasks?.length || 0, icon: CheckCircle2, color: "text-green-600" },
        { label: "Profile Score", value: `${profileCompletionScore}%`, icon: Award, color: getCompletionColor(profileCompletionScore) },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl flex items-center justify-center gap-2">
                    <User className="w-8 h-8 text-purple-600" /> Your Profile
                </h1>
                <p className="text-gray-500">Manage your career profile and track your journey</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex">
                {["overview", "details", "settings"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 -mb-px text-sm font-medium border-b-2 ${activeTab === tab ? "border-black text-black" : "border-transparent text-gray-500"
                            }`}
                    >
                        {tab === "overview" && "Overview"}
                        {tab === "details" && "Edit Details"}
                        {tab === "settings" && "Settings"}
                    </button>
                ))}
            </div>

            {/* Loading / Error */}
            {loading && (
                <div className="text-center text-gray-500 py-6">Loading profile...</div>
            )}
            {error && !loading && (
                <div className="text-center text-red-600 py-6">{error}</div>
            )}

            {/* Overview Tab */}
            {activeTab === "overview" && !loading && !error && (
                <div className="space-y-6">
                    {/* Profile Header */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold">
                                {getInitials(effectiveProfile.name || "U")}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl mb-1">{effectiveProfile.name || "Unnamed"}</h2>
                                        <p className="text-gray-500 mb-2">
                                            {effectiveProfile.currentRole || "Career Explorer"} • {effectiveProfile.age || "?"} years old{effectiveProfile.gender ? ` • ${effectiveProfile.gender}` : ""}
                                        </p>
                                        <span className="px-2 py-1 text-xs border rounded">{effectiveProfile.experience || "N/A"}</span>
                                    </div>
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="px-3 py-1.5 rounded-md text-sm bg-black text-white flex items-center gap-1"
                                    >
                                        <Edit3 className="w-4 h-4" /> Edit Profile
                                    </button>
                                </div>

                                {/* Progress */}
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Profile Completion</span>
                                        <span className={`font-medium ${getCompletionColor(profileCompletionScore)}`}>
                                            {profileCompletionScore}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black transition-all"
                                            style={{ width: `${profileCompletionScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white border rounded-xl p-4 text-center shadow-sm"
                                >
                                    <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                                    <div className="text-2xl font-medium">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Details & Settings tabs ... */}
            {/* You can continue this same Tailwind refactor for "details" and "settings" sections */}
        </div>
    );
}
