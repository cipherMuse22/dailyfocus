import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    // Check for stored auth on load
    const storedUser = localStorage.getItem('focusFlow_user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Load user stats
      const storedStats = localStorage.getItem(`focusFlow_stats_${parsedUser.id}`);
      if (storedStats) {
        setUserStats(JSON.parse(storedStats));
      }
    }
    
    setLoading(false);
  }, []);

  const updateStats = (newStats) => {
    if (!user) return;
    
    setUserStats(prev => {
      const updated = { 
        ...prev, 
        ...newStats,
        lastActive: new Date().toISOString()
      };
      
      // Auto-calculate productivity score
      const completedScore = Math.min(100, (updated.completedTasks / 10) * 100);
      const focusScore = Math.min(100, (updated.totalFocusHours / 50) * 100);
      const streakScore = Math.min(100, updated.currentStreak * 10);
      
      updated.productivityScore = Math.round(
        (completedScore * 0.4) + (focusScore * 0.4) + (streakScore * 0.2)
      );
      
      localStorage.setItem(`focusFlow_stats_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (email, password) => {
    // Check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('focusFlow_users') || '[]');
    let existingUser = existingUsers.find(u => u.email === email);
    
    if (!existingUser) {
      // Create new user if doesn't exist
      existingUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
        isNewUser: true
      };
      
      existingUsers.push(existingUser);
      localStorage.setItem('focusFlow_users', JSON.stringify(existingUsers));
    }
    
    // Initialize stats if they don't exist
    let userStats = localStorage.getItem(`focusFlow_stats_${existingUser.id}`);
    if (!userStats) {
      const initialStats = {
        totalFocusHours: 0,
        currentStreak: 0,
        weeklyGoal: 20,
        monthlyGoal: 80,
        completedTasks: 0,
        productivityScore: 0,
        lastActive: new Date().toISOString(),
        dailyAverage: 0
      };
      localStorage.setItem(`focusFlow_stats_${existingUser.id}`, JSON.stringify(initialStats));
      setUserStats(initialStats);
    } else {
      setUserStats(JSON.parse(userStats));
    }
    
    setUser(existingUser);
    localStorage.setItem('focusFlow_user', JSON.stringify(existingUser));
    
    return { success: true, user: existingUser };
  };

  const signup = async (email, password, name) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('focusFlow_users') || '[]');
    if (existingUsers.find(u => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
      isNewUser: true
    };
    
    // Save user
    existingUsers.push(newUser);
    localStorage.setItem('focusFlow_users', JSON.stringify(existingUsers));
    
    // Initialize stats
    const initialStats = {
      totalFocusHours: 0,
      currentStreak: 0,
      weeklyGoal: 20,
      monthlyGoal: 80,
      completedTasks: 0,
      productivityScore: 0,
      lastActive: new Date().toISOString(),
      dailyAverage: 0
    };
    
    setUser(newUser);
    setUserStats(initialStats);
    localStorage.setItem('focusFlow_user', JSON.stringify(newUser));
    localStorage.setItem(`focusFlow_stats_${newUser.id}`, JSON.stringify(initialStats));
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setUserStats(null);
    localStorage.removeItem('focusFlow_user');
  };

  const resetUserData = () => {
    if (!user) return;
    
    const resetStats = {
      totalFocusHours: 0,
      currentStreak: 0,
      weeklyGoal: 20,
      monthlyGoal: 80,
      completedTasks: 0,
      productivityScore: 0,
      lastActive: new Date().toISOString(),
      dailyAverage: 0
    };
    
    setUserStats(resetStats);
    localStorage.setItem(`focusFlow_stats_${user.id}`, JSON.stringify(resetStats));
    
    // Clear tasks and sessions
    localStorage.removeItem(`focusFlow_tasks_${user.id}`);
    localStorage.removeItem(`focusFlow_sessions_${user.id}`);
    
    return { success: true };
  };

  const updateGoals = (weeklyGoal, monthlyGoal) => {
    if (!user || !userStats) return;
    
    setUserStats(prev => {
      const updated = {
        ...prev,
        weeklyGoal: weeklyGoal || prev.weeklyGoal,
        monthlyGoal: monthlyGoal || prev.monthlyGoal,
        lastActive: new Date().toISOString()
      };
      
      localStorage.setItem(`focusFlow_stats_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    loading,
    userStats,
    login,
    signup,
    logout,
    updateStats,
    resetUserData,
    updateGoals
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};