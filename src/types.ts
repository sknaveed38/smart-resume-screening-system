export interface RadarMetrics {
  technicalAlignment: number; // 0-100
  experienceDepth: number;    // 0-100
  domainKnowledge: number;    // 0-100
  softSkills: number;         // 0-100
  growthPotential: number;    // 0-100
}

export interface KeywordMatch {
  keyword: string;
  matched: boolean;
}

export interface EducationItem {
  institution: string;
  degree: string;
  graduationYear: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ScreeningResult {
  candidateName: string;
  email: string;
  phone: string;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  overallScore: number;
  fitLevel: 'Very High' | 'High' | 'Medium' | 'Low';
  matchExplanation: string;
  radarMetrics: RadarMetrics;
  strengths: string[];
  weaknesses: string[];
  keywordMatch: KeywordMatch[];
  customQuestions: string[];
}

export interface Candidate {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  result?: ScreeningResult;
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  skillsRequired: string[];
  descriptionText: string;
}
