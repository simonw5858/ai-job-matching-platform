import { User, Job, MatchScore, MatchFactor, JobMatchResult } from '../types';
import { db } from '../models/database';

export class MatchingService {
  private skillWeight = 0.4;
  private experienceWeight = 0.3;
  private locationWeight = 0.2;
  private educationWeight = 0.1;

  /**
   * Calculate match score between a user and a job
   * Returns an explainable AI match score with detailed factors
   */
  calculateMatchScore(user: User, job: Job): MatchScore {
    const factors: MatchFactor[] = [];

    // 1. Skills matching
    const skillsFactor = this.calculateSkillsMatch(user.skills, job.requiredSkills);
    factors.push(skillsFactor);

    // 2. Experience matching
    const experienceFactor = this.calculateExperienceMatch(user.experience, job.experienceRequired);
    factors.push(experienceFactor);

    // 3. Location matching
    const locationFactor = this.calculateLocationMatch(user.location, job.location);
    factors.push(locationFactor);

    // 4. Education matching (basic implementation)
    const educationFactor = this.calculateEducationMatch(user.education);
    factors.push(educationFactor);

    // Calculate weighted overall score
    const overallScore = Math.round(
      factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0)
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(factors, user, job);

    const matchScore: MatchScore = {
      jobId: job.id,
      userId: user.id,
      overallScore,
      factors,
      recommendations,
    };

    // Save the match score
    db.saveMatchScore(user.id, matchScore);

    return matchScore;
  }

  /**
   * Calculate skills match with detailed explanation
   */
  private calculateSkillsMatch(userSkills: string[], requiredSkills: string[]): MatchFactor {
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
    const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase().trim());

    const matchedSkills = normalizedRequiredSkills.filter(skill =>
      normalizedUserSkills.includes(skill)
    );
    const missingSkills = normalizedRequiredSkills.filter(skill =>
      !normalizedUserSkills.includes(skill)
    );

    const matchPercentage = requiredSkills.length > 0
      ? (matchedSkills.length / requiredSkills.length) * 100
      : 0;

    let explanation = '';
    if (matchedSkills.length === requiredSkills.length) {
      explanation = `Perfect match! You have all ${requiredSkills.length} required skills.`;
    } else if (matchedSkills.length > 0) {
      explanation = `You match ${matchedSkills.length} out of ${requiredSkills.length} required skills (${Math.round(matchPercentage)}%).`;
    } else {
      explanation = `No matching skills found. Consider learning the required skills.`;
    }

    return {
      category: 'skills',
      score: matchPercentage,
      weight: this.skillWeight,
      explanation,
      matchedItems: matchedSkills,
      missingItems: missingSkills,
    };
  }

  /**
   * Calculate experience match with explanation
   */
  private calculateExperienceMatch(userExperience: number, requiredExperience: number): MatchFactor {
    let score = 0;
    let explanation = '';

    if (userExperience >= requiredExperience) {
      // User has enough or more experience
      const excess = userExperience - requiredExperience;
      score = 100;
      if (excess === 0) {
        explanation = `Your experience (${userExperience} years) exactly matches the requirement.`;
      } else if (excess <= 2) {
        explanation = `Great fit! You have ${userExperience} years of experience, exceeding the ${requiredExperience} year requirement.`;
      } else {
        explanation = `You're highly experienced with ${userExperience} years (${excess} years above requirement).`;
      }
    } else {
      // User has less experience
      const gap = requiredExperience - userExperience;
      score = Math.max(0, 100 - (gap / requiredExperience) * 50);
      
      if (gap <= 1) {
        explanation = `You're close! You have ${userExperience} years, just ${gap} year short of the ${requiredExperience} year requirement.`;
      } else {
        explanation = `You have ${userExperience} years of experience. This role requires ${requiredExperience} years (${gap} years gap).`;
      }
    }

    return {
      category: 'experience',
      score,
      weight: this.experienceWeight,
      explanation,
    };
  }

  /**
   * Calculate location match
   */
  private calculateLocationMatch(userLocation: string, jobLocation: string): MatchFactor {
    const normalizedUserLoc = userLocation.toLowerCase().trim();
    const normalizedJobLoc = jobLocation.toLowerCase().trim();

    let score = 0;
    let explanation = '';

    if (normalizedJobLoc === 'remote') {
      score = 100;
      explanation = 'This is a remote position, location is not a constraint.';
    } else if (normalizedUserLoc === normalizedJobLoc) {
      score = 100;
      explanation = `Perfect! Your location (${userLocation}) matches the job location.`;
    } else {
      // Check if same state or nearby (simplified logic)
      const userParts = normalizedUserLoc.split(',').map(s => s.trim());
      const jobParts = normalizedJobLoc.split(',').map(s => s.trim());
      
      const hasCommonPart = userParts.some(part => jobParts.includes(part));
      
      if (hasCommonPart) {
        score = 70;
        explanation = `Similar location. You're in ${userLocation}, job is in ${jobLocation}.`;
      } else {
        score = 30;
        explanation = `Different location. You're in ${userLocation}, job is in ${jobLocation}. Relocation may be required.`;
      }
    }

    return {
      category: 'location',
      score,
      weight: this.locationWeight,
      explanation,
    };
  }

  /**
   * Calculate education match (simplified)
   */
  private calculateEducationMatch(userEducation: string): MatchFactor {
    const score = userEducation ? 80 : 50;
    const explanation = userEducation
      ? `Your education background (${userEducation}) is considered for this role.`
      : 'Education information is minimal. Consider updating your profile.';

    return {
      category: 'education',
      score,
      weight: this.educationWeight,
      explanation,
    };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(factors: MatchFactor[], user: User, job: Job): string[] {
    const recommendations: string[] = [];

    // Skills recommendations
    const skillsFactor = factors.find(f => f.category === 'skills');
    if (skillsFactor && skillsFactor.missingItems && skillsFactor.missingItems.length > 0) {
      if (skillsFactor.missingItems.length <= 2) {
        recommendations.push(`Learn ${skillsFactor.missingItems.join(' and ')} to become a perfect match!`);
      } else {
        const topMissing = skillsFactor.missingItems.slice(0, 2);
        recommendations.push(`Focus on learning ${topMissing.join(' and ')} to improve your match score.`);
      }
    }

    // Experience recommendations
    const experienceFactor = factors.find(f => f.category === 'experience');
    if (experienceFactor && experienceFactor.score < 100) {
      if (job.experienceRequired - user.experience <= 1) {
        recommendations.push('Your experience is close! Highlight relevant projects to strengthen your application.');
      } else {
        recommendations.push('Consider applying anyway! Many companies value passion and quick learning.');
      }
    }

    // Location recommendations
    const locationFactor = factors.find(f => f.category === 'location');
    if (locationFactor && locationFactor.score < 70) {
      recommendations.push('Research relocation options or inquire about remote work flexibility.');
    }

    // General positive recommendation
    const overallScore = Math.round(
      factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0)
    );
    if (overallScore >= 80) {
      recommendations.push('Strong match! This could be a great opportunity for you.');
    } else if (overallScore >= 60) {
      recommendations.push('Decent match! Tailor your resume to highlight relevant skills.');
    }

    return recommendations.length > 0 ? recommendations : ['Keep improving your skills and gaining experience!'];
  }

  /**
   * Find best matching jobs for a user
   */
  findMatchingJobs(userId: string, limit: number = 10): JobMatchResult[] {
    const user = db.getUserById(userId);
    if (!user) {
      return [];
    }

    const activeJobs = db.getActiveJobs();
    const results: JobMatchResult[] = [];

    for (const job of activeJobs) {
      const matchScore = this.calculateMatchScore(user, job);
      results.push({
        job,
        matchScore,
      });
    }

    // Sort by overall score (descending)
    results.sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore);

    return results.slice(0, limit);
  }

  /**
   * Get match score for a specific job
   */
  getJobMatchScore(userId: string, jobId: string): JobMatchResult | null {
    const user = db.getUserById(userId);
    const job = db.getJobById(jobId);

    if (!user || !job) {
      return null;
    }

    const matchScore = this.calculateMatchScore(user, job);
    
    return {
      job,
      matchScore,
    };
  }
}

export const matchingService = new MatchingService();
