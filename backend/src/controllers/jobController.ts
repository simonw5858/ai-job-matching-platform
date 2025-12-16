import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../models/database';
import { Job } from '../types';

export class JobController {
  /**
   * Create a new job posting (recruiter only)
   */
  createJob(req: AuthRequest, res: Response) {
    try {
      const recruiterId = req.userId!;
      const jobData = req.body;

      // Validation
      if (!jobData.title || !jobData.company || !jobData.description) {
        return res.status(400).json({ error: 'Missing required fields: title, company, description' });
      }

      if (!jobData.requiredSkills || !Array.isArray(jobData.requiredSkills)) {
        return res.status(400).json({ error: 'Required skills must be an array' });
      }

      const job = db.createJob({
        ...jobData,
        recruiterId,
        isActive: true,
      });

      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get all jobs (with optional filters)
   */
  getAllJobs(req: AuthRequest, res: Response) {
    try {
      const { location, skills, employmentType } = req.query;
      
      let jobs = db.getActiveJobs();

      // Apply filters
      if (location) {
        const searchLocation = (location as string).toLowerCase();
        jobs = jobs.filter(job => 
          job.location.toLowerCase().includes(searchLocation)
        );
      }

      if (skills) {
        const searchSkills = (skills as string).split(',').map(s => s.toLowerCase().trim());
        jobs = jobs.filter(job =>
          job.requiredSkills.some(skill =>
            searchSkills.includes(skill.toLowerCase())
          )
        );
      }

      if (employmentType) {
        jobs = jobs.filter(job => job.employmentType === employmentType);
      }

      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get a specific job by ID
   */
  getJobById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      
      const job = db.getJobById(id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get jobs posted by the current recruiter
   */
  getMyJobs(req: AuthRequest, res: Response) {
    try {
      const recruiterId = req.userId!;
      
      const jobs = db.getJobsByRecruiter(recruiterId);
      
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Update a job (recruiter only, own jobs)
   */
  updateJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const recruiterId = req.userId!;
      const updates = req.body;

      const job = db.getJobById(id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if the recruiter owns this job
      if (job.recruiterId !== recruiterId) {
        return res.status(403).json({ error: 'You can only update your own jobs' });
      }

      // Don't allow updating certain fields
      delete updates.id;
      delete updates.recruiterId;
      delete updates.postedAt;

      const updatedJob = db.updateJob(id, updates);
      
      res.status(200).json(updatedJob);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Delete a job (recruiter only, own jobs)
   */
  deleteJob(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const recruiterId = req.userId!;

      const job = db.getJobById(id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if the recruiter owns this job
      if (job.recruiterId !== recruiterId) {
        return res.status(403).json({ error: 'You can only delete your own jobs' });
      }

      db.deleteJob(id);
      
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export const jobController = new JobController();
