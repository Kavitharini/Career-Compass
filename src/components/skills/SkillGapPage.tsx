import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Plus,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SkillGapAnalysis, SkillComparisonItem } from '../../types/career';
import { ScoreGauge } from '../common/ScoreGauge';
import { LoadingState } from '../common/LoadingState';
import { NavView } from '../layout/Sidebar';

interface SkillGapPageProps {
  onNavigate: (view: NavView) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ onNavigate }) => {
  const { user, token, setTargetRole, setUser } = useAuth();
  const currentTargetRole = user?.targetRole || 'Data Engineer';

  const [selectedRole, setSelectedRole] = useState(currentTargetRole);
  const [loading, setLoading] = useState(false);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(user?.skillGap || null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Already Strong' | 'Needs Improvement' | 'Missing'>('All');

  // Predefined standard roles user can benchmark against
  const standardRoles = [
    'Data Engineer',
    'Full-Stack Software Engineer',
    'Machine Learning Engineer',
    'Cloud & DevOps Engineer',
    'Data Scientist',
    'Frontend Developer',
    'Backend Engineer',
    'Cybersecurity Analyst',
  ];

  const fetchSkillGap = async (roleToAnalyze: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/skill-gap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetRole: roleToAnalyze,
          userSkills: user?.skills || [],
          experienceLevel: user?.experienceLevel || 'Fresher',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSkillGap(data);
        setUser((prev) => (prev ? { ...prev, skillGap: data, targetRole: roleToAnalyze } : null));
      }
    } catch (err) {
      console.error('Failed to analyze skill gap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!skillGap || skillGap.targetRole !== currentTargetRole) {
      fetchSkillGap(currentTargetRole);
    }
  }, [currentTargetRole]);

  const handleRoleChange = async (newRole: string) => {
    setSelectedRole(newRole);
    await setTargetRole(newRole);
    await fetchSkillGap(newRole);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Already Strong':
        return {
          badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          bar: 'bg-emerald-500',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'Needs Improvement':
        return {
          badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          bar: 'bg-amber-500',
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400',
        };
      default:
        return {
          badge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          bar: 'bg-rose-500',
          icon: XCircle,
          iconColor: 'text-rose-600 dark:text-rose-400',
        };
    }
  };

  const skillsList: SkillComparisonItem[] = skillGap?.skillsComparison || [];

  const filteredSkills = skillsList.filter((item) => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });

  const strongCount = skillsList.filter((s) => s.status === 'Already Strong').length;
  const improveCount = skillsList.filter((s) => s.status === 'Needs Improvement').length;
  const missingCount = skillsList.filter((s) => s.status === 'Missing').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Target Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Skill Benchmarking Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Skill Gap Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Compare your verified skill profile against the enterprise requirements of your target role.
          </p>
        </div>

        {/* Target role switcher */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            Target Role:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={loading}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs focus:ring-2 focus:ring-indigo-500/20"
          >
            {standardRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchSkillGap(selectedRole)}
            disabled={loading}
            title="Re-analyze skill gap"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState
          title="Calculating skill gap vectors..."
          subtitle={`Benchmarking your skills against modern industry standards for ${selectedRole}`}
          messages={[
            'Auditing technical skill proficiency...',
            'Evaluating core domain prerequisites...',
            'Calculating overall job readiness index...',
            'Synthesizing gap closure priorities...',
          ]}
        />
      ) : (
        <>
          {/* Top Summary Banner with Readiness Gauge */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Circular Gauge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
                <ScoreGauge
                  score={skillGap?.readinessScore || 68}
                  size="lg"
                  label="Job Ready"
                />
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 italic text-center">
                  *AI-generated compatibility estimate based on current market job descriptions
                </span>
              </div>

              {/* Status breakdown metrics */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Competency Audit
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">Target: {selectedRole}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {skillGap?.readinessScore && skillGap.readinessScore >= 75
                      ? 'Solid foundation with targeted gaps'
                      : 'High potential: bridge key cloud & system skills'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {skillGap?.summary}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-center">
                    <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                      {strongCount}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Already Strong
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 text-center">
                    <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 block">
                      {improveCount}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Needs Improvement
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/40 text-center">
                    <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 block">
                      {missingCount}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Missing Competencies
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Comparison List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Skill Proficiency Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detailed status of each requirement for {selectedRole}
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start">
                {(['All', 'Already Strong', 'Needs Improvement', 'Missing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterStatus(tab)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      filterStatus === tab
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredSkills.map((skill) => {
                const config = getStatusColor(skill.status);
                const Icon = config.icon;

                return (
                  <div
                    key={skill.name}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {skill.name}
                            </h4>
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {skill.importance}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Target Level: <span className="font-semibold">{skill.requiredProficiency}</span> · Your Level: <span className="font-medium text-slate-700 dark:text-slate-300">{skill.userProficiency}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${config.badge}`}>
                          {skill.status}
                        </span>
                        <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 w-10 text-right">
                          {skill.matchPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${config.bar} transition-all duration-700 ease-out`}
                        style={{ width: `${skill.matchPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action to Learning Roadmap */}
          <div className="p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bridge These Gaps with Your Custom Roadmap
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                We have generated a 5-phase personalized learning roadmap with curated projects and verified certifications designed specifically to turn your missing competencies into strong assets.
              </p>
            </div>

            <button
              onClick={() => onNavigate('roadmap')}
              className="shrink-0 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>View Learning Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
