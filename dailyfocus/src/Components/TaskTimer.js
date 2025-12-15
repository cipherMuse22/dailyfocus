import React, { useState, useEffect } from 'react';

const TaskTimer = ({ task, onComplete, onStop }) => {
  const [timeLeft, setTimeLeft] = useState(task.duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3>Focus Timer: {task.title}</h3>
      <div style={{ fontSize: '4rem', fontWeight: '700', margin: '20px 0' }}>
        {formatTime(timeLeft)}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          className="btn btn-primary"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => setTimeLeft(task.duration * 60)}
        >
          Reset
        </button>
        <button 
          className="btn"
          onClick={onStop}
          style={{ background: 'var(--danger)', color: 'white' }}
        >
          Stop
        </button>
      </div>
      <div style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>
        {task.duration} minute focus session
      </div>
    </div>
  );
};

export default TaskTimer;