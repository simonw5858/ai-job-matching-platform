import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { db } from '../models/database';

export class UserController {
  /**
   * Update user profile
   */
  updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const updates = req.body;

      // Don't allow updating sensitive fields
      delete updates.id;
      delete updates.password;
      delete updates.email;
      delete updates.createdAt;

      const updatedUser = db.updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove password from response
      const { password, ...userProfile } = updatedUser;
      
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  /**
   * Update user skills
   */
  updateSkills(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { skills } = req.body;

      if (!Array.isArray(skills)) {
        return res.status(400).json({ error: 'Skills must be an array' });
      }

      const updatedUser = db.updateUser(userId, { skills });
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { password, ...userProfile } = updatedUser;
      
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export const userController = new UserController();
