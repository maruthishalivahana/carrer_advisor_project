import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import {
    MessageCircle,
    Send,
    Bot,
    User,
    Lightbulb,
    Target,
    TrendingUp,
    BookOpen,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatInterface({ userProgress = { level: 1 } }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const scrollRef = useRef(null);

    // Quick action suggestions
    const quickActions = [
        { icon: Target, text: "What career paths match my interests?", category: "Career Exploration" },
        { icon: TrendingUp, text: "How can I improve my skills for my goals?", category: "Skill Development" },
        { icon: BookOpen, text: "What should I learn next?", category: "Learning Path" },
        { icon: Lightbulb, text: "Give me project ideas to build my portfolio", category: "Project Ideas" },
    ];

    // ✅ Clear chat when mounting (reset on back navigation)
    useEffect(() => {
        setMessages([]);
    }, []);

    // Fetch user profile from backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("https://career-advisor-backend-3yvuar6t5a-uc.a.run.app/user/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUserProfile(res.data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, []);

    // Initialize welcome message
    useEffect(() => {
        if (userProfile && messages.length === 0) {
            const interests = (userProfile.interests || []).slice(0, 2).join(" and ") || "various fields";
            const experience = userProfile.experience || "Beginner";
            const goal = (userProfile.goals || [])[0] || "explore opportunities";

            const welcomeMessage = {
                id: "welcome",
                type: "ai",
                content: `Hello ${userProfile.name}! 👋 I'm your AI Career Advisor. Based on your interests in ${interests}, your ${experience} experience level, and your goal to ${goal}, I can provide tailored advice. What would you like to discuss today?`,
                timestamp: new Date(),
                suggestions: [
                    "Show me career paths that match my profile",
                    "What skills should I focus on developing?",
                    "Help me create a learning roadmap",
                    "What projects should I work on?",
                ],
            };

            setMessages([welcomeMessage]);
        }
    }, [userProfile, messages.length]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Send message
    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            type: "user",
            content: message,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const { data } = await axios.post(
                `https://career-advisor-backend-3yvuar6t5a-uc.a.run.app/user/chatbot/${userProfile._id}`,
                { message },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const aiResponse = {
                id: Date.now().toString(),
                type: "ai",
                content: data.reply,
                timestamp: new Date(),
                suggestions: [
                    "Tell me more about this",
                    "What's the next step?",
                    "How long will this take?",
                    "Can you help me get started?",
                ],
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: "ai",
                    content: "⚠️ Sorry, something went wrong. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (action) => handleSendMessage(action);
    const handleSuggestionClick = (suggestion) => handleSendMessage(suggestion);

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-50 to-purple-50">
            {!userProfile ? (
                <div className="p-4">Loading user profile...</div>
            ) : (
                <>
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b p-4 bg-white shadow-sm">
                        <MessageCircle className="w-5 h-5 text-purple-600" />
                        <h2 className="font-semibold text-gray-800">AI Career Advisor</h2>
                        <span className="ml-auto px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
                            Level {userProgress.level}
                        </span>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.type === "ai" && (
                                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 shadow">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow ${message.type === "user"
                                            ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                                            : "bg-white border text-gray-800"
                                            }`}
                                    >
                                        <div className="prose prose-sm max-w-none">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                        {message.suggestions && (
                                            <div className="mt-3 space-y-1">
                                                <div className="text-xs opacity-70">Suggested responses:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {message.suggestions.map((suggestion, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="text-xs border rounded-full px-3 py-1 hover:bg-gray-100 transition"
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {message.type === "user" && (
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white border rounded-2xl px-4 py-3 flex gap-1 shadow">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0ms]" />
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:150ms]" />
                                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:300ms]" />
                                </div>
                            </motion.div>
                        )}

                        <div ref={scrollRef} />
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 1 && (
                        <div className="p-4 border-t bg-gray-50 shadow-inner">
                            <div className="text-sm text-gray-500 mb-3">Quick actions to get started:</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickAction(action.text)}
                                            className="flex items-start gap-2 border rounded-lg p-3 hover:bg-gray-100 bg-white shadow-sm transition"
                                        >
                                            <Icon className="w-4 h-4 mt-0.5 text-purple-600" />
                                            <div>
                                                <div className="text-xs text-gray-500">{action.category}</div>
                                                <div className="text-sm font-medium">{action.text}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Input (Sticky at bottom) */}
                    <div className="p-4 border-t bg-white shadow sticky bottom-0">
                        <div className="flex gap-2">
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask me anything about your career..."
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(inputValue);
                                    }
                                }}
                                disabled={isLoading}
                                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                            />
                            <button
                                onClick={() => handleSendMessage(inputValue)}
                                disabled={!inputValue.trim() || isLoading}
                                className="p-2 rounded-full bg-purple-600 text-white disabled:opacity-50 shadow"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            AI responses are generated based on your profile and goals
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
