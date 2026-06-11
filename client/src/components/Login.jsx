import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, loading, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in context, but we can do extra handling here if needed
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel glass-panel">
        <div className="auth-header">
          <div className="auth-logo">Thiranex</div>
          <p>Collaborative Task Workspace</p>
        </div>

        {(localError || error) && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email or Username</label>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Mail size={16} style={{ left: '0.85rem' }} />
              <input
                id="email"
                type="text"
                className="form-control"
                placeholder="Enter email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password">Password</label>
            <div className="search-box" style={{ maxWidth: '100%' }}>
              <Lock size={16} style={{ left: '0.85rem' }} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
