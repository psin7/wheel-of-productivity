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

function App() {
  // State for tasks and goals
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : ['All Goals', 'Personal', 'Work'];
  });
  
  const [completedTasks, setCompletedTasks] = useState(() => {
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    return savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
  });
  
  const [activeGoal, setActiveGoal] = useState('All Goals');
  const [showAnimation, setShowAnimation] = useState(false);
  const [completedTaskId, setCompletedTaskId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // Save tasks, goals, and completed tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);
  
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

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
  const handleAddGoal = (newGoal) => {
    if (!goals.includes(newGoal)) {
      setGoals([...goals, newGoal]);
    }
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowAnimation(false);
    if (completedTaskId) {
      // Find the completed task
      const completedTask = tasks.find(task => task.id === completedTaskId);
      
      if (completedTask) {
        // Add completion timestamp
        const taskWithCompletionTime = {
          ...completedTask,
          completedAt: new Date().toISOString()
        };
        
        // Add to completed tasks
        setCompletedTasks([taskWithCompletionTime, ...completedTasks]);
        
        // Remove from active tasks
        setTasks(tasks.filter(task => task.id !== completedTaskId));
      }
      
      setCompletedTaskId(null);
    }
  };
  
  // Toggle history visibility
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };
  
  // Clear all history
  const clearHistory = () => {
    setCompletedTasks([]);
  };
  
  // Clear a single task from history
  const clearTaskFromHistory = (taskId) => {
    setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <AppHeader>
        <AppTitle>Todo Wheel App</AppTitle>
        <HistoryButton 
          onClick={toggleHistory}
          isActive={showHistory}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </HistoryButton>
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

export default App;
