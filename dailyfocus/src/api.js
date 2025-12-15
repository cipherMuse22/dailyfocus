// Mock API functions for FocusFlow app

// User-specific data storage
const getUserTasks = (userId) => {
  const key = `focusFlow_tasks_${userId}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    // New user gets empty tasks
    return [];
  }
  
  return JSON.parse(stored);
};

const getUserFocusSessions = (userId) => {
  const key = `focusFlow_sessions_${userId}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) {
    // New user gets empty sessions
    return [];
  }
  
  return JSON.parse(stored);
};

const saveUserTasks = (userId, tasks) => {
  localStorage.setItem(`focusFlow_tasks_${userId}`, JSON.stringify(tasks));
};

const saveUserSessions = (userId, sessions) => {
  localStorage.setItem(`focusFlow_sessions_${userId}`, JSON.stringify(sessions));
};

export const api = {
  // Task Management - User Specific
  getTasks: async (userId) => {
    if (!userId) return [];
    
    // Check if new user - show welcome tasks
    const user = JSON.parse(localStorage.getItem('focusFlow_user') || '{}');
    const tasks = getUserTasks(userId);
    
    if (tasks.length === 0 && user.isNewUser) {
      // Show sample welcome tasks for new users
      const welcomeTasks = [
        {
          id: 'welcome-1',
          title: 'Welcome to FocusFlow! 🎯',
          description: 'Add your first task to get started',
          time: 'Now',
          duration: 5,
          priority: 'low',
          completed: false,
          tags: ['welcome', 'tutorial']
        },
        {
          id: 'welcome-2',
          title: 'Try the focus timer ⏱️',
          description: 'Select a task and click Start to begin a focus session',
          time: 'Today',
          duration: 25,
          priority: 'medium',
          completed: false,
          tags: ['welcome', 'tutorial']
        },
        {
          id: 'welcome-3',
          title: 'Set your weekly goal 🎯',
          description: 'Aim for 20-30 hours of focused work per week',
          time: 'This week',
          duration: 60,
          priority: 'medium',
          completed: false,
          tags: ['welcome', 'tutorial']
        }
      ];
      
      saveUserTasks(userId, welcomeTasks);
      return welcomeTasks;
    }
    
    return tasks;
  },
  
  addTask: async (userId, task) => {
    const tasks = getUserTasks(userId);
    const newTask = {
      id: Date.now().toString(),
      ...task,
      completed: false
    };
    
    tasks.push(newTask);
    saveUserTasks(userId, tasks);
    return newTask;
  },
  
  updateTask: async (userId, id, updates) => {
    const tasks = getUserTasks(userId);
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      saveUserTasks(userId, tasks);
      return tasks[index];
    }
    return null;
  },
  
  deleteTask: async (userId, id) => {
    const tasks = getUserTasks(userId);
    const filteredTasks = tasks.filter(task => task.id !== id);
    saveUserTasks(userId, filteredTasks);
    return { success: true };
  },
  
  clearAllTasks: async (userId) => {
    saveUserTasks(userId, []);
    return { success: true };
  },
  
  // Focus Sessions - User Specific
  getFocusSessions: async (userId) => {
    if (!userId) return [];
    
    const sessions = getUserFocusSessions(userId);
    
    if (sessions.length === 0) {
      // New user gets empty sessions
      return [];
    }
    
    return sessions;
  },
  
  addFocusSession: async (userId, duration, taskTitle = 'Focus Session') => {
    const sessions = getUserFocusSessions(userId);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const hours = duration / 60;
    const session = { 
      day: today, 
      hours: hours,
      task: taskTitle,
      timestamp: new Date().toISOString()
    };
    
    sessions.push(session);
    saveUserSessions(userId, sessions);
    return session;
  },
  
  // Get user-specific productivity data
  getProductivityData: async (userId) => {
    const sessions = getUserFocusSessions(userId);
    const weeklyFocusHours = sessions.reduce((sum, session) => sum + session.hours, 0);
    
    // Calculate streak
    const user = JSON.parse(localStorage.getItem('focusFlow_user') || '{}');
    const userStats = JSON.parse(localStorage.getItem(`focusFlow_stats_${userId}`) || '{}');
    
    return {
      weeklyFocusHours,
      productivityTrend: sessions.length > 0 ? 0 : 0, // Start at 0
      streak: userStats.currentStreak || 0,
      focusDistribution: sessions.length > 0 ? sessions : []
    };
  },
  
  // Reset all user data
  resetUserData: async (userId) => {
    saveUserTasks(userId, []);
    saveUserSessions(userId, []);
    return { success: true };
  }
};