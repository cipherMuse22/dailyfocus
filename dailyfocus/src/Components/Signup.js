import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const result = await signup(email, password, name);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--primary-bg)',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            background: 'var(--gradient-blue)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '10px'
          }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Join FocusFlow and boost your productivity
          </p>
        </div>
        
        {error && (
          <div style={{
            background: 'var(--danger)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <input
              className="input-field"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              Must be at least 6 characters
            </p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Confirm Password
            </label>
            <input
              className="input-field"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          
          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Home
          </Link>
        </div>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          background: 'rgba(59, 130, 246, 0.1)', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            <strong>Note:</strong> All data is stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;