import React, { useState, useEffect } from 'react';

const DistractionBlocker = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [blockedSites, setBlockedSites] = useState([
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'youtube.com',
    'reddit.com',
    'netflix.com'
  ]);
  const [newSite, setNewSite] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load blocked sites from localStorage
    const savedSites = localStorage.getItem('blockedSites');
    if (savedSites) {
      setBlockedSites(JSON.parse(savedSites));
    }
  }, []);

  useEffect(() => {
    // Save blocked sites to localStorage
    localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
  }, [blockedSites]);

  useEffect(() => {
    let interval;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleBlockEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  const handleBlockEnd = () => {
    setIsActive(false);
    // In a real app, this would disable the content script
    alert('🚫 Distraction block ended! Time to take a break.');
  };

  const startBlocking = (minutes) => {
    setIsActive(true);
    setTimeRemaining(minutes * 60);
    
    // In a real Chrome extension, this would:
    // 1. Send message to background script
    // 2. Background script would update extension storage
    // 3. Content script would block sites
    
    alert(`🚫 Distraction blocker active for ${minutes} minutes!`);
  };

  const stopBlocking = () => {
    setIsActive(false);
    setTimeRemaining(0);
    alert('Distraction blocker disabled.');
  };

  const addSite = () => {
    if (newSite.trim() && !blockedSites.includes(newSite.trim())) {
      setBlockedSites([...blockedSites, newSite.trim()]);
      setNewSite('');
    }
  };

  const removeSite = (site) => {
    setBlockedSites(blockedSites.filter(s => s !== site));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Distraction Blocker</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowSettings(!showSettings)}
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            ⚙️ Settings
          </button>
          <div style={{ 
            background: isActive ? 'var(--success)' : 'var(--danger)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {isActive ? '🛡️ Active' : '⚠️ Inactive'}
          </div>
        </div>
      </div>

      {isActive ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '15px',
            color: 'var(--success)'
          }}>
            🛡️
          </div>
          <h3 style={{ marginBottom: '10px' }}>Focus Mode Active</h3>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            marginBottom: '20px',
            color: 'var(--accent-blue)'
          }}>
            {formatTime(timeRemaining)}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Distracting sites are currently blocked
          </p>
          <button 
            className="btn btn-primary"
            onClick={stopBlocking}
            style={{ background: 'var(--danger)' }}
          >
            Stop Blocking
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Block distracting websites during focus sessions
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => startBlocking(25)}
              style={{ padding: '15px', fontSize: '14px' }}
            >
              25 min
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => startBlocking(50)}
              style={{ padding: '15px', fontSize: '14px' }}
            >
              50 min
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => startBlocking(90)}
              style={{ padding: '15px', fontSize: '14px' }}
            >
              90 min
            </button>
          </div>

          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '15px', 
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '10px', 
                height: '10px', 
                borderRadius: '50%',
                background: 'var(--success)'
              }} />
              <span style={{ fontWeight: '600' }}>How it works:</span>
            </div>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px', 
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }}>
              <li>Blocks distracting websites during focus sessions</li>
              <li>Shows motivational messages instead</li>
              <li>Automatically disables when timer ends</li>
              <li>Customize your blocked sites list</li>
            </ul>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          marginTop: '20px',
          padding: '20px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Blocked Websites</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                className="input-field"
                placeholder="Add website (e.g., youtube.com)"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                className="btn btn-primary"
                onClick={addSite}
                style={{ padding: '10px 20px' }}
              >
                Add
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
              Enter domain only (no http:// or www)
            </p>
          </div>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: '8px',
            padding: '15px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {blockedSites.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No sites blocked yet
              </p>
            ) : (
              blockedSites.map((site, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%',
                      background: 'var(--danger)'
                    }} />
                    <span>{site}</span>
                  </div>
                  <button 
                    onClick={() => removeSite(site)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      fontSize: '20px',
                      padding: '0 5px'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            ⚠️ Note: This is a demo. In a Chrome extension, this would actually block websites.
          </div>
        </div>
      )}
    </div>
  );
};

export default DistractionBlocker;