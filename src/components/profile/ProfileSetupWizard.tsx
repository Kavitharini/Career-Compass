import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Plus,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Compass,
  Search,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ExperienceLevel } from '../../types/career';
import { LoadingState } from '../common/LoadingState';

interface ProfileSetupWizardProps {
  onComplete: () => void;
}

export const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({ onComplete }) => {
  const { user, updateProfile, setTargetRole } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [analyzing, setAnalyzing] = useState(false);

  // Step 1: Basic Info (starts fresh and empty for new users)
  const [name, setName] = useState(user?.name || '');
  const [education, setEducation] = useState(user?.education || '');
  const [degree, setDegree] = useState(user?.degree || '');
  const [specialization, setSpecialization] = useState(user?.specialization || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>(
    (user?.experienceLevel as ExperienceLevel) || ''
  );

  // Step 2: Skills (starts strictly empty for fresh user selection)
  const [skills, setSkills] = useState<string[]>(
    user?.skills && user.skills.length > 0 ? user.skills : []
  );
  const [skillInput, setSkillInput] = useState('');
  const [skillSearch, setSkillSearch] = useState('');

  const suggestedSkills = [
    'Python',
    'SQL',
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Java',
    'C++',
    'Machine Learning',
    'Deep Learning',
    'Data Analysis',
    'NLP',
    'Git',
    'Docker',
    'REST APIs',
    'PostgreSQL',
    'MongoDB',
    'AWS',
    'Communication',
    'Leadership',
    'Problem Solving',
  ];

  // Step 3: Interests (starts strictly empty for fresh user selection)
  const [interests, setInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0 ? user.interests : []
  );
  const [interestInput, setInterestInput] = useState('');

  const suggestedInterests = [
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Software Development',
    'Web Development',
    'Data Engineering',
    'Cloud Computing',
    'Cybersecurity',
    'NLP',
    'UI/UX Design',
    'Product Management',
    'DevOps',
    'Mobile App Development',
  ];

  // Step 4: Preferences (clean defaults)
  const [preferredIndustry, setPreferredIndustry] = useState(
    user?.careerPreferences?.preferredIndustry || ''
  );
  const [preferredWorkType, setPreferredWorkType] = useState(
    user?.careerPreferences?.preferredWorkType || 'Full-time'
  );
  const [preferredLocation, setPreferredLocation] = useState(
    user?.careerPreferences?.preferredLocation || ''
  );
  const [remotePreference, setRemotePreference] = useState(
    user?.careerPreferences?.remotePreference || 'Hybrid'
  );
  const [preferredJobLevel, setPreferredJobLevel] = useState(
    user?.careerPreferences?.preferredJobLevel || 'Entry Level'
  );

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleToggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleAddCustomInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setInterestInput('');
  };

  const handleCompleteAndAnalyze = async () => {
    setAnalyzing(true);

    const profileData = {
      name,
      education,
      degree,
      specialization,
      graduationYear,
      experienceLevel,
      skills,
      interests,
      careerPreferences: {
        preferredIndustry,
        preferredWorkType,
        preferredLocation,
        remotePreference,
        preferredJobLevel,
      },
    };

    // Save profile to database
    await updateProfile(profileData);

    try {
      // Call AI to recommend careers
      const res = await fetch('/api/ai/recommend-careers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cc_auth_token')}`,
        },
        body: JSON.stringify({ profile: profileData }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recommendations && data.recommendations.length > 0) {
          const topRole = data.recommendations[0].jobTitle;
          await setTargetRole(topRole);
          // Pre-fetch skill gap for top role
          await fetch('/api/ai/skill-gap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('cc_auth_token')}`,
            },
            body: JSON.stringify({
              targetRole: topRole,
              userSkills: skills,
              experienceLevel,
            }),
          });
        }
      }
    } catch (err) {
      console.error('Error during AI analysis:', err);
    } finally {
      setAnalyzing(false);
      onComplete();
    }
  };

  if (analyzing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <LoadingState
          title="Analyzing your profile with AI..."
          subtitle="Matching your skills, interests, and degree with optimal industry roles and generating custom skill gaps."
          messages={[
            'Evaluating technical skills and core strengths...',
            'Connecting interest pathways with current market hiring demand...',
            'Synthesizing top career role recommendations...',
            'Calculating compatibility estimates...',
            'Structuring personalized learning milestones...',
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header with Brand and Theme Toggle */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">Career Compass</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Profile Calibration</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Step {step} of 4
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Technical & Core Skills'}
            {step === 3 && 'Career Interests'}
            {step === 4 && 'Work Preferences'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i <= step ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tell us about your background
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Your education and current career stage help our AI calibrate role expectations realistically.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Education Level <span className="text-rose-500">*</span>
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">Select your education level...</option>
                  <option value="Bachelor of Science">Bachelor's Degree (B.S. / B.Tech / B.E.)</option>
                  <option value="Master of Science">Master's Degree (M.S. / M.Tech / MBA)</option>
                  <option value="Associate Degree">Associate Degree / Diploma</option>
                  <option value="Bootcamp Graduate">Bootcamp Graduate / Self-Taught</option>
                  <option value="High School">High School Student</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Degree / Major <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specialization / Focus Area
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. AI, Software Systems, Data"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Graduation Year
                </label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">Select graduation year...</option>
                  <option value="2028">2028</option>
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022 or earlier</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Experience Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['Student', 'Fresher', '0–1 Years', '1–3 Years', '3+ Years'] as ExperienceLevel[]).map(
                  (lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                        experienceLevel === lvl
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {!education || !degree.trim() || !experienceLevel ? (
                <span>Please select your education level, degree, and experience level to proceed.</span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">All required fields filled ✓</span>
              )}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!education || !degree.trim() || !experienceLevel}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next: Add Skills</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Select or type your skills
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Add programming languages, frameworks, databases, tools, or core soft skills. You are not limited to predefined items.
            </p>
          </div>

          {/* Custom skill add input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                }
              }}
              placeholder="Type any custom skill (e.g. PySpark, Figma, Spring Boot) and press Enter"
              className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(skillInput)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Selected skills block */}
          <div className="mb-6 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your Selected Skills ({skills.length})
              </span>
              {skills.length > 0 && (
                <button
                  onClick={() => setSkills([])}
                  className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {skills.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
                No skills added yet. Select from suggestions below or type custom skills above.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Suggested skills filter & list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Suggested Skills
              </span>
              <div className="relative w-40">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter suggestions..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {suggestedSkills
                .filter(
                  (s) =>
                    !skills.includes(s) &&
                    s.toLowerCase().includes(skillSearch.toLowerCase())
                )
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={skills.length === 0}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>Next: Career Interests</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Select your career interests
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select domain areas that excite you. Multiple selections help our engine find high-crossover roles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-6">
            {suggestedInterests.map((interest) => {
              const isSelected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleToggleInterest(interest)}
                  className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-medium ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <span>{interest}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Add custom interest */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomInterest();
                }
              }}
              placeholder="Add another custom interest area..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddCustomInterest}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Add
            </button>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={interests.length === 0}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>Next: Work Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Career Preferences */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Work & Job Preferences (Optional)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tell us how and where you'd like to work to hone in on suitable industry tracks.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Industry
              </label>
              <input
                type="text"
                value={preferredIndustry}
                onChange={(e) => setPreferredIndustry(e.target.value)}
                placeholder="e.g. Technology, Fintech, Healthcare AI, E-Commerce"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Type
                </label>
                <select
                  value={preferredWorkType}
                  onChange={(e) => setPreferredWorkType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract / Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workplace Mode
                </label>
                <select
                  value={remotePreference}
                  onChange={(e) => setRemotePreference(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Job Level
                </label>
                <select
                  value={preferredJobLevel}
                  onChange={(e) => setPreferredJobLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Entry Level">Entry Level / Graduate</option>
                  <option value="Associate">Associate (1-2 yrs)</option>
                  <option value="Mid Level">Mid Level</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Location
              </label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                placeholder="e.g. San Francisco, New York, London, or Anywhere (Remote)"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleCompleteAndAnalyze}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Profile with AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
