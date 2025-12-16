import { User, Job, MatchScore } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory database (for demo purposes)
// In production, use PostgreSQL, MongoDB, etc.

class Database {
  private users: Map<string, User> = new Map();
  private jobs: Map<string, Job> = new Map();
  private matchScores: Map<string, MatchScore[]> = new Map(); // userId -> scores

  // User operations
  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: uuidv4(),
      ...user,
      createdAt: new Date(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Job operations
  createJob(job: Omit<Job, 'id' | 'postedAt'>): Job {
    const newJob: Job = {
      id: uuidv4(),
      ...job,
      postedAt: new Date(),
    };
    this.jobs.set(newJob.id, newJob);
    return newJob;
  }

  getJobById(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  getActiveJobs(): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.isActive);
  }

  getJobsByRecruiter(recruiterId: string): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.recruiterId === recruiterId);
  }

  updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  deleteJob(id: string): boolean {
    return this.jobs.delete(id);
  }

  // Match score operations
  saveMatchScore(userId: string, matchScore: MatchScore): void {
    const scores = this.matchScores.get(userId) || [];
    
    // Update if exists, otherwise add
    const index = scores.findIndex(s => s.jobId === matchScore.jobId);
    if (index >= 0) {
      scores[index] = matchScore;
    } else {
      scores.push(matchScore);
    }
    
    this.matchScores.set(userId, scores);
  }

  getMatchScores(userId: string): MatchScore[] {
    return this.matchScores.get(userId) || [];
  }

  getMatchScore(userId: string, jobId: string): MatchScore | undefined {
    const scores = this.matchScores.get(userId) || [];
    return scores.find(s => s.jobId === jobId);
  }

  // Seed data for demo
  seedData(): void {
    // Create sample jobs
    const sampleJobs: Omit<Job, 'id' | 'postedAt'>[] = [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        description: 'We are looking for an experienced Full Stack Developer with expertise in React and Node.js to join our team.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs'],
        experienceRequired: 5,
        location: 'San Francisco, CA',
        salary: { min: 120000, max: 180000 },
        employmentType: 'full-time',
        recruiterId: 'recruiter-1',
        isActive: true,
      },
      {
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        description: 'Join our innovative team building next-gen web applications with React and modern frontend technologies.',
        requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'Redux', 'TypeScript'],
        experienceRequired: 3,
        location: 'Remote',
        salary: { min: 80000, max: 120000 },
        employmentType: 'remote',
        recruiterId: 'recruiter-1',
        isActive: true,
      },
      {
        title: 'Backend Engineer',
        company: 'CloudSystems',
        description: 'Seeking a talented backend engineer with strong experience in Node.js and microservices architecture.',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS', 'Microservices'],
        experienceRequired: 4,
        location: 'New York, NY',
        salary: { min: 110000, max: 150000 },
        employmentType: 'full-time',
        recruiterId: 'recruiter-2',
        isActive: true,
      },
      {
        title: 'UI/UX Designer',
        company: 'DesignHub',
        description: 'Creative UI/UX designer needed to create beautiful and intuitive user experiences.',
        requiredSkills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'User Testing'],
        experienceRequired: 3,
        location: 'Austin, TX',
        salary: { min: 75000, max: 105000 },
        employmentType: 'full-time',
        recruiterId: 'recruiter-2',
        isActive: true,
      },
      {
        title: 'DevOps Engineer',
        company: 'Infrastructure Co.',
        description: 'Experienced DevOps engineer to manage our cloud infrastructure and CI/CD pipelines.',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
        experienceRequired: 5,
        location: 'Seattle, WA',
        salary: { min: 130000, max: 170000 },
        employmentType: 'full-time',
        recruiterId: 'recruiter-1',
        isActive: true,
      },
    ];

    sampleJobs.forEach(job => this.createJob(job));
  }
}

export const db = new Database();
db.seedData();
