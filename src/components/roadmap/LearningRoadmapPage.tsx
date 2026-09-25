import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  FolderGit2,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoadmapPhase, RoadmapItem } from '../../types/career';
import { NavView } from '../layout/Sidebar';

interface LearningRoadmapPageProps {
  onNavigate: (view: NavView) => void;
}

export const LearningRoadmapPage: React.FC<LearningRoadmapPageProps> = ({ onNavigate }) => {
  const { user, toggleRoadmapItem } = useAuth();
  const targetRole = user?.targetRole || 'Data Engineer';
  const skillGap = user?.skillGap;

  const phases: RoadmapPhase[] = skillGap?.roadmap || [];
  const completedItems = user?.completedRoadmapItems || [];

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'Phase 1: Foundations': true,
    'Phase 2: Intermediate Skills': true,
    'Phase 3: Advanced Skills': true,
    'Phase 4: Capstone Projects': true,
    'Phase 5: Interview Preparation': true,
  });

  const togglePhase = (phaseName: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseName]: !prev[phaseName],
    }));
  };

  // Calculate total items and completed percentage
  const allItems: RoadmapItem[] = phases.flatMap((p) => p.items);
  const totalItemsCount = allItems.length || 1;
  const completedCount = allItems.filter((i) => completedItems.includes(i.id)).length;
  const completionPercentage = Math.round((completedCount / totalItemsCount) * 100);

  const handleToggle = async (itemId: string) => {
    const isCompleted = completedItems.includes(itemId);
    await toggleRoadmapItem(itemId, !isCompleted);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Personalized Career Development</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Learning Roadmap for {targetRole}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            A structured 5-phase execution plan designed to systematically close your identified skill gaps and prepare you for technical hiring.
          </p>
        </div>

        {/* Progress Tracker Pill */}
        <div className="p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 self-start sm:self-center shadow-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Milestones Completed</span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
              {completedCount} of {totalItemsCount}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Roadmap Progress</span>
            <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Phases Timeline */}
      <div className="space-y-6">
        {phases.map((phase, pIdx) => {
          const isExpanded = expandedPhases[phase.phase] ?? true;
          const phaseItems = phase.items;
          const phaseDone = phaseItems.every((it) => completedItems.includes(it.id));

          return (
            <div
              key={phase.phase}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
            >
              {/* Phase Header */}
              <div
                onClick={() => togglePhase(phase.phase)}
                className="cursor-pointer p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      phaseDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                    }`}
                  >
                    {pIdx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {phase.phase}
                      </h3>
                      <span className="text-xs text-slate-400">· {phase.duration}</span>
                      {phaseDone && (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-sm">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {phase.objective}
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Phase Items */}
              {isExpanded && (
                <div className="p-5 space-y-4 border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {phaseItems.map((item) => {
                    const isCompleted = completedItems.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`pt-4 first:pt-0 transition-opacity ${
                          isCompleted ? 'opacity-70' : 'opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggle(item.id)}
                            className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4
                                className={`text-sm font-bold text-slate-900 dark:text-white ${
                                  isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                }`}
                              >
                                {item.title}
                              </h4>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.2 rounded-sm ${
                                  item.priority === 'High'
                                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                                    : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                                }`}
                              >
                                {item.priority} Priority
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                              {item.description}
                            </p>

                            {/* Core Topics Checklist */}
                            {item.topics && item.topics.length > 0 && (
                              <div className="mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
                                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                                  Key Learning Concepts:
                                </span>
                                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                                  {item.topics.map((top, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <span className="text-indigo-500 font-mono text-[10px]">
                                        {idx + 1}.
                                      </span>
                                      <span>{top}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Recommended Reference */}
                            {item.recommendedResource && (
                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                <span>Recommended Reference: <span className="font-medium text-slate-700 dark:text-slate-300">{item.recommendedResource}</span></span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Certifications CTA */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Looking for accredited courses & credentials?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explore industry-recognized certifications from Google Cloud, Coursera, AWS, and Meta.
          </p>
        </div>
        <button
          onClick={() => onNavigate('certifications')}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <span>Browse Certifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
