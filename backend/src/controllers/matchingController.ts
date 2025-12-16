import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { matchingService } from '../services/matchingService';

export class MatchingController {
  /**
   * Get job matches for the current user
   */
  getMatches(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 10;

      const matches = matchingService.findMatchingJobs(userId, limit);
      
      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Get match score for a specific job
   */
  getJobMatch(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { jobId } = req.params;

      const match = matchingService.getJobMatchScore(userId, jobId);
      
      if (!match) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export const matchingController = new MatchingController();
