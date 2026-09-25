export type ExperienceLevel = 'Student' | 'Fresher' | '0–1 Years' | '1–3 Years' | '3+ Years';

export interface UserCareerPreferences {
  preferredIndustry?: string;
  preferredWorkType?: 'Full-time' | 'Internship' | 'Contract' | string;
  preferredLocation?: string;
  remotePreference?: 'Remote' | 'Hybrid' | 'On-site' | string;
  preferredJobLevel?: 'Entry Level' | 'Associate' | 'Mid Level' | string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  education?: string;
  degree?: string;
  specialization?: string;
  graduationYear?: string;
  experienceLevel?: ExperienceLevel | string;
  skills: string[];
  interests: string[];
  careerPreferences?: UserCareerPreferences;
  targetRole?: string;
  completedRoadmapItems?: string[];
  recommendations?: JobRoleRecommendation[];
  skillGap?: SkillGapAnalysis;
  resumeAnalysis?: ResumeAnalysis;
}

export interface Certification {
  name: string;
  provider: string;
  difficulty: string;
  duration: string;
  url?: string;
}

export interface JobRoleRecommendation {
  id: string;
  jobTitle: string;
  category: 'Technology' | 'Data' | 'AI/ML' | 'Cloud' | 'Security' | 'Development' | 'Business' | 'Design';
  matchScore: number;
  shortDescription: string;
  explanation: string;
  matchingSkills: string[];
  missingSkills: string[];
  typicalResponsibilities: string[];
  recommendedNextSteps: string[];
  relevantCertifications: Certification[];
  careerPath: string;
  salaryRange: string;
  industryDemand: 'High' | 'Very High' | 'Moderate' | string;
}

export interface SkillComparisonItem {
  name: string;
  requiredProficiency: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  userProficiency: string;
  status: 'Already Strong' | 'Needs Improvement' | 'Missing';
  matchPercentage: number;
  importance: 'Required' | 'Important' | 'Nice to have';
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  topics: string[];
  recommendedResource?: string;
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  objective: string;
  items: RoadmapItem[];
}

export interface SkillGapAnalysis {
  targetRole: string;
  readinessScore: number;
  summary: string;
  skillsComparison: SkillComparisonItem[];
  roadmap: RoadmapPhase[];
}

export interface ResumeImprovementSuggestion {
  original: string;
  improved: string;
  reason: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  overallScore: number;
  targetRole: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  keywordAnalysis: {
    existing: string[];
    missing: string[];
    repeated: string[];
  };
  detectedSkills: string[];
  experienceAnalysis: {
    level: string;
    rating: string;
    notes: string;
  };
  educationAnalysis: {
    degree: string;
    rating: string;
    notes: string;
  };
  projectAnalysis: {
    rating: string;
    feedback: string;
  };
  formattingCheck: {
    overall: string;
    readabilityScore: number;
    issues: string[];
  };
  resumeSkillGaps: {
    skillsToAdd: string[];
    skillsToStrengthen: string[];
    actionableRecommendations: string[];
  };
  improvementSuggestions: ResumeImprovementSuggestion[];
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  skill: string;
  difficulty: string;
  duration: string;
  type: string;
  url?: string;
  whyRecommended: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
