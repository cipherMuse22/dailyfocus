import React, { useState } from 'react';
import { api } from '../api';

const SessionModal = ({ onClose, onSessionAdded }) => {
  const [duration, setDuration] = useState(25);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.addSession({
        date: new Date().toISOString().split('T')[0],
        duration,
        notes,
        taskId: Date.now().toString()
      });
      
      onSessionAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '90%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Add Focus Session</h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Duration (minutes)
            </label>
            <select
              className="input-field"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            >
              <option value="15">15 minutes</option>
              <option value="25">25 minutes (Pomodoro)</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Notes (optional)
            </label>
            <textarea
              className="input-field"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="What did you work on?"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="btn"
              onClick={onClose}
              style={{ flex: 1, background: 'transparent', border: '1px solid var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionModal;