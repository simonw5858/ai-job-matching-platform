import axios from 'axios';
import { AuthResponse, LoginData, RegisterData, User, Job, JobMatchResult } from '../types';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// User API
export const userAPI = {
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  updateSkills: async (skills: string[]): Promise<User> => {
    const response = await api.put('/user/skills', { skills });
    return response.data;
  },
};

// Job API
export const jobAPI = {
  getAllJobs: async (filters?: { location?: string; skills?: string; employmentType?: string }): Promise<Job[]> => {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  },

  getJobById: async (id: string): Promise<Job> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: Partial<Job>): Promise<Job> => {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  getMyJobs: async (): Promise<Job[]> => {
    const response = await api.get('/jobs/my/jobs');
    return response.data;
  },

  updateJob: async (id: string, data: Partial<Job>): Promise<Job> => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },
};

// Matching API
export const matchAPI = {
  getMatches: async (limit?: number): Promise<JobMatchResult[]> => {
    const response = await api.get('/matches', { params: { limit } });
    return response.data;
  },

  getJobMatch: async (jobId: string): Promise<JobMatchResult> => {
    const response = await api.get(`/matches/job/${jobId}`);
    return response.data;
  },
};

export default api;
