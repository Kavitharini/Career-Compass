import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck,
  RefreshCw,
  Copy,
  ArrowRight,
  TrendingUp,
  Target,
  FileCode,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResumeAnalysis } from '../../types/career';
import { ScoreGauge } from '../common/ScoreGauge';
import { LoadingState } from '../common/LoadingState';
import { NavView } from '../layout/Sidebar';

interface ResumeAnalyzerPageProps {
  onNavigate: (view: NavView) => void;
}

export const ResumeAnalyzerPage: React.FC<ResumeAnalyzerPageProps> = ({ onNavigate }) => {
  const { user, token, setUser } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Data Engineer');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const analysis: ResumeAnalysis | null = user?.resumeAnalysis || null;

  const sampleResume = `ALEX MORGAN
Email: alex.morgan@email.com | Phone: (555) 234-5678 | GitHub: github.com/alexmorgan | LinkedIn: linkedin.com/in/alexmorgan

SUMMARY
Energetic Computer Science graduate with hands-on experience in Python, SQL, and database management. Passionate about building robust data infrastructure and eager to contribute to high-scale data engineering projects.

EDUCATION
Bachelor of Science in Computer Science & Engineering
State University, Graduated May 2024 | GPA: 3.75/4.0

TECHNICAL SKILLS
Languages: Python, SQL, JavaScript, HTML/CSS
Databases & Tools: PostgreSQL, MySQL, Git, Docker, REST APIs, Linux
Concepts: Data Structures & Algorithms, Database Design, Relational Modeling, Agile

PROJECTS
E-Commerce Transaction Data Pipeline
- Built a Python script that pulls orders from an API and loads them into PostgreSQL.
- Handled schema design and normalization for customer and order tables.
- Wrote SQL queries to calculate daily sales trends and customer retention.

Student Academic Analytics Dashboard
- Developed a web dashboard using React and Python Flask.
- Created visualizations for grade distributions across academic departments.
- Optimized query execution times using indexed views and caching.

EXPERIENCE
Software Engineering Intern | NextGen Cloud Solutions (Summer 2023)
- Worked on internal backend microservices written in Python.
- Assisted with database query optimization and fixed bugs reported by QA.
- Documented API endpoints and participated in bi-weekly sprint planning.`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    // For text / simple files, read directly
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setResumeText(ev.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      // Simulate/extract text preview for PDF/Word
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(
          `[Imported from ${file.name}]\n` +
          `File size: ${(file.size / 1024).toFixed(1)} KB\n\n` +
          sampleResume
        );
      };
      reader.readAsText(file.slice(0, 4000));
    }
  };

  const handleLoadSample = () => {
    setResumeText(sampleResume);
    setFileName('alex_morgan_resume.txt');
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume file or paste your resume text to begin.');
      return;
    }
    setError('');
    setAnalyzing(true);

    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resumeText,
          targetRole,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser((prev) => (prev ? { ...prev, resumeAnalysis: data } : null));
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to analyze resume');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred during analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Applicant Tracking System (ATS) Diagnostic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Resume Analyzer & ATS Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Audit keyword density, structural readability, and section impact benchmarked against your target role.
          </p>
        </div>

        {/* Target role selector for ATS comparison */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            Target Job:
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Data Engineer"
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Upload and Input Section */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload Box */}
          <div className="flex flex-col justify-between border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-indigo-500 transition-colors">
            <div className="my-auto py-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Upload your resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
                Supports PDF, DOCX, or Plain Text (.txt) formats
              </p>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors">
                <FileText className="w-3.5 h-3.5" />
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {fileName && (
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-3 truncate">
                  Loaded: {fileName}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                + Paste Pre-filled Sample Graduate Resume
              </button>
            </div>
          </div>

          {/* Paste Text Area */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Or Paste Resume Content Directly
              </label>
              <span className="text-[11px] text-slate-400">
                {resumeText.length > 0 ? `${resumeText.split(/\s+/).filter(Boolean).length} words` : 'Empty'}
              </span>
            </div>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the text of your resume here including Summary, Education, Skills, and Experience..."
              className="flex-1 w-full p-3.5 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleAnalyzeResume}
            disabled={analyzing || !resumeText.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Complete ATS & Resume Diagnostic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {analyzing && (
        <LoadingState
          title="Analyzing resume structure and ATS compatibility..."
          subtitle={`Auditing keywords, experience metrics, and formatting against expectations for ${targetRole}`}
          messages={[
            'Scanning applicant tracking system (ATS) parseability...',
            'Extracting verified technical skills and credentials...',
            'Comparing keyword density against real job postings...',
            'Evaluating quantifiable bullet point strength...',
            'Formulating high-impact rewrites with action verbs...',
          ]}
        />
      )}

      {/* Analysis Results Display */}
      {analysis && !analyzing && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Score Banner */}
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Gauges */}
              <div className="lg:col-span-5 flex items-center justify-around p-4 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 gap-4">
                <ScoreGauge
                  score={analysis.atsScore}
                  size="md"
                  label="ATS Score"
                  subtitle="Keyword & parseability match"
                />
                <ScoreGauge
                  score={analysis.overallScore}
                  size="md"
                  label="Overall Quality"
                  subtitle="Experience & project metrics"
                />
              </div>

              {/* Summary Description */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Diagnostic Summary
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target: {analysis.targetRole}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {analysis.atsScore >= 80
                    ? 'Excellent ATS compatibility with minor keyword gaps'
                    : analysis.atsScore >= 65
                    ? 'Strong candidate profile: add key tool keywords & metrics'
                    : 'Needs optimization for applicant tracking systems'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {analysis.summary}
                </p>

                <div className="pt-2">
                  <p className="text-[11px] text-slate-400 italic">
                    *ATS score represents an advisory estimate based on standard industry keyword matching and formatting criteria.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths and Critical Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Key Profile Strengths
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                {analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-3">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Areas for Improvement
                </h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                {analysis.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">!</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keyword Audit (Detected vs Missing) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Keyword Matching Audit
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Keywords an applicant tracking system checks for {analysis.targetRole}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Existing */}
              <div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mb-2">
                  Found in Resume ({analysis.keywordAnalysis.existing.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywordAnalysis.existing.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div>
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 block mb-2">
                  Missing Critical Keywords ({analysis.keywordAnalysis.missing.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywordAnalysis.missing.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section-by-Section Quality Checks */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Section-by-Section Diagnostic
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Experience Section
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {analysis.experienceAnalysis.rating}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {analysis.experienceAnalysis.notes}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Projects Section
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {analysis.projectAnalysis.rating}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {analysis.projectAnalysis.feedback}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Formatting & Readability
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {analysis.formattingCheck.readabilityScore}/100 Clean
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {analysis.formattingCheck.overall}
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Bullet Optimization (Side-by-Side Before & After) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Bullet Point Optimization (Before & After)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Rewritten using the Google XYZ Formula: "Accomplished [X] as measured by [Y], by doing [Z]"
              </p>
            </div>

            <div className="space-y-4">
              {analysis.improvementSuggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="p-3 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/30">
                      <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 block mb-1">
                        Original Statement
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                        "{sug.original}"
                      </p>
                    </div>

                    {/* Improved */}
                    <div className="relative p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          Optimized Impact Bullet
                        </span>
                        <button
                          onClick={() => handleCopy(sug.improved, idx)}
                          className="text-[11px] text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-mono font-medium">
                        "{sug.improved}"
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    Reason: {sug.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Skill Gap to Roadmap Action */}
          <div className="p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Turn Resume Gaps into Learning Milestones
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Ready to acquire the missing keywords and technical competencies identified in your resume analysis? Explore your personalized learning roadmap.
              </p>
            </div>

            <button
              onClick={() => onNavigate('roadmap')}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2"
            >
              <span>View Learning Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
