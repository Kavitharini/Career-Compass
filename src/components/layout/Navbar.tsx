import React from 'react';
import { Menu, Sun, Moon, Sparkles, Target, Compass } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { NavView } from './Sidebar';

interface NavbarProps {
  currentView: NavView;
  onOpenSidebar: () => void;
  onNavigate: (view: NavView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onOpenSidebar, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Career Dashboard';
      case 'profile':
        return 'My Profile & Skills';
      case 'recommendations':
        return 'AI Career Recommendations';
      case 'skill-gap':
        return 'Skill Gap Analyzer';
      case 'roadmap':
        return 'Personalized Learning Roadmap';
      case 'resume-analyzer':
        return 'ATS Resume Analyzer & Optimization';
      case 'career-assistant':
        return 'AI Career Assistant';
      case 'certifications':
        return 'Recommended Certifications & Courses';
      default:
        return 'Career Compass';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
            {getTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.targetRole && (
          <button
            onClick={() => onNavigate('skill-gap')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Current Target Role"
          >
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-slate-500 dark:text-slate-400">Target:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{user.targetRole}</span>
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all"
          title="Account profile"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </button>
      </div>
    </header>
  );
};
