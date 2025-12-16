import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../types';

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      const data: RegisterRequest = req.body;

      // Validation
      if (!data.email || !data.password || !data.name || !data.role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!['candidate', 'recruiter'].includes(data.role)) {
        return res.status(400).json({ error: 'Invalid role. Must be candidate or recruiter' });
      }

      const result = await authService.register(data);
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const data: LoginRequest = req.body;

      // Validation
      if (!data.email || !data.password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await authService.login(data);
      
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }

  /**
   * Get current user profile
   */
  getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      
      const profile = authService.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export const authController = new AuthController();
