import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LearningResource } from '../../types/career';

export const CertificationsPage: React.FC = () => {
  const { user } = useAuth();
  const targetRole = user?.targetRole || 'Data Engineer';

  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const catalog: LearningResource[] = [
    {
      id: 'cert-1',
      title: 'Google Cloud Professional Data Engineer Certification',
      provider: 'Google Cloud / Coursera',
      skill: 'Cloud Data Architecture',
      difficulty: 'Intermediate',
      duration: '3 Months (8 hrs/week)',
      type: 'Professional Certificate',
      url: 'https://cloud.google.com/learn/certification/data-engineer',
      whyRecommended: `Directly targets key architecture gaps for ${targetRole} including BigQuery, Dataflow, and Pub/Sub pipelines.`,
    },
    {
      id: 'cert-2',
      title: 'Data Engineering with Databricks & Apache Spark',
      provider: 'Databricks Academy',
      skill: 'Apache Spark & Big Data',
      difficulty: 'Intermediate',
      duration: '4 Weeks',
      type: 'Hands-on Course',
      url: 'https://academy.databricks.com',
      whyRecommended: 'Solves the primary missing distributed data processing competency identified in your skill gap analysis.',
    },
    {
      id: 'cert-3',
      title: 'Meta Database Engineer Professional Certificate',
      provider: 'Meta / Coursera',
      skill: 'SQL & Database Optimization',
      difficulty: 'Beginner - Intermediate',
      duration: '2-3 Months',
      type: 'Professional Certificate',
      url: 'https://www.coursera.org/professional-certificates/meta-database-engineer',
      whyRecommended: 'Reinforces relational modeling, indexing, advanced SQL querying, and database backup architectures.',
    },
    {
      id: 'cert-4',
      title: 'AWS Certified Solutions Architect – Associate',
      provider: 'Amazon Web Services',
      skill: 'AWS Cloud Infrastructure',
      difficulty: 'Intermediate',
      duration: '2 Months',
      type: 'Industry Certification',
      url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
      whyRecommended: 'Highly sought-after credential validating core storage, compute, security, and networking standards.',
    },
    {
      id: 'cert-5',
      title: 'DeepLearning.AI: Machine Learning Specialization',
      provider: 'DeepLearning.AI / Andrew Ng',
      skill: 'Machine Learning',
      difficulty: 'Beginner - Intermediate',
      duration: '2 Months',
      type: 'Specialization',
      url: 'https://www.deeplearning.ai/courses/machine-learning-specialization/',
      whyRecommended: 'Essential foundations in supervised learning, regression, classification, and neural network principles.',
    },
    {
      id: 'cert-6',
      title: 'Docker & Kubernetes: The Practical Guide',
      provider: 'Udemy / Academind',
      skill: 'DevOps & Containers',
      difficulty: 'Intermediate',
      duration: '23 Hours video',
      type: 'Interactive Course',
      url: 'https://www.docker.com',
      whyRecommended: 'Bridges containerization gaps commonly required in modern production microservices.',
    },
    {
      id: 'cert-7',
      title: 'Harvard CS50: Introduction to Computer Science',
      provider: 'edX / Harvard University',
      skill: 'Algorithms & Data Structures',
      difficulty: 'Beginner',
      duration: '10 Weeks',
      type: 'Open Courseware',
      url: 'https://cs50.harvard.edu',
      whyRecommended: 'Unbeatable foundational grasp of memory, algorithmic complexity, and structured problem-solving.',
    },
    {
      id: 'cert-8',
      title: 'Full Stack Open (Deep Dive to Modern Web Development)',
      provider: 'University of Helsinki',
      skill: 'Full-Stack JavaScript & React',
      difficulty: 'Intermediate',
      duration: 'Self-Paced (approx. 80 hrs)',
      type: 'Free Accredited Course',
      url: 'https://fullstackopen.com',
      whyRecommended: 'Covers modern React, Node.js, GraphQL, TypeScript, and CI/CD pipelines through hands-on project grading.',
    },
  ];

  const filtered = catalog.filter((item) => {
    const matchSkill = selectedSkill === 'All' || item.skill.toLowerCase().includes(selectedSkill.toLowerCase());
    const matchDiff = selectedDifficulty === 'All' || item.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase());
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSkill && matchDiff && matchQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Curated Skill Building</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recommended Certifications & Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Accredited credentials and industry certifications curated to eliminate missing competencies for <span className="font-semibold text-slate-800 dark:text-slate-200">{targetRole}</span>.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search credentials, providers, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="All">All Skill Domains</option>
            <option value="Cloud">Cloud & Architecture</option>
            <option value="Spark">Spark & Big Data</option>
            <option value="SQL">SQL & Databases</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="DevOps">DevOps & Containers</option>
            <option value="JavaScript">Full-Stack / React</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-indigo-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.provider}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {item.type}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {item.skill}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.duration}
                </span>
              </div>

              {/* Why Recommended Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                  Why this helps you:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {item.whyRecommended}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Level: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.difficulty}</span>
              </span>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                >
                  <span>Explore Program</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
