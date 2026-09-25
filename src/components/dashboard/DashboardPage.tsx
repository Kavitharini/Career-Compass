import React from 'react';
import {
  Compass,
  Target,
  Sparkles,
  TrendingUp,
  FileText,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../common/MetricCard';
import { ScoreGauge } from '../common/ScoreGauge';
import { NavView } from '../layout/Sidebar';
import { JobRoleRecommendation } from '../../types/career';

interface DashboardPageProps {
  onNavigate: (view: NavView) => void;
  onSelectRole: (role: JobRoleRecommendation) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectRole }) => {
  const { user } = useAuth();
  const targetRole = user?.targetRole || 'Data Engineer';
  const skillGap = user?.skillGap;
  const resume = user?.resumeAnalysis;
  const recommendations = user?.recommendations || [];

  const completedRoadmapCount = user?.completedRoadmapItems?.length || 0;
  const totalRoadmapItems = skillGap?.roadmap?.flatMap((p) => p.items).length || 5;
  const roadmapPct = Math.min(Math.round((completedRoadmapCount / totalRoadmapItems) * 100), 100);

  const topRoles = recommendations.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-indigo-100 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Explorer'}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 mt-2 leading-relaxed">
            Your career target is set to <span className="font-bold underline underline-offset-4 text-white">{targetRole}</span>. You have {skillGap?.skillsComparison?.filter(s => s.status === 'Already Strong').length || 2} verified strong skills and {skillGap?.skillsComparison?.filter(s => s.status === 'Missing').length || 3} primary growth competencies to develop.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-xs transition-all flex items-center gap-2"
            >
              <span>Continue Learning Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('resume-analyzer')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-xs transition-colors"
            >
              {resume ? 'View Resume ATS Report' : 'Upload Resume for ATS'}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Active Target Career"
          value={targetRole}
          subtitle="Click to change target"
          icon={Target}
          color="indigo"
          onClick={() => onNavigate('recommendations')}
        />

        <MetricCard
          title="Job Readiness Index"
          value={`${skillGap?.readinessScore || 68}%`}
          subtitle="AI market compatibility"
          icon={TrendingUp}
          trend="+8% this month"
          color="emerald"
          onClick={() => onNavigate('skill-gap')}
        />

        <MetricCard
          title="Resume ATS Score"
          value={resume?.atsScore ? `${resume.atsScore}/100` : 'Resume not uploaded'}
          subtitle={resume ? 'Parsed & verified' : 'Click to upload & analyze'}
          icon={FileText}
          color="blue"
          onClick={() => onNavigate('resume-analyzer')}
        />

        <MetricCard
          title="Roadmap Execution"
          value={`${roadmapPct}%`}
          subtitle={`${completedRoadmapCount} of ${totalRoadmapItems} milestones`}
          icon={MapPin}
          color="amber"
          onClick={() => onNavigate('roadmap')}
        />
      </div>

      {/* Main 2-Column Split: Skill Gap Summary & Top Career Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Skill Gap Audit Overview */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Skill Readiness for {targetRole}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('skill-gap')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View full audit →
              </button>
            </div>

            <div className="flex items-center justify-center py-4">
              <ScoreGauge
                score={skillGap?.readinessScore || 68}
                size="md"
                label="Readiness"
              />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 text-center mb-4 leading-relaxed">
              {skillGap?.summary || 'Strong algorithmic and programming foundation. Key gaps are in cloud orchestration and distributed ETL pipelines.'}
            </p>

            {/* Quick list of strong vs missing */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between">
                <span className="font-medium text-emerald-800 dark:text-emerald-300">Strong Assets</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.skills?.slice(0, 3).join(', ') || 'Python, SQL, Algorithms'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/40 flex items-center justify-between">
                <span className="font-medium text-rose-800 dark:text-rose-300">Top Priority Gaps</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Apache Spark, Cloud Architecture
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('skill-gap')}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Audit Detailed Competencies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column: Recommended Job Roles */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Top AI Career Matches
                </h3>
              </div>
              <button
                onClick={() => onNavigate('recommendations')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Browse all ({recommendations.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {topRoles.map((role) => (
                <div
                  key={role.jobTitle}
                  onClick={() => onSelectRole(role)}
                  className="cursor-pointer p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {role.jobTitle}
                      </h4>
                      {user?.targetRole === role.jobTitle && (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {role.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>Salary: {role.salaryRange}</span>
                      <span>·</span>
                      <span>Demand: {role.industryDemand}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                      {role.matchScore}%
                    </span>
                    <span className="text-[10px] text-slate-400">Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Need personalized advice for job interviews?
            </span>
            <button
              onClick={() => onNavigate('career-assistant')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Ask AI Career Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to Core Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('resume-analyzer')}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 transition-all flex items-center gap-4 shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {resume ? 'Resume ATS Report' : 'Upload Resume for ATS'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {resume
                ? `Current ATS score: ${resume.atsScore}/100 · View audit`
                : 'Resume not uploaded · Click to audit ATS compatibility'}
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('career-assistant')}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 transition-all flex items-center gap-4 shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Career Assistant
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Interview questions & project architectures
            </p>
          </div>
        </div>

        <div
          onClick={() => onNavigate('certifications')}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 transition-all flex items-center gap-4 shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Accredited Courses
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified certifications from Google & AWS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
