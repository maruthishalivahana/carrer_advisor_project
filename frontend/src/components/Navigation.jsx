import React from "react";
import {
  Home,
  MessageCircle,
  Map,
  Briefcase,
  Trophy,
  Flame,
  Star,
  Sparkles,
  User,
} from "lucide-react";

export function Navigation({ currentScreen, onScreenChange, userProgress }) {
  // Ensure safe values even if userProgress is undefined
  const xp = Number(userProgress?.xp || 0);
  const level = Number(userProgress?.level || 1);
  const streak = Number(userProgress?.streak || 0);
  const badges = Array.isArray(userProgress?.badges)
    ? userProgress.badges.length
    : 0;

  const xpToNextLevel = 1000 - (xp % 1000);
  const levelProgress = ((xp % 1000) / 1000) * 100;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "careers", label: "Careers", icon: Briefcase },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-lg font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CareerQuest
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onScreenChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition
                    ${isActive
                      ? "bg-black text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Progress */}
          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1 text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="hidden sm:inline">{streak}</span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border border-gray-300">
                {badges}
              </span>
            </div>

            {/* Level and XP */}
            <div className="flex items-center gap-2">
              <div className="text-right text-sm hidden sm:block">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span>Level {level}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {xpToNextLevel} XP to next level
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-16 hidden sm:block">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Mobile Level Display */}
            <div className="flex items-center gap-1 sm:hidden">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="text-sm">{level}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
