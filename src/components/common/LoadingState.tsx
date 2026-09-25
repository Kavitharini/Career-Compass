import React, { useEffect, useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  messages?: string[];
  fullscreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Analyzing your career data...',
  subtitle = 'Evaluating skills, market alignment, and development pathways',
  messages = [
    'Analyzing your career profile...',
    'Evaluating skill and interest relationships...',
    'Identifying high-compatibility roles...',
    'Calculating market readiness estimates...',
    'Formulating personalized recommendations...',
  ],
  fullscreen = false,
}) => {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    if (!messages.length) return;
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [messages]);

  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      {/* Animated Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Compass className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {subtitle}
      </p>

      {/* Cycling step badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/80 dark:border-slate-700">
        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
        <span className="transition-all duration-300">
          {messages[activeMessageIndex]}
        </span>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};
