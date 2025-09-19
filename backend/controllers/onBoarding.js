// const express = require('express')
// const { User } = require("../models/user.model");
// const { generateAIRoadmap } = require("./roadmap")
// const app = express();

// const onBoarding = async (req, res) => {
//     try {
//         const { age, currentRole, experience, interests, skills, goals } = req.body;

//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         // ✅ Ensure onboarding exists
//         if (!user.onboarding) user.onboarding = {};

//         // Update onboarding fields
//         user.onboarding.age = age ?? user.onboarding.age;
//         user.onboarding.currentRole = currentRole ?? user.onboarding.currentRole;
//         user.onboarding.experience = experience ?? user.onboarding.experience;
//         user.onboarding.interests = interests ?? user.onboarding.interests;
//         user.onboarding.skills = skills ?? user.onboarding.skills;
//         user.onboarding.goals = goals ?? user.onboarding.goals;

//         // Mark as onboarded if main fields filled
//         user.onboarding.isOnboarded =
//             !!(user.onboarding.age &&
//                 user.onboarding.currentRole &&
//                 user.onboarding.experience &&
//                 user.onboarding.skills.length > 0);

//         await user.save();

//         res.status(200).json({
//             message: "Onboarding data saved successfully",
//             onboardingCompleted: user.onboarding.isOnboarded,
//             user
//         });
//         // Generate AI roadmap automatically
//         const { generateAIRoadmap } = require('./roadmap.controller');
//         // simulate req.params for roadmap generator
//         req.params.id = user._id;
//         const aiRoadmap = await generateAIRoadmap(req, res);  // call function
//         // Or just await AI generation without sending response
//         res.status(200).json({ user, roadmap: aiRoadmap });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// module.exports = {
//     onBoarding
// }



const express = require('express');
const { User } = require("../models/user.model");

const onBoarding = async (req, res) => {
    try {
        const { age, currentRole, experience, interests, skills, goals } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Ensure onboarding exists
        if (!user.onboarding) user.onboarding = {};

        // Update onboarding fields
        user.onboarding.age = age ?? user.onboarding.age;
        user.onboarding.currentRole = currentRole ?? user.onboarding.currentRole;
        user.onboarding.experience = experience ?? user.onboarding.experience;
        user.onboarding.interests = interests ?? user.onboarding.interests;
        user.onboarding.skills = skills ?? user.onboarding.skills;
        user.onboarding.goals = goals ?? user.onboarding.goals;

        // Mark as onboarded
        user.onboarding.isOnboarded =
            !!(user.onboarding.age &&
                user.onboarding.currentRole &&
                user.onboarding.experience &&
                user.onboarding.skills?.length > 0);

        await user.save();

        // Roadmap generation is a separate step via POST /user/roadmap
        res.status(200).json({
            message: "Onboarding data saved successfully",
            user
        });


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    onBoarding
};
