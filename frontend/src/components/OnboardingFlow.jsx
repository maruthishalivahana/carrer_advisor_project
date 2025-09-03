import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    TextField,
    Chip,
    LinearProgress,
    Box,
    Grid,
    Paper
} from '@mui/material';
import { ArrowRight, Plus, X, Sparkles, Target, Brain, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const predefinedInterests = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Design',
    'Engineering', 'Business', 'Science', 'Arts', 'Environment', 'Sports'
];

const predefinedSkills = [
    'Programming', 'Communication', 'Leadership', 'Analytics', 'Creative Writing',
    'Public Speaking', 'Project Management', 'Problem Solving', 'Teamwork', 'Research'
];

const predefinedGoals = [
    'Get an internship', 'Land a full-time job', 'Switch careers', 'Learn new skills',
    'Get promoted', 'Start a business', 'Get certified', 'Build a portfolio'
];

export function OnboardingFlow({ onComplete }) {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState({
        interests: [],
        skills: [],
        goals: []
    });
    const [customInput, setCustomInput] = useState('');

    const totalSteps = 6;
    const progress = (step / totalSteps) * 100;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            onComplete(profile);
        }
    };

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1);
    };

    const addToArray = (field, value) => {
        if (value && !profile[field]?.includes(value)) {
            setProfile(prev => ({
                ...prev,
                [field]: [...(prev[field] || []), value]
            }));
            setCustomInput('');
        }
    };

    const removeFromArray = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: prev[field]?.filter(item => item !== value) || []
        }));
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return profile.name && profile.age;
            case 2: return profile.experience;
            case 3: return (profile.interests?.length || 0) >= 2;
            case 4: return (profile.skills?.length || 0) >= 2;
            case 5: return (profile.goals?.length || 0) >= 1;
            case 6: return true;
            default: return false;
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
            <Card sx={{ width: '100%', maxWidth: 700, borderRadius: 3, boxShadow: 4 }}>
                <CardHeader
                    title={
                        <Box textAlign="center">
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 1,
                                    background: 'linear-gradient(90deg, purple, black)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                CareerQuest AI ✨
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ borderRadius: 2, height: 8, backgroundColor: '#eee' }}
                            />
                            <Typography variant="body2" color="textSecondary" mt={1}>
                                Step {step} of {totalSteps}
                            </Typography>
                        </Box>
                    }
                />
                <CardContent>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Step 1 */}
                            {step === 1 && (
                                <Box>
                                    <Box display="flex" justifyContent="center" mb={2}>
                                        <User size={48} color="purple" />
                                    </Box>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Let's get to know you!
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="What's your name?"
                                        margin="normal"
                                        value={profile.name || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                                        sx={{ borderRadius: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="How old are you?"
                                        margin="normal"
                                        value={profile.age || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                                        sx={{ borderRadius: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Current role (optional)"
                                        margin="normal"
                                        value={profile.currentRole || ''}
                                        onChange={(e) => setProfile(prev => ({ ...prev, currentRole: e.target.value }))}
                                        sx={{ borderRadius: 0 }}
                                    />
                                </Box>
                            )}

                            {/* Step 2 */}
                            {step === 2 && (
                                <Box>
                                    <Box display="flex" justifyContent="center" mb={2}>
                                        <Target size={48} color="purple" />
                                    </Box>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        What's your experience level?
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {[
                                            'Complete beginner - Just starting out',
                                            'Some experience - 1-2 years',
                                            'Intermediate - 3-5 years',
                                            'Experienced - 5+ years',
                                            'Expert - 10+ years'
                                        ].map((option) => (
                                            <Grid item xs={12} key={option}>
                                                <Button
                                                    fullWidth
                                                    sx={{
                                                        borderRadius: 8,
                                                        py: 2,
                                                        bgcolor: profile.experience === option ? 'black' : 'transparent',
                                                        color: profile.experience === option ? 'white' : 'black',
                                                        borderColor: 'black'
                                                    }}
                                                    variant={profile.experience === option ? 'contained' : 'outlined'}
                                                    onClick={() => setProfile(prev => ({ ...prev, experience: option }))}
                                                >
                                                    {option}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {/* Step 3 */}
                            {step === 3 && (
                                <Box>
                                    <Box display="flex" justifyContent="center" mb={2}>
                                        <Brain size={48} color="purple" />
                                    </Box>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        What interests you? (Select at least 2)
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {predefinedInterests.map((interest) => (
                                            <Grid item key={interest}>
                                                <Button
                                                    sx={{
                                                        borderRadius: 2,
                                                        bgcolor: profile.interests?.includes(interest) ? 'black' : 'transparent',
                                                        color: profile.interests?.includes(interest) ? 'white' : 'black',
                                                        borderColor: 'black'
                                                    }}
                                                    variant={profile.interests?.includes(interest) ? 'contained' : 'outlined'}
                                                    onClick={() => {
                                                        if (profile.interests?.includes(interest)) {
                                                            removeFromArray('interests', interest);
                                                        } else {
                                                            addToArray('interests', interest);
                                                        }
                                                    }}
                                                >
                                                    {interest}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box display="flex" gap={1} mt={2}>
                                        <TextField
                                            fullWidth
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            placeholder="Add custom interest"
                                            sx={{ borderRadius: 2 }}
                                            onKeyPress={(e) => e.key === 'Enter' && addToArray('interests', customInput)}
                                        />
                                        <Button
                                            sx={{ borderRadius: 2, bgcolor: 'black', color: 'white' }}
                                            onClick={() => addToArray('interests', customInput)}
                                            disabled={!customInput}
                                        >
                                            <Plus size={18} />
                                        </Button>
                                    </Box>
                                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                        {profile.interests.map((interest) => (
                                            <Chip
                                                key={interest}
                                                label={interest}
                                                onDelete={() => removeFromArray('interests', interest)}
                                                sx={{ borderRadius: 2, bgcolor: '#f3f3f3' }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Step 4 */}
                            {step === 4 && (
                                <Box>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        What are your skills? (Select at least 2)
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {predefinedSkills.map((skill) => (
                                            <Grid item key={skill}>
                                                <Button
                                                    sx={{
                                                        borderRadius: 2,
                                                        bgcolor: profile.skills?.includes(skill) ? 'black' : 'transparent',
                                                        color: profile.skills?.includes(skill) ? 'white' : 'black',
                                                        borderColor: 'black'
                                                    }}
                                                    variant={profile.skills?.includes(skill) ? 'contained' : 'outlined'}
                                                    onClick={() => {
                                                        if (profile.skills?.includes(skill)) {
                                                            removeFromArray('skills', skill);
                                                        } else {
                                                            addToArray('skills', skill);
                                                        }
                                                    }}
                                                >
                                                    {skill}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box display="flex" gap={1} mt={2}>
                                        <TextField
                                            fullWidth
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            placeholder="Add custom skill"
                                            sx={{ borderRadius: 2 }}
                                            onKeyPress={(e) => e.key === 'Enter' && addToArray('skills', customInput)}
                                        />
                                        <Button
                                            sx={{ borderRadius: 2, bgcolor: 'black', color: 'white' }}
                                            onClick={() => addToArray('skills', customInput)}
                                            disabled={!customInput}
                                        >
                                            <Plus size={18} />
                                        </Button>
                                    </Box>
                                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                        {profile.skills.map((skill) => (
                                            <Chip
                                                key={skill}
                                                label={skill}
                                                onDelete={() => removeFromArray('skills', skill)}
                                                sx={{ borderRadius: 2, bgcolor: '#f3f3f3' }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Step 5 */}
                            {step === 5 && (
                                <Box>
                                    <Typography variant="h6" align="center" gutterBottom>
                                        What are your goals?
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {predefinedGoals.map((goal) => (
                                            <Grid item key={goal}>
                                                <Button
                                                    sx={{
                                                        borderRadius: 2,
                                                        bgcolor: profile.goals?.includes(goal) ? 'black' : 'transparent',
                                                        color: profile.goals?.includes(goal) ? 'white' : 'black',
                                                        borderColor: 'black'
                                                    }}
                                                    variant={profile.goals?.includes(goal) ? 'contained' : 'outlined'}
                                                    onClick={() => {
                                                        if (profile.goals?.includes(goal)) {
                                                            removeFromArray('goals', goal);
                                                        } else {
                                                            addToArray('goals', goal);
                                                        }
                                                    }}
                                                >
                                                    {goal}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box display="flex" gap={1} mt={2}>
                                        <TextField
                                            fullWidth
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            placeholder="Add custom goal"
                                            sx={{ borderRadius: 2 }}
                                            onKeyPress={(e) => e.key === 'Enter' && addToArray('goals', customInput)}
                                        />
                                        <Button
                                            sx={{ borderRadius: 2, bgcolor: 'black', color: 'white' }}
                                            onClick={() => addToArray('goals', customInput)}
                                            disabled={!customInput}
                                        >
                                            <Plus size={18} />
                                        </Button>
                                    </Box>
                                    <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                        {profile.goals.map((goal) => (
                                            <Chip
                                                key={goal}
                                                label={goal}
                                                onDelete={() => removeFromArray('goals', goal)}
                                                sx={{ borderRadius: 2, bgcolor: '#f3f3f3' }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Step 6 */}
                            {step === 6 && (
                                <Box textAlign="center">
                                    <Box display="flex" justifyContent="center" mb={2}>
                                        <Sparkles size={64} color="purple" />
                                    </Box>
                                    <Typography variant="h5" gutterBottom>
                                        You're all set, {profile.name}! 🎉
                                    </Typography>
                                    <Typography color="textSecondary" mb={3}>
                                        Our AI will now analyze your profile and create a personalized career roadmap just for you.
                                    </Typography>
                                    <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fafafa' }}>
                                        <Typography variant="body1"><b>Interests:</b> {profile.interests?.join(', ')}</Typography>
                                        <Typography variant="body1"><b>Skills:</b> {profile.skills?.join(', ')}</Typography>
                                        <Typography variant="body1"><b>Goals:</b> {profile.goals?.join(', ')}</Typography>
                                    </Paper>
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <Box display="flex" justifyContent="space-between" mt={4}>
                        <Button
                            variant="outlined"
                            onClick={handlePrevious}
                            disabled={step === 1}
                            sx={{ borderRadius: 2, borderColor: 'black', color: 'black' }}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            endIcon={<ArrowRight size={18} />}
                            sx={{ borderRadius: 2, bgcolor: 'black', color: 'white', px: 3 }}
                        >
                            {step === totalSteps ? 'Start Journey' : 'Next'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
