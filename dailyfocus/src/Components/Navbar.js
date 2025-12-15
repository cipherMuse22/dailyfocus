import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="nav-logo">
          FocusFlow
        </div>
        <div style={{ 
          background: 'var(--gradient-blue)', 
          padding: '8px 16px', 
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {currentTime}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div className="nav-menu">git config --global user.name "Mpho Mokoena"
git config --global user.email "mpho@email.com"

          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Calendar
          </NavLink>
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Analytics
          </NavLink>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'var(--gradient-blue)',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </button>
          
          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '10px',
              minWidth: '200px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <p style={{ margin: 0, fontWeight: '600' }}>{user?.name || 'User'}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  marginTop: '5px'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
<button 
  onClick={() => {
    if (window.confirm('This will reset all your data to empty. Continue?')) {
      // Call reset function from AuthContext
      // You'll need to add this function to AuthContext
    }
  }}
  style={{
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '6px',
    marginTop: '5px'
  }}
  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
  onMouseLeave={(e) => e.target.style.background = 'transparent'}
>
  Reset All Data
</button>

<button 
  onClick={() => {
    // You'll need to pass resetUserData as a prop or use context
    // For now, we'll handle this in Dashboard component
    window.location.href = '/dashboard?reset=true';
  }}
  style={{
    width: '100%',
    padding: '10px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '6px',
    marginTop: '5px'
  }}
  onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
  onMouseLeave={(e) => e.target.style.background = 'transparent'}
>
  Reset All Data
</button>
    </nav>
  );

};

export default Navbar;