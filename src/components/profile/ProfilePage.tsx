import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Plus,
  X,
  Check,
  Save,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ExperienceLevel } from '../../types/career';
import { NavView } from '../layout/Sidebar';

interface ProfilePageProps {
  onNavigate: (view: NavView) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile, setTargetRole } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [education, setEducation] = useState(user?.education || 'Bachelor of Science');
  const [degree, setDegree] = useState(user?.degree || 'Computer Science & Engineering');
  const [specialization, setSpecialization] = useState(user?.specialization || 'Software Engineering');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '2025');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    (user?.experienceLevel as ExperienceLevel) || 'Fresher'
  );

  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const [targetRole, setTargetRoleState] = useState(user?.targetRole || 'Data Engineer');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  const handleSave = async (rerunAI: boolean = false) => {
    setSaving(true);
    setSavedSuccess(false);

    const updatedData = {
      name,
      education,
      degree,
      specialization,
      graduationYear,
      experienceLevel,
      skills,
      interests,
      targetRole,
    };

    const success = await updateProfile(updatedData);
    if (success) {
      await setTargetRole(targetRole);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);

      if (rerunAI) {
        try {
          await fetch('/api/ai/recommend-careers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('cc_auth_token')}`,
            },
            body: JSON.stringify({ profile: updatedData }),
          });
          await fetch('/api/ai/skill-gap', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('cc_auth_token')}`,
            },
            body: JSON.stringify({
              targetRole,
              userSkills: skills,
              experienceLevel,
            }),
          });
          onNavigate('recommendations');
        } catch (err) {
          console.error(err);
        }
      }
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Profile & Competencies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Profile & Skills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep your skills and academic milestones updated to continuously refine your AI career matching and skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-2"
          >
            {saving ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Personal & Academic Background
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Target Career
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRoleState(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Degree & Discipline
            </label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Specialization
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Graduation Year
            </label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Experience Level
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
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
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

      {/* Skills Management */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Skills Inventory ({skills.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Type custom skills to immediately reflect in your skill gap analysis.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(newSkill);
              }
            }}
            placeholder="Type skill name and press Enter (e.g. PySpark, Terraform, Kubernetes)..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => handleAddSkill(newSkill)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Interests Management */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Career Interests ({interests.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Domains used by our model to recommend high-cross-compatibility roles.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddInterest(newInterest);
              }
            }}
            placeholder="Type interest area and press Enter..."
            className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => handleAddInterest(newInterest)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {interests.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium text-indigo-700 dark:text-indigo-300"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(item)}
                className="text-indigo-400 hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Trigger Re-Analysis Action */}
      <div className="p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Re-run AI Analysis with Updated Skills
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Recalculate role match percentages, skill gap matrices, and personalized roadmap phases.
          </p>
        </div>

        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Save & Re-Analyze</span>
        </button>
      </div>
    </div>
  );
};
