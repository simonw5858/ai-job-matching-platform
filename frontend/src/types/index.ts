export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'recruiter';
  skills: string[];
  experience: number;
  location: string;
  education: string;
  bio: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  experienceRequired: number;
  location: string;
  salary: {
    min: number;
    max: number;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'remote';
  recruiterId: string;
  postedAt: string;
  isActive: boolean;
}

export interface MatchFactor {
  category: 'skills' | 'experience' | 'location' | 'education';
  score: number;
  weight: number;
  explanation: string;
  matchedItems?: string[];
  missingItems?: string[];
}

export interface MatchScore {
  jobId: string;
  userId: string;
  overallScore: number;
  factors: MatchFactor[];
  recommendations: string[];
}

export interface JobMatchResult {
  job: Job;
  matchScore: MatchScore;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'candidate' | 'recruiter';
}
