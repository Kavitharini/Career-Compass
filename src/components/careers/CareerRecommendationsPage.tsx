import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  SlidersHorizontal,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { JobRoleRecommendation } from '../../types/career';
import { NavView } from '../layout/Sidebar';

interface CareerRecommendationsPageProps {
  onSelectRole: (role: JobRoleRecommendation) => void;
  onNavigate: (view: NavView) => void;
}

export const CareerRecommendationsPage: React.FC<CareerRecommendationsPageProps> = ({
  onSelectRole,
  onNavigate,
}) => {
  const { user, setTargetRole } = useAuth();
  const recommendations: JobRoleRecommendation[] = user?.recommendations || [];

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'gap' | 'demand'>('match');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Technology',
    'Data',
    'AI/ML',
    'Cloud',
    'Security',
    'Development',
    'Business',
    'Design',
  ];

  // Filter & Sort
  const filteredRoles = recommendations
    .filter((role) => {
      const matchCat = categoryFilter === 'All' || role.category === categoryFilter;
      const matchSearch =
        role.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.matchingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        return b.matchScore - a.matchScore;
      }
      if (sortBy === 'gap') {
        return a.missingSkills.length - b.missingSkills.length;
      }
      if (sortBy === 'demand') {
        return (b.industryDemand === 'Very High' ? 2 : 1) - (a.industryDemand === 'Very High' ? 2 : 1);
      }
      return 0;
    });

  const handleSelectTarget = async (roleName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await setTargetRole(roleName);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recommended Job Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Ranked based on the relationship between your skills, academic discipline, and target interests. Match percentages represent AI compatibility estimates.
          </p>
        </div>

        {/* Target role indicator */}
        {user?.targetRole && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="text-left">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Current Target Career</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{user.targetRole}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search roles or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="match">Sort by Match %</option>
              <option value="gap">Least Skill Gap</option>
              <option value="demand">Market Demand</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Compass className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            No matching job roles found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try resetting your category filter or search query.
          </p>
          <button
            onClick={() => {
              setCategoryFilter('All');
              setSearchQuery('');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => {
            const isTarget = user?.targetRole === role.jobTitle;

            return (
              <div
                key={role.id || role.jobTitle}
                onClick={() => onSelectRole(role)}
                className={`group cursor-pointer p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isTarget
                    ? 'border-indigo-500/80 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400/50 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {role.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {role.jobTitle}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                        <span>{role.matchScore}%</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block -mt-0.5">Match</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                    {role.shortDescription}
                  </p>

                  {/* Why this matches you */}
                  <div className="mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                      Why this matches:
                    </span>
                    <span className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">
                      {role.explanation}
                    </span>
                  </div>

                  {/* Matching skills */}
                  <div className="mb-3">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Matching Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.matchingSkills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skills */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1.5">
                      <AlertTriangle className="w-3 h-3" />
                      Skills to Improve
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.missingSkills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60"
                        >
                          {s}
                        </span>
                      ))}
                      {role.missingSkills.length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{role.missingSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleSelectTarget(role.jobTitle, e)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isTarget
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600'
                    }`}
                  >
                    {isTarget ? 'Active Target' : 'Set as Target'}
                  </button>

                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Role Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
