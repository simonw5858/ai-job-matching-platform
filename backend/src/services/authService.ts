import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserProfile, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { db } from '../models/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = db.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = db.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      skills: [],
      experience: 0,
      location: '',
      education: '',
      bio: '',
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      token,
      user: this.toUserProfile(user),
    };
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = db.getUserByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      token,
      user: this.toUserProfile(user),
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string; email: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  /**
   * Convert User to UserProfile (remove sensitive data)
   */
  private toUserProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      skills: user.skills,
      experience: user.experience,
      location: user.location,
      education: user.education,
      bio: user.bio,
    };
  }

  /**
   * Get user profile by ID
   */
  getUserProfile(userId: string): UserProfile | null {
    const user = db.getUserById(userId);
    if (!user) {
      return null;
    }
    return this.toUserProfile(user);
  }
}

export const authService = new AuthService();
