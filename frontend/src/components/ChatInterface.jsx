import React, { useState, useRef, useEffect } from "react";
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

export function ChatInterface({
    userProfile = {
        name: "User",
        interests: [],
        skills: [],
        goals: [],
        experience: "Beginner",
    },
    userProgress = { level: 1 },
}) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Quick action suggestions
    const quickActions = [
        { icon: Target, text: "What career paths match my interests?", category: "Career Exploration" },
        { icon: TrendingUp, text: "How can I improve my skills for my goals?", category: "Skill Development" },
        { icon: BookOpen, text: "What should I learn next?", category: "Learning Path" },
        { icon: Lightbulb, text: "Give me project ideas to build my portfolio", category: "Project Ideas" },
    ];

    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMessage = {
                id: "welcome",
                type: "ai",
                content: `Hello ${userProfile.name}! 👋 I'm your AI Career Advisor. I've analyzed your profile and I'm here to help with personalized career guidance. 

Based on your interests in ${userProfile.interests.slice(0, 2).join(" and ")}, your ${userProfile.experience} experience level, and your goal to ${userProfile.goals[0] || "explore opportunities"}, I can provide tailored advice.

What would you like to discuss today?`,
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

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const generateAIResponse = (userMessage) => {
        return {
            id: Date.now().toString(),
            type: "ai",
            content: `I understand you're asking about "${userMessage}". Given your profile in ${userProfile.experience} and interests in ${userProfile.interests[0] || "various fields"}, I can help guide you towards your goal of "${userProfile.goals[0] || "career growth"}".`,
            timestamp: new Date(),
            suggestions: [
                "Tell me more about this",
                "What's the next step?",
                "How long will this take?",
                "Can you help me get started?",
            ],
        };
    };

    const handleSendMessage = (message) => {
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

        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            setMessages((prev) => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1200);
    };

    const handleQuickAction = (action) => handleSendMessage(action);
    const handleSuggestionClick = (suggestion) => handleSendMessage(suggestion);

    return (
        <div className="h-screen w-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center gap-2 border-b p-4">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <h2 className="font-medium">AI Career Advisor</h2>
                <span className="ml-auto px-2 py-1 text-xs bg-gray-100 rounded">
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
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}

                            <div className={`max-w-[70%] rounded-lg p-3 ${message.type === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                                <div className="whitespace-pre-wrap">{message.content}</div>

                                {message.suggestions && (
                                    <div className="mt-3 space-y-2">
                                        <div className="text-xs opacity-70">Suggested responses:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {message.suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {message.type === "user" && (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 flex gap-1">
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
                <div className="p-4 border-t bg-gray-50">
                    <div className="text-sm text-gray-500 mb-3">Quick actions to get started:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleQuickAction(action.text)}
                                    className="flex items-start gap-2 border rounded-lg p-3 hover:bg-gray-100 text-left"
                                >
                                    <Icon className="w-4 h-4 mt-0.5 text-gray-600" />
                                    <div>
                                        <div className="text-xs text-gray-500">{action.category}</div>
                                        <div className="text-sm">{action.text}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
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
                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                    <button
                        onClick={() => handleSendMessage(inputValue)}
                        disabled={!inputValue.trim() || isLoading}
                        className="p-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI responses are generated based on your profile and goals
                </div>
            </div>
        </div>
    );
}
