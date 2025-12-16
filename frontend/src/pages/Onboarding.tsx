import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Onboarding: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [experience, setExperience] = useState(user?.experience || 0);
  const [location, setLocation] = useState(user?.location || '');
  const [education, setEducation] = useState(user?.education || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const updatedUser = await userAPI.updateProfile({
        skills,
        experience,
        location,
        education,
        bio,
      });
      updateUser(updatedUser);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-narrow onboarding">
      <div className="card">
        <h2>Complete Your Profile</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
          Help us find the perfect job matches for you!
        </p>

        {error && <div className="error-message">{error}</div>}

        {/* Step 1: Skills */}
        {step === 1 && (
          <div>
            <h3>What are your skills?</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
              Add skills that you're proficient in. Press Enter after each skill.
            </p>
            
            <div className="skill-input-container">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., JavaScript, React, Node.js"
              />
              <button type="button" className="btn btn-primary" onClick={addSkill}>
                Add
              </button>
            </div>

            {skills.length > 0 && (
              <div className="skills-list">
                {skills.map((skill) => (
                  <div key={skill} className="skill-item">
                    {skill}
                    <button onClick={() => removeSkill(skill)}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={skills.length === 0}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Experience & Location */}
        {step === 2 && (
          <div>
            <h3>Tell us about your experience</h3>
            
            <div className="form-group">
              <label htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                value={experience}
                onChange={(e) => setExperience(parseInt(e.target.value, 10) || 0)}
                min="0"
                max="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Education & Bio */}
        {step === 3 && (
          <div>
            <h3>A bit more about you</h3>
            
            <div className="form-group">
              <label htmlFor="education">Education</label>
              <input
                type="text"
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g., BS in Computer Science"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself, your career goals, and what you're looking for..."
              />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
