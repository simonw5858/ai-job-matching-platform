import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <h1>🤖 AI Job Matching</h1>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard">
              {user.role === 'recruiter' ? 'Dashboard' : 'My Matches'}
            </Link>
            <span style={{ color: '#95a5a6' }}>|</span>
            <span>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
