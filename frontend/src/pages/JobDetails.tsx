import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchAPI } from '../services/api';
import { JobMatchResult } from '../types';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadJobMatch(id);
    }
  }, [id]);

  const loadJobMatch = async (jobId: string) => {
    try {
      const data = await matchAPI.getJobMatch(jobId);
      setMatch(data);
    } catch (error) {
      console.error('Failed to load job match:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container">
        <div className="card">
          <h2>Job not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { job, matchScore } = match;

  return (
    <div className="container">
      <button
        className="btn btn-secondary"
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '1rem' }}
      >
        ← Back to Matches
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{job.title}</h1>
            <h3 style={{ color: '#7f8c8d', fontWeight: 'normal' }}>{job.company}</h3>
            <p style={{ color: '#95a5a6', marginTop: '0.5rem' }}>📍 {job.location}</p>
          </div>
          <div className={`score-badge ${getScoreClass(matchScore.overallScore)}`}>
            {matchScore.overallScore}% Match
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>💰 Salary</h3>
          <p style={{ fontSize: '1.2rem', color: '#2c3e50' }}>
            ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
          </p>
          <p style={{ color: '#7f8c8d' }}>{job.employmentType}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>About the Role</h3>
          <p style={{ lineHeight: '1.6', color: '#2c3e50' }}>{job.description}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Required Skills</h3>
          <div className="skills">
            {job.requiredSkills.map((skill) => {
              const isMatched = user?.skills.some(
                s => s.toLowerCase() === skill.toLowerCase()
              );
              return (
                <span
                  key={skill}
                  className={`skill-tag ${isMatched ? 'matched' : 'missing'}`}
                >
                  {skill} {isMatched ? '✓' : ''}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Experience Required</h3>
          <p style={{ color: '#2c3e50' }}>
            {job.experienceRequired} years
            {user && (
              <span style={{ marginLeft: '1rem', color: '#7f8c8d' }}>
                (You have {user.experience} years)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Match Score Breakdown */}
      <div className="card match-score">
        <h2>AI Match Analysis</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>
          Our AI analyzed your profile against this job's requirements
        </p>

        <div className="match-factors">
          {matchScore.factors.map((factor) => (
            <div key={factor.category} className="match-factor">
              <h4>{factor.category} Match</h4>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${getScoreClass(factor.score)}`}
                  style={{ width: `${factor.score}%` }}
                ></div>
              </div>
              <p>
                <strong>{Math.round(factor.score)}%</strong> - {factor.explanation}
              </p>
              
              {factor.matchedItems && factor.matchedItems.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <small style={{ color: '#27ae60' }}>
                    ✓ Matched: {factor.matchedItems.join(', ')}
                  </small>
                </div>
              )}
              
              {factor.missingItems && factor.missingItems.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <small style={{ color: '#e74c3c' }}>
                    ✗ Missing: {factor.missingItems.join(', ')}
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>

        {matchScore.recommendations.length > 0 && (
          <div className="recommendations">
            <h4>💡 Recommendations for You</h4>
            <ul>
              {matchScore.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Apply for This Position
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
