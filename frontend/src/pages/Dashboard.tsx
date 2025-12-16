import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { matchAPI } from '../services/api';
import { JobMatchResult } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<JobMatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await matchAPI.getMatches(10);
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
            Here are your top job matches based on your profile
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Matches</h3>
          <div className="value">{matches.length}</div>
        </div>
        <div className="stat-card">
          <h3>Strong Matches</h3>
          <div className="value">{matches.filter(m => m.matchScore.overallScore >= 80).length}</div>
        </div>
        <div className="stat-card">
          <h3>Your Skills</h3>
          <div className="value">{user?.skills.length || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Experience</h3>
          <div className="value">{user?.experience} years</div>
        </div>
      </div>

      <h2>Your Job Matches</h2>
      
      {matches.length === 0 ? (
        <div className="card">
          <p>No job matches found. Try updating your skills and profile!</p>
        </div>
      ) : (
        <div className="job-list">
          {matches.map((match) => (
            <div
              key={match.job.id}
              className="job-card"
              onClick={() => handleJobClick(match.job.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3>{match.job.title}</h3>
                  <div className="company">{match.job.company}</div>
                  <div className="location">📍 {match.job.location}</div>
                </div>
                <div className={`score-badge ${getScoreClass(match.matchScore.overallScore)}`}>
                  {match.matchScore.overallScore}%
                </div>
              </div>

              <div className="skills">
                {match.job.requiredSkills.slice(0, 5).map((skill) => {
                  const isMatched = user?.skills.some(
                    s => s.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={skill}
                      className={`skill-tag ${isMatched ? 'matched' : 'missing'}`}
                    >
                      {skill}
                    </span>
                  );
                })}
                {match.job.requiredSkills.length > 5 && (
                  <span className="skill-tag">+{match.job.requiredSkills.length - 5} more</span>
                )}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <strong>💰 ${match.job.salary.min.toLocaleString()} - ${match.job.salary.max.toLocaleString()}</strong>
                <span style={{ marginLeft: '1rem', color: '#7f8c8d' }}>
                  {match.job.employmentType}
                </span>
              </div>

              {match.matchScore.recommendations.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '0.5rem', background: '#e8f4fd', borderRadius: '4px' }}>
                  <small style={{ color: '#2c3e50' }}>
                    💡 {match.matchScore.recommendations[0]}
                  </small>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
