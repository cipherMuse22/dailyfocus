import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';

const PomodoroTimer = ({ onComplete, taskTitle }) => {
  const { userStats, updateStats } = useAuth();
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [autoStartNext, setAutoStartNext] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    pomodorosUntilLongBreak: 4
  });
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const playSound = (soundName) => {
    // Create notification sound
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = soundName === 'complete' ? 800 : 400;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      
    } catch (error) {
      console.log('Audio not supported, using fallback');
      // Fallback: Try to play a simple beep
      const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Set initial time based on mode
    let initialTime = 0;
    switch(mode) {
      case 'focus':
        initialTime = settings.focusTime * 60;
        break;
      case 'shortBreak':
        initialTime = settings.shortBreak * 60;
        break;
      case 'longBreak':
        initialTime = settings.longBreak * 60;
        break;
    }
    setTimeLeft(initialTime);
  }, [mode, settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    playSound('complete');
    
    if (mode === 'focus') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      // Update user stats
      updateStats({
        completedTasks: (userStats?.completedTasks || 0) + 1
      });
      
      // Check if it's time for a long break
      if (newCount % settings.pomodorosUntilLongBreak === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
      
      // Notify parent component
      if (onComplete) {
        onComplete();
      }
    } else {
      // Break finished, go back to focus
      setMode('focus');
    }
    
    if (autoStartNext) {
      setTimeout(() => {
        setIsActive(true);
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeColor = () => {
    switch(mode) {
      case 'focus': return 'var(--accent-blue)';
      case 'shortBreak': return 'var(--success)';
      case 'longBreak': return 'var(--accent-purple)';
      default: return 'var(--accent-blue)';
    }
  };

  const getModeLabel = () => {
    switch(mode) {
      case 'focus': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Focus';
    }
  };

  const handleSkip = () => {
    if (mode === 'focus') {
      setMode('shortBreak');
    } else {
      setMode('focus');
    }
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? settings.focusTime * 60 : 
                mode === 'shortBreak' ? settings.shortBreak * 60 : 
                settings.longBreak * 60);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Pomodoro Timer</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowSettings(!showSettings)}
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            ⚙️ Settings
          </button>
          <div style={{ 
            background: getModeColor(),
            color: 'white',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {getModeLabel()}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          marginBottom: '20px',
          padding: '20px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Pomodoro Settings</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Focus Time (min)
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={settings.focusTime}
                onChange={(e) => updateSetting('focusTime', e.target.value)}
                style={{ width: '100%' }}
              />
              <div style={{ textAlign: 'center', marginTop: '5px', fontWeight: '600' }}>
                {settings.focusTime} min
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Short Break (min)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={settings.shortBreak}
                onChange={(e) => updateSetting('shortBreak', e.target.value)}
                style={{ width: '100%' }}
              />
              <div style={{ textAlign: 'center', marginTop: '5px', fontWeight: '600' }}>
                {settings.shortBreak} min
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Long Break (min)
            </label>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              value={settings.longBreak}
              onChange={(e) => updateSetting('longBreak', e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: '5px', fontWeight: '600' }}>
              {settings.longBreak} min
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Pomodoros until long break
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={settings.pomodorosUntilLongBreak}
                onChange={(e) => updateSetting('pomodorosUntilLongBreak', e.target.value)}
                style={{ flex: 1 }}
              />
              <span style={{ fontWeight: '600', minWidth: '30px' }}>
                {settings.pomodorosUntilLongBreak}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input
              type="checkbox"
              id="autoStart"
              checked={autoStartNext}
              onChange={(e) => setAutoStartNext(e.target.checked)}
            />
            <label htmlFor="autoStart" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Auto-start next timer
            </label>
          </div>
        </div>
      )}

      <div style={{ 
        fontSize: '5rem', 
        fontWeight: '700', 
        textAlign: 'center',
        margin: '20px 0',
        background: `linear-gradient(135deg, ${getModeColor()} 0%, ${getModeColor()}80 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ 
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Task: </span>
          <span style={{ fontWeight: '600', marginLeft: '5px' }}>
            {taskTitle || 'No task selected'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
        <button 
          className="btn btn-primary"
          onClick={() => setIsActive(!isActive)}
          style={{ 
            background: getModeColor(),
            padding: '12px 30px',
            fontSize: '16px'
          }}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleSkip}
          disabled={isActive}
          style={{ padding: '12px 20px' }}
        >
          Skip
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleReset}
          style={{ padding: '12px 20px' }}
        >
          Reset
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        marginTop: '20px'
      }}>
        <button 
          className={`btn btn-secondary ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => setMode('focus')}
          style={{ 
            padding: '8px 16px',
            background: mode === 'focus' ? 'var(--accent-blue)' : 'transparent',
            border: mode === 'focus' ? 'none' : '1px solid var(--accent-blue)',
            color: mode === 'focus' ? 'white' : 'var(--accent-blue)'
          }}
        >
          Focus
        </button>
        
        <button 
          className={`btn btn-secondary ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => setMode('shortBreak')}
          style={{ 
            padding: '8px 16px',
            background: mode === 'shortBreak' ? 'var(--success)' : 'transparent',
            border: mode === 'shortBreak' ? 'none' : '1px solid var(--success)',
            color: mode === 'shortBreak' ? 'white' : 'var(--success)'
          }}
        >
          Short Break
        </button>
        
        <button 
          className={`btn btn-secondary ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => setMode('longBreak')}
          style={{ 
            padding: '8px 16px',
            background: mode === 'longBreak' ? 'var(--accent-purple)' : 'transparent',
            border: mode === 'longBreak' ? 'none' : '1px solid var(--accent-purple)',
            color: mode === 'longBreak' ? 'white' : 'var(--accent-purple)'
          }}
        >
          Long Break
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'rgba(59, 130, 246, 0.1)', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completed Today</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{completedPomodoros}</div>
          </div>
          
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            ⏱️ {completedPomodoros * settings.focusTime} min focused
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Next Long Break</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>
              {settings.pomodorosUntilLongBreak - (completedPomodoros % settings.pomodorosUntilLongBreak)}
            </div>
          </div>
        </div>
        
        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          marginTop: '10px',
          overflow: 'hidden'
        }}>
          <div 
            style={{
              width: `${(completedPomodoros % settings.pomodorosUntilLongBreak) / settings.pomodorosUntilLongBreak * 100}%`,
              height: '100%',
              background: 'var(--gradient-blue)',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Hidden audio element for sound notifications */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default PomodoroTimer;