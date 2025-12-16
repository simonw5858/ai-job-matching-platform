import React, { useEffect, useState } from 'react';
import { jobAPI } from '../services/api';
import { Job } from '../types';

const RecruiterDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: '',
    experienceRequired: 0,
    location: '',
    salaryMin: 0,
    salaryMax: 0,
    employmentType: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'remote',
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobAPI.getMyJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const jobData = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
        salary: {
          min: formData.salaryMin,
          max: formData.salaryMax,
        },
      };

      await jobAPI.createJob(jobData);
      setShowCreateForm(false);
      setFormData({
        title: '',
        company: '',
        description: '',
        requiredSkills: '',
        experienceRequired: 0,
        location: '',
        salaryMin: 0,
        salaryMax: 0,
        employmentType: 'full-time',
      });
      loadJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId);
        loadJobs();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const toggleJobStatus = async (job: Job) => {
    try {
      await jobAPI.updateJob(job.id, { isActive: !job.isActive });
      loadJobs();
    } catch (error) {
      console.error('Failed to update job:', error);
    }
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
          <h1>Recruiter Dashboard</h1>
          <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
            Manage your job postings and find the best candidates
          </p>
        </div>
        <button
          className="btn btn-success"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <div className="value">{jobs.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Jobs</h3>
          <div className="value">{jobs.filter(j => j.isActive).length}</div>
        </div>
        <div className="stat-card">
          <h3>Inactive Jobs</h3>
          <div className="value">{jobs.filter(j => !j.isActive).length}</div>
        </div>
      </div>

      {showCreateForm && (
        <div className="card">
          <h2>Create New Job Posting</h2>
          <form onSubmit={handleCreateJob}>
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                type="text"
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requiredSkills">Required Skills (comma-separated) *</label>
              <input
                type="text"
                id="requiredSkills"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                placeholder="e.g., JavaScript, React, Node.js"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="experienceRequired">Years of Experience Required</label>
                <input
                  type="number"
                  id="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={(e) => setFormData({ ...formData, experienceRequired: parseInt(e.target.value, 10) || 0 })}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="salaryMin">Minimum Salary ($) *</label>
                <input
                  type="number"
                  id="salaryMin"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value, 10) || 0 })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaryMax">Maximum Salary ($) *</label>
                <input
                  type="number"
                  id="salaryMax"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value, 10) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="employmentType">Employment Type *</label>
              <select
                id="employmentType"
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success">
              Create Job Posting
            </button>
          </form>
        </div>
      )}

      <h2>Your Job Postings</h2>
      
      {jobs.length === 0 ? (
        <div className="card">
          <p>You haven't posted any jobs yet. Click "Post New Job" to get started!</p>
        </div>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3>{job.title}</h3>
                  <p style={{ color: '#7f8c8d' }}>{job.company}</p>
                  <p style={{ color: '#95a5a6', fontSize: '0.9rem' }}>📍 {job.location}</p>
                  
                  <div className="skills" style={{ marginTop: '1rem' }}>
                    {job.requiredSkills.map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>

                  <p style={{ marginTop: '1rem', color: '#2c3e50' }}>
                    💰 ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    background: job.isActive ? '#d5f4e6' : '#fadbd8',
                    color: job.isActive ? '#27ae60' : '#e74c3c',
                  }}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => toggleJobStatus(job)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {job.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteJob(job.id)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
