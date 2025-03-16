import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onCompleteTask, onDeleteTask, activeGoal }) => {
  // Filter tasks based on active goal
  const filteredTasks = activeGoal === 'All Goals' 
    ? tasks 
    : tasks.filter(task => task.goalCategory === activeGoal);

  return (
    <ListContainer>
      <ListTitle>Your Tasks</ListTitle>
      <TasksContainer>
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onComplete={onCompleteTask} 
                onDelete={onDeleteTask} 
              />
            ))
          ) : (
            <EmptyMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No tasks found. Add some tasks to get started!
            </EmptyMessage>
          )}
        </AnimatePresence>
      </TasksContainer>
    </ListContainer>
  );
};

const ListContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px var(--shadow-color);
  margin-bottom: 20px;
`;

const ListTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: var(--text-color);
  text-align: center;
`;

const TasksContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 10px;
  }
`;

const EmptyMessage = styled(motion.p)`
  text-align: center;
  color: var(--text-color);
  font-style: italic;
  padding: 20px 0;
`;

export default TaskList;
