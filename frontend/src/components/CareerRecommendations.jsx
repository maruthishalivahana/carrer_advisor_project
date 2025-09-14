import React, { useState } from "react";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  MapPin,
  Clock,
  Star,
  ExternalLink,
  Target,
  Building,
  GraduationCap,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";

export function CareerRecommendations({ userProfile }) {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [activeTab, setActiveTab] = useState("recommendations");

  // Fallbacks for safety
  const safeSkills = Array.isArray(userProfile?.skills)
    ? userProfile.skills
    : [];
  const safeInterests = Array.isArray(userProfile?.interests)
    ? userProfile.interests
    : [];

  function calculateMatchScore(careerKeywords, userInterests, userSkills) {
    const allUserTerms = [...userInterests, ...userSkills].map((t) =>
      t.toLowerCase()
    );
    const careerTerms = careerKeywords.map((t) => t.toLowerCase());
    const matches = careerTerms.filter((term) =>
      allUserTerms.some(
        (userTerm) => userTerm.includes(term) || term.includes(userTerm)
      )
    );
    return Math.min(
      95,
      (matches.length / careerTerms.length) * 100 + Math.random() * 10
    );
  }

  const careerPaths = [
    {
      id: "software-engineer",
      title: "Software Engineer",
      description:
        "Design, develop, and maintain software applications and systems",
      matchScore: calculateMatchScore(
        ["Technology", "Programming", "Problem Solving"],
        safeInterests,
        safeSkills
      ),
      salaryRange: "$70,000 - $150,000",
      growthRate: "+25% (Much faster than average)",
      requiredSkills: [
        "Programming",
        "Problem Solving",
        "Algorithms",
        "Software Design",
      ],
      missingSkills: ["Algorithms", "System Design"].filter(
        (s) => !safeSkills.includes(s)
      ),
      industries: ["Technology", "Finance", "Healthcare", "Entertainment"],
      education: "Bachelor's degree in Computer Science or related field",
      experience: "Entry to Senior level positions available",
      locations: ["San Francisco", "Seattle", "New York", "Austin", "Remote"],
      jobOutlook: "excellent",
      relatedRoles: [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "DevOps Engineer",
      ],
    },
    {
      id: "product-manager",
      title: "Product Manager",
      description:
        "Guide the success of products and lead cross-functional teams",
      matchScore: calculateMatchScore(
        ["Business", "Technology", "Leadership", "Communication"],
        safeInterests,
        safeSkills
      ),
      salaryRange: "$90,000 - $180,000",
      growthRate: "+20% (Much faster than average)",
      requiredSkills: [
        "Leadership",
        "Communication",
        "Analytics",
        "Project Management",
      ],
      missingSkills: ["Product Strategy", "Market Research"].filter(
        (s) => !safeSkills.includes(s)
      ),
      industries: ["Technology", "E-commerce", "Finance", "Healthcare"],
      education: "Bachelor's degree in Business, Engineering, or related field",
      experience: "2-5 years experience preferred",
      locations: ["San Francisco", "New York", "Los Angeles", "Boston", "Remote"],
      jobOutlook: "excellent",
      relatedRoles: [
        "Product Owner",
        "Program Manager",
        "Business Analyst",
        "Strategy Consultant",
      ],
    },
  ].sort((a, b) => b.matchScore - a.matchScore);

  const mockJobs = [
    {
      title: "Junior Software Engineer",
      company: "TechStart Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$85,000 - $110,000",
      posted: "2 days ago",
    },
    {
      title: "Product Manager Intern",
      company: "Innovation Labs",
      location: "Seattle, WA",
      type: "Internship",
      salary: "$25/hour",
      posted: "1 week ago",
    },
  ];

  const mockUniversities = [
    {
      name: "Stanford University",
      location: "Stanford, CA",
      programs: ["Computer Science", "Business", "Engineering"],
      ranking: 1,
      admissionRate: "4%",
    },
    {
      name: "MIT",
      location: "Cambridge, MA",
      programs: ["Computer Science", "Engineering", "Business"],
      ranking: 2,
      admissionRate: "7%",
    },
  ];

  const getOutlookColor = (outlook) => {
    switch (outlook) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "fair":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl flex items-center justify-center gap-2">
          <Briefcase className="w-8 h-8 text-purple-600" />
          Career Recommendations
        </h1>
        <p className="text-gray-500">
          AI-powered career paths tailored to your interests, skills, and goals
        </p>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="grid grid-cols-4 border rounded-lg overflow-hidden">
          {[
            { id: "recommendations", label: "Career Paths" },
            { id: "jobs", label: "Job Opportunities" },
            { id: "universities", label: "Universities" },
            { id: "certifications", label: "Certifications" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition ${activeTab === tab.id
                ? "bg-black text-white"
                : "bg-gray-50 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Career Paths */}
        {activeTab === "recommendations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {careerPaths.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition ${selectedCareer === career.id ? "ring-2 ring-purple-500" : ""
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold">
                      {career.title}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getOutlookColor(
                          career.jobOutlook
                        )}`}
                      >
                        {career.jobOutlook} outlook
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      {career.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(career.matchScore)}%
                    </div>
                    <div className="text-xs text-gray-500">Match</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black"
                    style={{ width: `${career.matchScore}%` }}
                  ></div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    {career.salaryRange}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    {career.growthRate}
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Required Skills</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {career.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${safeSkills.includes(skill)
                          ? "bg-black text-white"
                          : "bg-gray-50 text-gray-700"
                          }`}
                      >
                        {safeSkills.includes(skill) && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {career.missingSkills.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium">Skills to Develop</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border flex items-center gap-1"
                        >
                          <Target className="w-3 h-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() =>
                      setSelectedCareer(
                        selectedCareer === career.id ? null : career.id
                      )
                    }
                    className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100"
                  >
                    {selectedCareer === career.id ? "Less Info" : "More Info"}
                  </button>
                  <button className="px-3 py-1.5 bg-black text-white rounded-md text-sm flex items-center gap-1">
                    Create Roadmap
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {selectedCareer === career.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-3 border-t text-sm space-y-3"
                  >
                    <div>
                      <h5 className="font-medium">Education Requirements</h5>
                      <p className="text-gray-500">{career.education}</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Top Industries</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {career.industries.map((ind) => (
                          <span
                            key={ind}
                            className="text-xs px-2 py-0.5 rounded-full border flex items-center gap-1"
                          >
                            <Building className="w-3 h-3" />
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Jobs */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {mockJobs.map((job, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <div className="flex gap-4 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-xs px-2 py-0.5 border rounded-full mb-2">
                      {job.posted}
                    </span>
                    <button className="px-3 py-1.5 bg-black text-white text-sm rounded-md flex items-center gap-1">
                      Apply <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Universities */}
        {activeTab === "universities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockUniversities.map((uni, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{uni.name}</h4>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                    #{uni.ranking}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{uni.location}</p>
                <div className="mt-2">
                  <h5 className="text-sm font-medium">Programs</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {uni.programs.map((prog) => (
                      <span
                        key={prog}
                        className="text-xs px-2 py-0.5 border rounded-full"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-2">
                  Admission Rate: {uni.admissionRate}
                </p>
                <button className="mt-3 w-full px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {activeTab === "certifications" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "AWS Certified Solutions Architect",
                provider: "Amazon Web Services",
                duration: "3-6 months",
                difficulty: "Intermediate",
                cost: "$150",
                skills: ["Cloud Computing", "System Architecture"],
              },
              {
                name: "Google Data Analytics Certificate",
                provider: "Google",
                duration: "6 months",
                difficulty: "Beginner",
                cost: "$49/month",
                skills: ["Data Analysis", "SQL", "Tableau"],
              },
            ].map((cert, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <h4 className="font-medium">{cert.name}</h4>
                <p className="text-sm text-gray-500">{cert.provider}</p>
                <div className="text-sm mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Duration:</span> <span>{cert.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className="text-xs px-2 py-0.5 border rounded-full">
                      {cert.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span> <span>{cert.cost}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <h5 className="text-sm font-medium">Skills Covered</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cert.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs px-2 py-0.5 border rounded-full bg-gray-50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="mt-3 w-full px-3 py-1.5 bg-black text-white text-sm rounded-md">
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
