import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Import components
import GlobalStyles from './styles/GlobalStyles';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import GoalTabs from './components/GoalTabs';
import SpinWheel from './components/SpinWheel';
import CompletionAnimation from './components/CompletionAnimation';
import HistoryTab from './components/HistoryTab';
import Login from './components/Login';

// Import auth context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Supabase client
import { supabase } from './supabase';

// Main App component wrapped with AuthProvider
function AppWithAuth() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// App content that uses authentication
function AppContent() {
  const { user, loading, signOut } = useAuth();
  
  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }
  
  // If not authenticated, show login screen
  if (!user) {
    return <Login />;
  }
  
  // If authenticated, show the main app
  return <MainApp userId={user.id} signOut={signOut} />;
}

// The main application with user data
function MainApp({ userId, signOut }) {
  // State for tasks and goals
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState(['All Goals', 'Personal', 'Work']);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [activeGoal, setActiveGoal] = useState('All Goals');
  const [showAnimation, setShowAnimation] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from Supabase when component mounts
  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true);
      try {
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .eq('completed', false);
          
        if (tasksError) throw tasksError;
        setTasks(tasksData || []);
        
        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId);
          
        if (goalsError) throw goalsError;
        if (goalsData && goalsData.length > 0) {
          setGoals(['All Goals', ...goalsData.map(g => g.name)]);
        }
        
        // Fetch completed tasks
        const { data: completedData, error: completedError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', userId)
          .eq('completed', true)
          .order('completed_at', { ascending: false });
          
        if (completedError) throw completedError;
        setCompletedTasks(completedData || []);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserData();
  }, [userId]);
  
  // Save tasks to Supabase whenever they change
  useEffect(() => {
    if (tasks.length > 0 && !isLoading) {
      const syncTasks = async () => {
        try {
          // For simplicity, we'll just upsert all tasks
          // In a production app, you might want to track changes more granularly
          const { error } = await supabase
            .from('tasks')
            .upsert(
              tasks.map(task => ({
                ...task,
                user_id: userId,
                completed: false
              }))
            );
            
          if (error) throw error;
        } catch (error) {
          console.error('Error syncing tasks:', error.message);
        }
      };
      
      syncTasks();
    }
  }, [tasks, userId, isLoading]);
  
  // Save completed tasks to Supabase
  useEffect(() => {
    if (completedTasks.length > 0 && !isLoading) {
      const syncCompletedTasks = async () => {
        try {
          const { error } = await supabase
            .from('tasks')
            .upsert(
              completedTasks.map(task => ({
                ...task,
                user_id: userId,
                completed: true
              }))
            );
            
          if (error) throw error;
        } catch (error) {
          console.error('Error syncing completed tasks:', error.message);
        }
      };
      
      syncCompletedTasks();
    }
  }, [completedTasks, userId, isLoading]);

  // Add a new task
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  // Complete a task
  const handleCompleteTask = (taskId) => {
    setCompletedTaskId(taskId);
    setShowAnimation(true);
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Add a new goal
  const handleAddGoal = async (newGoal) => {
    if (!goals.includes(newGoal)) {
      try {
        // Add to Supabase
        const { error } = await supabase
          .from('goals')
          .insert([{ name: newGoal, user_id: userId }]);
          
        if (error) throw error;
        
        // Update local state
        setGoals([...goals, newGoal]);
      } catch (error) {
        console.error('Error adding goal:', error.message);
      }
    }
  };

  // Handle animation completion
  const handleAnimationComplete = async () => {
    setShowAnimation(false);
    if (completedTaskId) {
      // Find the completed task
      const completedTask = tasks.find(task => task.id === completedTaskId);
      
      if (completedTask) {
        // Add completion timestamp
        const taskWithCompletionTime = {
          ...completedTask,
          completed: true,
          completed_at: new Date().toISOString()
        };
        
        try {
          // Update in Supabase
          const { error } = await supabase
            .from('tasks')
            .update({ 
              completed: true, 
              completed_at: taskWithCompletionTime.completed_at 
            })
            .eq('id', completedTaskId);
            
          if (error) throw error;
          
          // Add to completed tasks
          setCompletedTasks([taskWithCompletionTime, ...completedTasks]);
          
          // Remove from active tasks
          setTasks(tasks.filter(task => task.id !== completedTaskId));
        } catch (error) {
          console.error('Error completing task:', error.message);
        }
      }
      
      setCompletedTaskId(null);
    }
  };
  
  // Toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Clear all history
  const clearHistory = async () => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', userId)
        .eq('completed', true);
        
      if (error) throw error;
      
      // Update local state
      setCompletedTasks([]);
    } catch (error) {
      console.error('Error clearing history:', error.message);
    }
  };
  
  // Clear a single task from history
  const clearTaskFromHistory = async (taskId) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      // Update local state
      setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error clearing task from history:', error.message);
    }
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <AppHeader>
        <AppTitle>Todo Wheel App</AppTitle>
        <HeaderButtons>
          <HistoryButton 
            onClick={toggleHistory}
            isActive={showHistory}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </HistoryButton>
          <LogoutButton onClick={signOut}>Sign Out</LogoutButton>
        </HeaderButtons>
      </AppHeader>
      
      <MainContent>
        <LeftColumn>
          <GoalTabs 
            goals={goals} 
            activeGoal={activeGoal} 
            onSelectGoal={setActiveGoal} 
            onAddGoal={handleAddGoal} 
          />
          <TaskForm onAddTask={handleAddTask} activeGoal={activeGoal} />
          <TaskList 
            tasks={tasks} 
            onCompleteTask={handleCompleteTask} 
            onDeleteTask={handleDeleteTask} 
            activeGoal={activeGoal} 
          />
          
          {showHistory && (
            <HistoryTab 
              completedTasks={completedTasks}
              onClearHistory={clearHistory}
              onClearTask={clearTaskFromHistory}
            />
          )}
        </LeftColumn>
        
        <RightColumn>
          <SpinWheel tasks={tasks} />
        </RightColumn>
      </MainContent>
      
      <AnimatePresence>
        {showAnimation && (
          <CompletionAnimation onComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const AppHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const AppTitle = styled.h1`
  font-size: 2rem;
  color: var(--text-color);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    border-radius: 3px;
  }
`;

const HistoryButton = styled.button`
  background-color: ${props => props.isActive ? 'var(--tertiary-color)' : 'var(--primary-color)'};
  color: var(--text-color);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow-color);
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const LogoutButton = styled.button`
  background-color: var(--error-color);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: var(--text-color);
  font-size: 18px;
  font-weight: 500;
`;

export default AppWithAuth;
