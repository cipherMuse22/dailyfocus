import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { api } from './api';
import Welcome from './Components/Welcome';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Navbar from './Components/Navbar';
import Calendar from './Components/Calendar';
import Analytics from './Components/Analytics';
import PomodoroTimer from './Components/PomodoroTimer';
import FocusMusic from './Components/FocusMusic';
import DistractionBlocker from './Components/DistractionBlocker';
import './index.css';

// Welcome Modal Component (for dashboard)
const WelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ 
            background: 'var(--gradient-blue)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '10px'
          }}>
            🎯 Welcome to FocusFlow!
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Let's set up your productivity goals
          </p>
        </div>

        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            <strong>Tip:</strong> Start with achievable goals. You can always adjust them later!
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={onClose}
          style={{ width: '100%' }}
        >
          Let's Get Started!
        </button>
      </div>
    </div>
  );
};

// Goal Settings Modal
const GoalSettingsModal = ({ isOpen, onClose, onSave, currentGoals }) => {
  const [weeklyGoal, setWeeklyGoal] = useState(currentGoals?.weeklyGoal || 20);
  const [monthlyGoal, setMonthlyGoal] = useState(currentGoals?.monthlyGoal || 80);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(weeklyGoal, monthlyGoal);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 style={{ 
          background: 'var(--gradient-blue)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '20px'
        }}>
          Set Your Goals
        </h2>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Weekly Focus Goal (hours)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ 
              background: 'var(--gradient-blue)', 
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {weeklyGoal}h
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '5px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}>
            <span>Light (5h)</span>
            <span>Moderate (20h)</span>
            <span>Intense (50h)</span>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Monthly Focus Goal (hours)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="range"
              min="20"
              max="200"
              step="20"
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(parseInt(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ 
              background: 'var(--gradient-purple)', 
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {monthlyGoal}h
            </span>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            <strong>Recommendation:</strong> {weeklyGoal} hours/week × 4 weeks = {weeklyGoal * 4} hours/month
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            style={{ flex: 1 }}
          >
            Save Goals
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Quick Focus Sessions Component
const QuickFocusSessions = ({ onStartSession }) => {
  const quickSessions = [
    { label: 'Email Cleanup', duration: 15, emoji: '📧', color: 'var(--accent-blue)' },
    { label: 'Deep Work', duration: 50, emoji: '🎯', color: 'var(--accent-purple)' },
    { label: 'Meeting Prep', duration: 25, emoji: '👥', color: 'var(--success)' },
    { label: 'Learning', duration: 45, emoji: '📚', color: 'var(--warning)' },
    { label: 'Creative Work', duration: 30, emoji: '🎨', color: 'var(--accent-teal)' },
    { label: 'Planning', duration: 20, emoji: '📋', color: 'var(--accent-blue)' },
  ];

  return (
    <div className="card">
      <h2>Quick Focus Sessions</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Start a focused session for common tasks
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {quickSessions.map((session, index) => (
          <button
            key={index}
            onClick={() => onStartSession(session.label, session.duration)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${session.color}`,
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: 'var(--text-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = `${session.color}20`;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '2rem' }}>
              {session.emoji}
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                {session.label}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {session.duration} min
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'rgba(59, 130, 246, 0.1)', 
        borderRadius: '12px',
        fontSize: '14px',
        color: 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        Click any session to start a focus timer immediately
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, userStats, updateStats, updateGoals, resetUserData } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [timer, setTimer] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', time: '', duration: 25 });
  const [weeklyFocusHours, setWeeklyFocusHours] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (user && userStats) {
      loadData();
      
      // Show welcome modal for new users
      const userData = JSON.parse(localStorage.getItem('focusFlow_user') || '{}');
      if (userData.isNewUser) {
        setShowWelcome(true);
        // Mark user as no longer new
        userData.isNewUser = false;
        localStorage.setItem('focusFlow_user', JSON.stringify(userData));
      }
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user, userStats]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [tasksData, sessionsData] = await Promise.all([
        api.getTasks(user.id),
        api.getFocusSessions(user.id)
      ]);
      setTasks(tasksData);
      setFocusSessions(sessionsData);
      
      // Calculate weekly focus hours
      const totalHours = sessionsData.reduce((sum, session) => sum + session.hours, 0);
      setWeeklyFocusHours(totalHours);
      
      // Update stats if needed
      if (totalHours > 0 && userStats.totalFocusHours === 0) {
        updateStats({
          totalFocusHours: totalHours,
          completedTasks: tasksData.filter(t => t.completed).length
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const startFocusSession = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setActiveTask(task);
    setTimer(task.duration * 60);
    
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const startQuickSession = (title, duration) => {
    const quickTask = {
      id: `quick-${Date.now()}`,
      title: title,
      duration: duration,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: false
    };
    
    setActiveTask(quickTask);
    setTimer(duration * 60);
    setIsRunning(true);
    
    // Show Pomodoro timer for quick sessions
    setShowPomodoro(true);
  };

  useEffect(() => {
    if (isRunning && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Timer finished
            clearInterval(timerRef.current);
            setIsRunning(false);
            
            // Complete the task
            if (activeTask) {
              completeTask(activeTask.id);
            }
            
            // Add focus session
            if (user) {
              const duration = activeTask?.duration || 25;
              api.addFocusSession(user.id, duration * 60, activeTask?.title || 'Focus Session');
              
              // Update stats
              const hoursToAdd = duration / 60;
              updateStats({
                totalFocusHours: (userStats.totalFocusHours || 0) + hoursToAdd,
                completedTasks: (userStats.completedTasks || 0) + 1,
                currentStreak: Math.max(userStats.currentStreak || 0, 1)
              });
              
              // Reload data to show updated sessions
              loadData();
            }
            
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
  }, [isRunning]);

  const handleStartPause = () => {
    if (!activeTask) {
      alert('Please select a task first!');
      return;
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    if (activeTask) {
      setTimer(activeTask.duration * 60);
    } else {
      setTimer(1500);
    }
  };

  const completeTask = async (taskId) => {
    if (!user) return;
    
    // Only complete actual tasks, not quick sessions
    if (!taskId.startsWith('quick-')) {
      await api.updateTask(user.id, taskId, { completed: true });
      const updatedTasks = await api.getTasks(user.id);
      setTasks(updatedTasks);
    }
  };

  const addTask = async () => {
    if (!user) return;
    
    if (newTask.title.trim()) {
      await api.addTask(user.id, {
        title: newTask.title,
        time: newTask.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: parseInt(newTask.duration),
        priority: 'medium'
      });
      setNewTask({ title: '', time: '', duration: 25 });
      
      // Update tasks list
      const updatedTasks = await api.getTasks(user.id);
      setTasks(updatedTasks);
    }
  };

  const deleteTask = async (taskId) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      await api.deleteTask(user.id, taskId);
      const updatedTasks = await api.getTasks(user.id);
      setTasks(updatedTasks);
    }
  };

  const handleResetData = () => {
    if (resetUserData) {
      resetUserData();
      setTasks([]);
      setFocusSessions([]);
      setWeeklyFocusHours(0);
      setActiveTask(null);
      setIsRunning(false);
      setTimer(1500);
      setShowResetConfirm(false);
      alert('All data has been reset to zero!');
    }
  };

  const handleSaveGoals = (weeklyGoal, monthlyGoal) => {
    if (updateGoals) {
      updateGoals(weeklyGoal, monthlyGoal);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show empty state for new users
  const showEmptyState = (!userStats || 
    (tasks.length === 0 && 
     focusSessions.length === 0 && 
     weeklyFocusHours === 0 && 
     (userStats?.productivityScore || 0) === 0));

  if (!userStats) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--primary-bg)'
      }}>
        <div style={{ 
          fontSize: '24px', 
          background: 'var(--gradient-blue)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: '700'
        }}>
          Loading your data...
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <GoalSettingsModal 
        isOpen={showGoalSettings} 
        onClose={() => setShowGoalSettings(false)}
        onSave={handleSaveGoals}
        currentGoals={userStats}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '400px' }}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '15px' }}>⚠️ Reset All Data?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              This will delete all your tasks, focus sessions, and reset all statistics to zero. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleResetData}
                style={{ background: 'var(--danger)', flex: 1 }}
              >
                Yes, Reset Everything
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowResetConfirm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showEmptyState ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', marginBottom: '20px' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '20px',
            background: 'var(--gradient-blue)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            🎯
          </div>
          <h2>Welcome to Your Focus Dashboard!</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '20px 0', fontSize: '18px' }}>
            Everything starts at zero. Your journey begins with your first task!
          </p>
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '20px', 
            borderRadius: '12px',
            margin: '30px 0',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0 }}>Set Your Goals First</h4>
              <button 
                className="btn btn-primary"
                onClick={() => setShowGoalSettings(true)}
                style={{ padding: '8px 16px' }}
              >
                Set Goals
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              Set weekly and monthly focus goals to track your progress
            </p>
          </div>
        </div>
      ) : null}
      
      <div className="grid-container">
        {/* Timer Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>Focus Timer</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowGoalSettings(true)}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Edit Goals
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPomodoro(!showPomodoro)}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                {showPomodoro ? 'Simple Timer' : 'Pomodoro'}
              </button>
            </div>
          </div>
          
          {showPomodoro ? (
            <PomodoroTimer 
              onComplete={() => {
                loadData();
              }}
              taskTitle={activeTask?.title}
            />
          ) : (
            <>
              <div className="focus-timer">
                {formatTime(timer)}
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleStartPause}
                  disabled={!activeTask && isRunning === false}
                >
                  {isRunning ? 'Pause' : 'Start'} Focus
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
              {activeTask ? (
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                  Working on: <strong>{activeTask.title}</strong>
                </p>
              ) : (
                <p style={{ textAlign: 'center', marginTop: '10px', color: 'var(--text-secondary)' }}>
                  {tasks.length > 0 
                    ? 'Select a task to start focusing' 
                    : 'Add a task first'}
                </p>
              )}
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>Your Productivity</h2>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowResetConfirm(true)}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              Reset Stats
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' }}>
            <div className="stat-card">
              <div className="stat-value">{weeklyFocusHours.toFixed(1)}</div>
              <div className="stat-label">Weekly Hours</div>
              <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                Goal: {userStats.weeklyGoal || 20}h
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userStats.currentStreak || 0}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{tasks.filter(t => t.completed).length}</div>
              <div className="stat-label">Tasks Done</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{userStats.productivityScore || 0}%</div>
              <div className="stat-label">Score</div>
              <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                Starts at 0%
              </div>
            </div>
          </div>
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Monthly Goal: </span>
              <span style={{ fontWeight: '600' }}>{userStats.monthlyGoal || 80}h</span>
            </div>
          </div>
        </div>

        {/* Quick Focus Sessions */}
        <QuickFocusSessions onStartSession={startQuickSession} />

        {/* Focus Music Player */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Focus Tools</h2>
            <div style={{ 
              background: 'var(--gradient-blue)', 
              padding: '5px 10px', 
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'white'
            }}>
              New
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <FocusMusic />
            <DistractionBlocker />
          </div>
        </div>

        {/* Add Task */}
        <div className="card">
          <h2>Add New Task</h2>
          <input
            className="input-field"
            placeholder="What do you want to focus on?"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            style={{ marginBottom: '10px' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              className="input-field"
              placeholder="Time (optional)"
              value={newTask.time}
              onChange={(e) => setNewTask({...newTask, time: e.target.value})}
            />
            <select
              className="input-field"
              value={newTask.duration}
              onChange={(e) => setNewTask({...newTask, duration: e.target.value})}
            >
              <option value="15">15 min</option>
              <option value="25">25 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={addTask} style={{ width: '100%' }}>
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Today's Tasks ({tasks.length})</h2>
            {tasks.length > 0 && (
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  if (window.confirm('Clear all tasks? This cannot be undone.')) {
                    api.clearAllTasks(user.id);
                    loadData();
                  }
                }}
                style={{ fontSize: '12px', padding: '5px 10px' }}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '10px',
                  opacity: 0.5
                }}>
                  📝
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>No tasks yet. Add your first task above!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${activeTask?.id === task.id ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <div 
                      className="task-checkbox"
                      onClick={() => completeTask(task.id)}
                      style={{ 
                        background: task.completed ? 'var(--success)' : 'transparent',
                        color: task.completed ? 'white' : 'transparent'
                      }}
                    >
                      {task.completed && '✓'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0 }}>{task.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '5px 0 0 0' }}>
                        {task.time} • {task.duration} min
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {!task.completed && (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => startFocusSession(task.id)}
                        disabled={isRunning && activeTask?.id !== task.id}
                        style={{ padding: '8px 12px' }}
                      >
                        Start
                      </button>
                    )}
                    <button 
                      className="btn btn-secondary"
                      onClick={() => deleteTask(task.id)}
                      style={{ 
                        padding: '8px 12px',
                        background: 'transparent',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Focus Chart */}
        <div className="card">
          <h2>Weekly Progress</h2>
          <div style={{ marginTop: '20px' }}>
            {focusSessions.length === 0 ? (
              <div style={{ 
                height: '200px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }}>
                  📊
                </div>
                <p>Complete your first focus session!</p>
                <p style={{ fontSize: '12px', marginTop: '5px' }}>
                  Your chart will appear here
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '10px' }}>
                {focusSessions.slice(-7).map((session, index) => (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div 
                      style={{
                        width: '30px',
                        height: `${session.hours * 30}px`,
                        background: 'var(--gradient-blue)',
                        borderRadius: '8px 8px 0 0',
                        marginBottom: '10px'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {session.day}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', marginTop: '5px' }}>
                      {session.hours}h
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>This Week: </span>
              <span style={{ fontWeight: '600' }}>{weeklyFocusHours.toFixed(1)}h / {userStats.weeklyGoal || 20}h</span>
              <span style={{ 
                marginLeft: '10px', 
                color: weeklyFocusHours >= (userStats.weeklyGoal || 20) ? 'var(--success)' : 'var(--warning)'
              }}>
                ({Math.round((weeklyFocusHours / (userStats.weeklyGoal || 20)) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h2>Quick Stats</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Weekly Goal</span>
              <span style={{ fontWeight: '600' }}>{userStats.weeklyGoal || 20}h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Monthly Goal</span>
              <span style={{ fontWeight: '600' }}>{userStats.monthlyGoal || 80}h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Productivity Score</span>
              <span style={{ 
                color: (userStats.productivityScore || 0) > 50 ? 'var(--success)' : 
                       (userStats.productivityScore || 0) > 25 ? 'var(--warning)' : 'var(--text-secondary)', 
                fontWeight: '600' 
              }}>
                {userStats.productivityScore || 0}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Focus Sessions</span>
              <span style={{ fontWeight: '600' }}>{focusSessions.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Task Completion</span>
              <span style={{ fontWeight: '600' }}>
                {tasks.length > 0 
                  ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              <strong>Tip:</strong> Productivity score starts at 0% and grows as you complete tasks and focus sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--primary-bg)'
      }}>
        <div style={{ 
          fontSize: '24px', 
          background: 'var(--gradient-blue)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontWeight: '700'
        }}>
          Loading FocusFlow...
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" />;
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Welcome page as homepage for non-logged in users */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/calendar" element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          } />
          <Route path="/analytics" element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;