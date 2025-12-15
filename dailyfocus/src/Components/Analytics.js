import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import Navbar from './Navbar';

const Analytics = () => {
  const { userStats } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    weeklyData: [],
    monthlyData: [],
    productivityScore: 0,
    averageFocusTime: 0,
    bestDay: '',
    peakHours: []
  });

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
    
    // Calculate analytics
    calculateAnalytics(tasksData, sessionsData);
  };

  const calculateAnalytics = (tasks, sessions) => {
    // Calculate weekly data
    const weeklyData = sessions.map(session => ({
      day: session.day,
      hours: session.hours
    }));

    // Calculate monthly data (group by week)
    const monthlyData = [
      { week: 'Week 1', hours: 15 },
      { week: 'Week 2', hours: 18 },
      { week: 'Week 3', hours: 22 },
      { week: 'Week 4', hours: 19 }
    ];

    // Calculate average focus time
    const totalFocusHours = sessions.reduce((sum, session) => sum + session.hours, 0);
    const averageFocusTime = sessions.length > 0 ? totalFocusHours / sessions.length : 0;

    // Find best day
    const bestDay = sessions.length > 0 
      ? sessions.reduce((best, current) => current.hours > best.hours ? current : best, sessions[0])
      : { day: 'No data', hours: 0 };

    // Determine peak hours (simplified for demo)
    const peakHours = ['10:00 AM', '2:00 PM', '8:00 PM'];

    // Calculate productivity score
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const productivityScore = Math.round((completionRate + userStats.productivityScore) / 2);

    setAnalyticsData({
      weeklyData,
      monthlyData,
      productivityScore,
      averageFocusTime,
      bestDay: bestDay.day,
      peakHours
    });
  };

  const getProductivityLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'var(--success)' };
    if (score >= 60) return { level: 'Good', color: 'var(--accent-blue)' };
    if (score >= 40) return { level: 'Average', color: 'var(--warning)' };
    return { level: 'Needs Improvement', color: 'var(--danger)' };
  };

  const productivityLevel = getProductivityLevel(analyticsData.productivityScore);

  return (
    <div className="app-container">
      <Navbar />
      
      <div className="grid-container">
        {/* Overview Card */}
        <div className="card">
          <h2>Analytics Overview</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Productivity Score</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
                  Based on task completion and focus time
                </p>
              </div>
              <div style={{ 
                background: productivityLevel.color,
                color: 'white',
                padding: '10px 20px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '20px'
              }}>
                {analyticsData.productivityScore}%
              </div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '15px', 
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: '16px', color: productivityLevel.color, fontWeight: '600' }}>
                {productivityLevel.level}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="card">
          <h2>Weekly Focus Hours</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '15px' }}>
              {analyticsData.weeklyData.map((item, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    style={{
                      width: '35px',
                      height: `${item.hours * 25}px`,
                      background: 'var(--gradient-purple)',
                      borderRadius: '8px 8px 0 0',
                      marginBottom: '10px'
                    }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {item.day}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '600', marginTop: '5px' }}>
                    {item.hours}h
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="card">
          <h2>Monthly Progress</h2>
          <div style={{ marginTop: '20px' }}>
            {analyticsData.monthlyData.map((item, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{item.week}</span>
                  <span style={{ fontWeight: '600' }}>{item.hours}h</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{
                      width: `${(item.hours / 25) * 100}%`,
                      height: '100%',
                      background: 'var(--gradient-blue)',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Statistics */}
        <div className="card">
          <h2>Task Statistics</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Total Tasks</span>
              <span style={{ fontWeight: '600' }}>{tasks.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Completed</span>
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                {tasks.filter(t => t.completed).length}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Completion Rate</span>
              <span style={{ fontWeight: '600' }}>
                {tasks.length > 0 
                  ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Duration</span>
              <span style={{ fontWeight: '600' }}>
                {tasks.length > 0 
                  ? `${Math.round(tasks.reduce((sum, t) => sum + t.duration, 0) / tasks.length)} min`
                  : '0 min'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card">
          <h2>Focus Insights</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Average Focus Time</span>
              <span style={{ fontWeight: '600' }}>
                {analyticsData.averageFocusTime.toFixed(1)} hours/day
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span>Best Day</span>
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                {analyticsData.bestDay} ({analyticsData.weeklyData.find(d => d.day === analyticsData.bestDay)?.hours || 0}h)
              </span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <span>Peak Productivity Hours:</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {analyticsData.peakHours.map((hour, index) => (
                  <span 
                    key={index}
                    style={{
                      background: 'var(--gradient-blue)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {hour}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              padding: '15px', 
              borderRadius: '12px',
              marginTop: '10px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                <strong>Tip:</strong> Try to schedule deep work sessions during your peak hours for maximum productivity.
              </p>
            </div>
          </div>
        </div>

        {/* Session Distribution */}
        <div className="card">
          <h2>Session Distribution</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Short (<30min)', 'Medium (30-60min)', 'Long (>60min)'].map((type, index) => {
                const percentages = [25, 50, 25]; // Demo percentages
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span>{type}</span>
                      <span style={{ fontWeight: '600' }}>{percentages[index]}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{
                          width: `${percentages[index]}%`,
                          height: '100%',
                          background: index === 0 ? 'var(--accent-teal)' : 
                                    index === 1 ? 'var(--accent-blue)' : 
                                    'var(--accent-purple)',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;