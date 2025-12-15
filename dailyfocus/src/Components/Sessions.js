import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await api.getSessions();
    setSessions(data);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Focus Sessions</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add Session
        </button>
      </div>
      
      <div>
        {sessions.map(session => (
          <div 
            key={session.id} 
            className="task-item"
            style={{ marginBottom: '10px' }}
          >
            <div>
              <div style={{ fontWeight: '600' }}>
                {new Date(session.date).toLocaleDateString()}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Duration: {session.duration} minutes
              </div>
              {session.notes && (
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '5px' }}>
                  {session.notes}
                </div>
              )}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600' }}>
              {session.duration}min
            </div>
          </div>
        ))}
        
        {sessions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No focus sessions recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;