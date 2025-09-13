const express = require('express')
const { User } = require("../models/user.model");
const app = express();

const onBoarding = async (req, res) => {
    try {
        const { age, currentRole, experience, interests, skills, goals } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Ensure onboarding exists
        if (!user.onboarding) user.onboarding = {};

        // Update onboarding fields
        user.onboarding.age = age ?? user.onboarding.age;
        user.onboarding.currentRole = currentRole ?? user.onboarding.currentRole;
        user.onboarding.experience = experience ?? user.onboarding.experience;
        user.onboarding.interests = interests ?? user.onboarding.interests;
        user.onboarding.skills = skills ?? user.onboarding.skills;
        user.onboarding.goals = goals ?? user.onboarding.goals;

        // Mark as onboarded if main fields filled
        user.onboarding.isOnboarded =
            !!(user.onboarding.age &&
                user.onboarding.currentRole &&
                user.onboarding.experience &&
                user.onboarding.skills.length > 0);

        await user.save();

        res.status(200).json({
            message: "Onboarding data saved successfully",
            onboardingCompleted: user.onboarding.isOnboarded,
            onboarding: user.onboarding,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    onBoarding
}