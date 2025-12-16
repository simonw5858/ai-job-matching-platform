export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'candidate' | 'recruiter';
  skills: string[];
  experience: number; // years
  location: string;
  education: string;
  bio: string;
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  experienceRequired: number; // years
  location: string;
  salary: {
    min: number;
    max: number;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'remote';
  recruiterId: string;
  postedAt: Date;
  isActive: boolean;
}

export interface MatchScore {
  jobId: string;
  userId: string;
  overallScore: number; // 0-100
  factors: MatchFactor[];
  recommendations: string[];
}

export interface MatchFactor {
  category: 'skills' | 'experience' | 'location' | 'education';
  score: number; // 0-100
  weight: number; // 0-1
  explanation: string;
  matchedItems?: string[];
  missingItems?: string[];
}

export interface UserProfile {
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'candidate' | 'recruiter';
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface JobMatchResult {
  job: Job;
  matchScore: MatchScore;
}
