import React from 'react';
import {
  Compass,
  Sparkles,
  TrendingUp,
  FileCheck,
  Award,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Target,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface LandingPageProps {
  onOpenAuth: (tab: 'login' | 'register') => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreDemo }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Compass,
      title: 'AI Career Recommendations',
      description:
        'Contextual AI analyzes your skills, academic discipline, and aspirations to recommend roles where you have an unfair advantage.',
      metric: '5-7 Role Pathways',
    },
    {
      icon: TrendingUp,
      title: 'Skill Gap Analyzer',
      description:
        'Visual benchmarking compares your current skill stack against live market requirements, categorizing skills into Strong, Needs Improvement, or Missing.',
      metric: 'Readiness Score %',
    },
    {
      icon: FileCheck,
      title: 'Resume & ATS Evaluator',
      description:
        'Upload your resume in PDF/DOCX or text to evaluate applicant tracking system (ATS) compatibility, keyword density, and formatting compliance.',
      metric: '0-100 ATS Score',
    },
    {
      icon: Sparkles,
      title: 'Actionable Bullet Optimization',
      description:
        'Turn passive statements into quantifiable XYZ achievements with side-by-side before and after AI suggestions.',
      metric: 'Instant Rewrites',
    },
    {
      icon: Award,
      title: 'Learning & Certification Roadmaps',
      description:
        'Receive curated 5-phase learning roadmaps with verified course references from Google Cloud, Coursera, Meta, AWS, and DeepLearning.AI.',
      metric: 'Structured Phases',
    },
    {
      icon: MessageSquare,
      title: 'AI Career Assistant',
      description:
        'A persistent AI career advisor grounded in your stored skills, target role, and resume gaps. Ask interview questions, roadmap advice, or project ideas.',
      metric: 'Context-Aware Chat',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Build Your Profile',
      desc: 'Enter your education, experience level, technical skills, and industry interests.',
    },
    {
      number: '02',
      title: 'Discover Suitable Roles',
      desc: 'AI recommends job roles that match your strengths, complete with compatibility scores and market outlook.',
    },
    {
      number: '03',
      title: 'Analyze Your Skill Gaps',
      desc: 'Select your target role to see exactly which competencies you have mastered and which you need to build.',
    },
    {
      number: '04',
      title: 'Improve Your Resume',
      desc: 'Get an ATS compatibility score, identify missing keywords, and rewrite weak bullet points into high-impact metrics.',
    },
    {
      number: '05',
      title: 'Build Your Career',
      desc: 'Execute your custom 5-phase learning roadmap and consult your AI assistant at every step.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white tracking-tight text-base">
                Career Compass
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 ml-2">
                · AI Career & Skill Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Next-Generation Career Architecture for Students & Graduates</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] sm:leading-[1.12]">
              Navigate Your Career <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-purple-300 dark:to-indigo-300">
                With Confidence
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Discover the right career path, identify your skill gaps, improve your resume, and build the skills you need to reach your dream role.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-sm text-slate-700 dark:text-slate-200 transition-colors"
              >
                Explore Features
              </button>
              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Demo</span>
              </button>
            </div>

            {/* Micro stats banner */}
            <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-800/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">AI-Powered</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Semantic role matching</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">ATS Scoring</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Objective metric analysis</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">5-Phase</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Structured roadmaps</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">100% Free</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">For learners & grads</p>
              </div>
            </div>
          </div>

          {/* Interactive UI Mockup Card */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      AI Career Diagnostic & Skill Gap Engine
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                      Live Platform Preview
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sample Candidate Benchmark · 87% Match for Cloud & Data Systems Architect
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Overall Skill Readiness</span>
                  <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">68% Job Ready</span>
                </div>
              </div>
            </div>

            {/* Mock preview grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Skill Status</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">2 Strong · 3 Missing</span>
                </div>
                <div className="space-y-2 mt-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">SQL & Modeling</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">90% ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Python Scripting</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">85% ✓</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Apache Spark</span>
                    <span className="font-mono text-rose-500">25% (Missing)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Cloud Orchestration</span>
                    <span className="font-mono text-rose-500">15% (Missing)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Resume ATS Compatibility</span>
                  <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">77 / 100</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Strong project descriptions and technical degree detected. Missing keywords: Docker, CI/CD, and Cloud Pipelines.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>3 Actionable Bullet Rewrites</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">AI Assistant Advice</span>
                  <span className="text-[11px] text-slate-400">Grounded</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mt-2 leading-relaxed">
                  "Focus on PySpark DataFrames and build a multi-source ETL pipeline using Docker to close your primary gap."
                </p>
                <button
                  onClick={onExploreDemo}
                  className="mt-4 w-full py-1.5 rounded-lg bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-600/20 transition-colors"
                >
                  Launch Full Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features-section" className="py-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Comprehensive Platform
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Everything You Need to Bridge the Gap Between College and Your Dream Career
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Traditional career sites match keywords. Career Compass builds an end-to-end development roadmap tailored to your actual skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all shadow-xs hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                      {f.metric}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Proven Progression
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              How Career Compass Works
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              A continuous loop of assessment, roadmap execution, and resume refinement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 block mb-2">
                    {s.number}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-indigo-600 dark:bg-indigo-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Control of Your Career Direction?
          </h2>
          <p className="mt-4 text-base text-indigo-100 dark:text-indigo-200 max-w-xl mx-auto">
            Create your free Career Compass profile in under two minutes, analyze your skills, and get personalized recommendations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Build Your Career Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
            >
              Explore With Demo Account
            </button>
          </div>

          <p className="mt-6 text-xs text-indigo-200">
            No credit card required · Instant setup · Verified learning paths
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Career Compass</span>
            <span>— AI Career Guidance & Skill Development</span>
          </div>
          <p className="text-[11px]">
            AI match scores and ATS estimates are advisory guidance tools designed to support professional skill building.
          </p>
        </div>
      </footer>
    </div>
  );
};
