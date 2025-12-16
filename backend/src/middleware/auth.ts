import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Middleware to verify JWT token and authenticate requests
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to check if user is a recruiter
 */
export const requireRecruiter = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userProfile = authService.getUserProfile(req.userId);
    if (!userProfile || userProfile.role !== 'recruiter') {
      return res.status(403).json({ error: 'Recruiter access required' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
