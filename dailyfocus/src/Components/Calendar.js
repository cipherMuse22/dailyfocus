import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import Navbar from './Navbar';

const Calendar = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [tasksData, sessionsData] = await Promise.all([
      api.getTasks(),
      api.getFocusSessions()
    ]);
    setTasks(tasksData);
    setFocusSessions(sessionsData);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    return {
      firstDay,
      lastDay,
      daysInMonth,
      startDay: firstDay.getDay()
    };
  };

  const { daysInMonth, startDay } = getDaysInMonth(currentDate);
  const days = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayTasks = tasks.filter(task => {
      // Simple check if task belongs to this date (for demo)
      return task.time && task.time.includes('PM') || task.time.includes('AM');
    });
    
    const daySessions = focusSessions.filter(session => {
      // Simple check for demo
      return session.day === date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    const totalHours = daySessions.reduce((sum, session) => sum + session.hours, 0);
    
    days.push({
      date,
      day,
      tasks: dayTasks,
      sessions: daySessions,
      totalHours
    });
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Calendar View</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => changeMonth(-1)}
              style={{ padding: '8px 16px' }}
            >
              ← Prev
            </button>
            <h3 style={{ margin: 0 }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button 
              className="btn btn-secondary" 
              onClick={() => changeMonth(1)}
              style={{ padding: '8px 16px' }}
            >
              Next →
            </button>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          gap: '10px',
          marginBottom: '20px'
        }}>
          {dayNames.map(day => (
            <div key={day} style={{ 
              textAlign: 'center', 
              padding: '10px', 
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div 
              key={index} 
              style={{ 
                background: day ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                borderRadius: '8px',
                padding: '10px',
                minHeight: '100px',
                border: day && day.date.toDateString() === selectedDate.toDateString() 
                  ? '2px solid var(--accent-blue)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: day ? 'pointer' : 'default',
                transition: 'all 0.3s ease'
              }}
              onClick={() => day && setSelectedDate(day.date)}
            >
              {day && (
                <>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <span style={{ 
                      fontWeight: '600',
                      color: day.date.toDateString() === new Date().toDateString() 
                        ? 'var(--accent-blue)' 
                        : 'var(--text-primary)'
                    }}>
                      {day.day}
                    </span>
                    {day.totalHours > 0 && (
                      <span style={{ 
                        fontSize: '12px', 
                        background: 'var(--gradient-blue)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '10px'
                      }}>
                        {day.totalHours}h
                      </span>
                    )}
                  </div>
                  
                  {day.tasks.length > 0 && (
                    <div style={{ marginTop: '5px' }}>
                      {day.tasks.slice(0, 2).map((task, i) => (
                        <div key={i} style={{
                          fontSize: '10px',
                          background: task.completed ? 'var(--success)' : 'rgba(59, 130, 246, 0.2)',
                          color: task.completed ? 'white' : 'var(--accent-blue)',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {task.title}
                        </div>
                      ))}
                      {day.tasks.length > 2 && (
                        <div style={{
                          fontSize: '9px',
                          color: 'var(--text-secondary)',
                          textAlign: 'center',
                          marginTop: '2px'
                        }}>
                          +{day.tasks.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Selected Date Details */}
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Selected Date: {formatDate(selectedDate)}</h3>
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600' }}>Focus Sessions</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {focusSessions.filter(s => s.day === selectedDate.toLocaleDateString('en-US', { weekday: 'short' })).length} sessions
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600' }}>Tasks</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {tasks.filter(t => t.time).length} tasks
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: '600' }}>Total Focus Time</span>
              <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>
                {focusSessions
                  .filter(s => s.day === selectedDate.toLocaleDateString('en-US', { weekday: 'short' }))
                  .reduce((sum, session) => sum + session.hours, 0)
                } hours
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;