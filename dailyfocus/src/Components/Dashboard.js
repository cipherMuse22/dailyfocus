import React, { useState, useEffect } from 'react';
import { sessionsAPI } from '../api';
import SessionModal from './SessionModal';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await sessionsAPI.getToday();
      setSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (sessionData) => {
    try {
      await sessionsAPI.create(sessionData);
      loadSessions();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await sessionsAPI.update(id, { completed: !completed });
      loadSessions();
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session. Please try again.');
    }
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionsAPI.delete(id);
        loadSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  // Stats
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.completed).length;
  const pendingSessions = totalSessions - completedSessions;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your focus sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl focus-gradient flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 font-display">Today's Focus</h1>
                </div>
                <p className="text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formattedDate}
                </p>
              </div>
              
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Focus Session
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="stats-card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Focus on completing your sessions</div>
                </div>
              </div>

              <div className="stats-card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-emerald-600">{completedSessions}</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Great job! Keep it up</div>
                </div>
              </div>

              <div className="stats-card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-amber-600">{pendingSessions}</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">Ready for your next challenge</div>
                </div>
              </div>
            </div>

            {/* Sessions Section */}
            <div className="glass-card rounded-2xl">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 font-display">Today's Sessions</h2>
                  <span className="text-sm text-gray-500">
                    {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {sessions.length === 0 ? (
                  <div className="empty-state">
                    <div className="w-20 h-20 mx-auto mb-4">
                      <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions scheduled for today</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Create your first focus session to start building productive habits.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="btn-primary"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create First Session
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sessions.map(session => (
                      <div
                        key={session.id}
                        className={`session-card ${session.completed ? 'session-card-completed' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className={`text-lg font-semibold mb-1 ${session.completed ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>
                              {session.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 gap-3">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {session.startTime} - {session.endTime}
                              </span>
                              {session.completed && (
                                <span className="status-badge status-completed">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Completed
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`category-badge category-${session.category.toLowerCase()}`}>
                            {session.category}
                          </span>
                        </div>

                        {session.tasks && session.tasks.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Tasks
                            </div>
                            <ul className="space-y-2">
                              {session.tasks.slice(0, 3).map((task, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${session.completed ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                    {session.completed ? (
                                      <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                    )}
                                  </div>
                                  <span className={session.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>
                                    {task}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleToggleComplete(session.id, session.completed)}
                            className={`${session.completed ? 'btn-secondary' : 'btn-success'}`}
                          >
                            {session.completed ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Reopen
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Mark Complete
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete session"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Productivity Quote */}
            <div className="mt-8 text-center">
              <div className="inline-block glass-card px-6 py-4">
                <p className="text-gray-600 italic">
                  "The secret of getting ahead is getting started."
                  <span className="block text-sm text-gray-500 mt-1">— Mark Twain</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Modal */}
      {showModal && (
        <SessionModal
          onClose={() => setShowModal(false)}
          onSave={handleAddSession}
        />
      )}
    </div>
  );
};

export default Dashboard;