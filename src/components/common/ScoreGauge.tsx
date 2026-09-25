import React from 'react';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subtitle?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  maxScore = 100,
  size = 'md',
  label,
  subtitle,
}) => {
  const percentage = Math.min(Math.max(Math.round((score / maxScore) * 100), 0), 100);

  // SVG radius & dimensions
  const dims = {
    sm: { radius: 36, stroke: 7, size: 90, text: 'text-lg', labelText: 'text-[10px]' },
    md: { radius: 52, stroke: 9, size: 130, text: 'text-2xl', labelText: 'text-xs' },
    lg: { radius: 68, stroke: 11, size: 170, text: 'text-3xl', labelText: 'text-sm' },
  }[size];

  const circumference = 2 * Math.PI * dims.radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (pct >= 60) return 'text-indigo-500 stroke-indigo-500';
    if (pct >= 40) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getTrackColor = () => 'stroke-slate-100 dark:stroke-slate-800';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dims.size}
          height={dims.size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={dims.radius}
            className={`fill-none ${getTrackColor()}`}
            strokeWidth={dims.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={dims.radius}
            className={`fill-none ${getColor(percentage)} transition-all duration-1000 ease-out`}
            strokeWidth={dims.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold font-mono text-slate-900 dark:text-white ${dims.text}`}>
            {score}
            {maxScore === 100 && <span className="text-xs font-normal text-slate-400 dark:text-slate-500">%</span>}
          </span>
          {label && (
            <span className={`text-slate-500 dark:text-slate-400 font-medium ${dims.labelText}`}>
              {label}
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 max-w-[180px]">
          {subtitle}
        </p>
      )}
    </div>
  );
};
