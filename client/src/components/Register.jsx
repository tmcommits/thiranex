import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { register, loading, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setLocalError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    try {
      await register(username, email, password);
    } catch (err) {
      // Error is handled in context
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel glass-panel">
        <div className="auth-header">
          <div className="auth-logo">Thiranex</div>
          <p>Create your developer workspace account</p>
        </div>

        {(localError || error) && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <User size={16} style={{ left: '0.85rem' }} />
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Mail size={16} style={{ left: '0.85rem' }} />
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Lock size={16} style={{ left: '0.85rem' }} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Lock size={16} style={{ left: '0.85rem' }} />
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="primary-btn" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : (
              <>
                <UserPlus size={18} />
                <span>Sign Up</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
            Log In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
