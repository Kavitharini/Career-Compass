import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Target,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { JobRoleRecommendation } from '../../types/career';
import { useAuth } from '../../context/AuthContext';
import { NavView } from '../layout/Sidebar';

interface JobRoleDetailPageProps {
  role: JobRoleRecommendation;
  onBack: () => void;
  onNavigate: (view: NavView) => void;
}

export const JobRoleDetailPage: React.FC<JobRoleDetailPageProps> = ({
  role,
  onBack,
  onNavigate,
}) => {
  const { user, setTargetRole } = useAuth();
  const isTarget = user?.targetRole === role.jobTitle;

  const handleSetTarget = async () => {
    await setTargetRole(role.jobTitle);
  };

  const handleOpenSkillGap = async () => {
    await setTargetRole(role.jobTitle);
    onNavigate('skill-gap');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Recommendations</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSetTarget}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              isTarget
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isTarget ? '✓ Selected as Target Career' : 'Set as Target Role'}
          </button>
          <button
            onClick={handleOpenSkillGap}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            <span>Open Skill Gap Analyzer</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {role.category}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Demand: {role.industryDemand}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {role.jobTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {role.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-6 self-start md:self-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">AI Match Estimate</span>
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {role.matchScore}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Salary Range</span>
              <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                {role.salaryRange || '$85,000 - $130,000'}
              </span>
            </div>
          </div>
        </div>

        {/* Why this matches you */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Why this role matches your profile:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {role.explanation}
          </p>
        </div>

        {/* Career path progression */}
        <div className="mt-6">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
            Typical Career Progression
          </span>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
            {role.careerPath}
          </div>
        </div>
      </div>

      {/* Grid: Responsibilities & Skill Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Responsibilities */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-4">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Core Job Responsibilities
            </h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {role.typicalResponsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skill Comparison Table */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Skill Comparison
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Profile vs Role</span>
          </div>

          <div className="space-y-2">
            {/* Matching */}
            {role.matchingSkills.map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-xs"
              >
                <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{skill}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                  Strong Match
                </span>
              </div>
            ))}

            {/* Missing */}
            {role.missingSkills.map((skill) => (
              <div
                key={skill}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs"
              >
                <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{skill}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                  Needs Development
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Certifications */}
      {role.relevantCertifications && role.relevantCertifications.length > 0 && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5 mb-4">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recommended Industry Certifications
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role.relevantCertifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 block mb-1">
                    {cert.provider}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {cert.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span>Difficulty: {cert.difficulty}</span>
                    <span>·</span>
                    <span>Duration: {cert.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps CTA */}
      <div className="p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/70 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Ready to build the skills for {role.jobTitle}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Run a full skill gap audit against live industry expectations, generate a personalized 5-phase learning roadmap, and evaluate your resume.
          </p>
        </div>

        <button
          onClick={handleOpenSkillGap}
          className="shrink-0 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>Analyze Skill Gap</span>
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
