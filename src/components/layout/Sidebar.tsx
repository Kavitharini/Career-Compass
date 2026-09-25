import React from 'react';
import {
  Compass,
  LayoutDashboard,
  User,
  Sparkles,
  TrendingUp,
  MapPin,
  FileText,
  MessageSquare,
  Award,
  LogOut,
  X,
  Target,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavView =
  | 'dashboard'
  | 'profile'
  | 'recommendations'
  | 'skill-gap'
  | 'roadmap'
  | 'resume-analyzer'
  | 'career-assistant'
  | 'certifications';

interface SidebarProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect?: (role: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'recommendations', label: 'Career Recommendations', icon: Compass },
    { id: 'skill-gap', label: 'Skill Gap Analyzer', icon: TrendingUp },
    { id: 'roadmap', label: 'Learning Roadmap', icon: MapPin },
    { id: 'resume-analyzer', label: 'Resume Analyzer & ATS', icon: FileText },
    { id: 'career-assistant', label: 'AI Career Assistant', icon: MessageSquare },
    { id: 'certifications', label: 'Courses & Certifications', icon: Award },
  ];

  const handleNavClick = (id: NavView) => {
    setCurrentView(id);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white tracking-tight text-base block">
                Career Compass
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-normal -mt-0.5">
                AI Talent & Career Platform
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Active Target Role Banner */}
        {user?.targetRole && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Target Role
              </span>
              <span className="text-[11px] font-mono text-slate-400">Active</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user.targetRole}
            </p>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as NavView)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile & logout bottom block */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-semibold text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || 'Career Explorer'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user?.experienceLevel || 'Fresher'}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
