import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrash, FaCheck } from 'react-icons/fa';
import { supabase } from '../supabase';

// Helper function to format time in minutes to appropriate units
const formatTime = (minutes, preferredUnit = null) => {
  if (!minutes && minutes !== 0) return '';
  
  // If we have a preferred display unit, use it
  if (preferredUnit) {
    switch (preferredUnit) {
      case 'hours':
        return `${Math.round(minutes / 60 * 10) / 10} hours`;
      case 'days':
        return `${Math.round(minutes / (24 * 60) * 10) / 10} days`;
      default: // minutes
        return `${minutes} minutes`;
    }
  }
  
  // Otherwise, choose the most appropriate unit
  if (minutes >= 24 * 60) {
    const days = Math.round(minutes / (24 * 60) * 10) / 10;
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  } else if (minutes >= 60) {
    const hours = Math.round(minutes / 60 * 10) / 10;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }
};

const TaskItem = ({ task, onComplete, onDelete }) => {
  return (
    <TaskContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        y: -20, 
        scale: 0.8,
        transition: { duration: 0.3 }
      }}
      whileHover={{ scale: 1.02 }}
    >
      <TaskContent>
        <TaskTitle>{task.title}</TaskTitle>
        <TaskDetails>
          {task.time_minutes > 0 && (
            <TaskTime>⏰ {formatTime(task.time_minutes, task.display_unit)}</TaskTime>
          )}
          {task.goal && <TaskCategory>{task.goal}</TaskCategory>}
        </TaskDetails>
      </TaskContent>
      <TaskActions>
        <ActionButton 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => onComplete(task.id)}
          color="var(--quaternary-color)"
        >
          <FaCheck />
        </ActionButton>
        <ActionButton 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          color="var(--error-color)"
        >
          <FaTrash />
        </ActionButton>
      </TaskActions>
    </TaskContainer>
  );
};

const TaskContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px var(--shadow-color);
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: var(--text-color);
`;

const TaskDetails = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TaskTime = styled.span`
  font-size: 0.8rem;
  background-color: var(--secondary-color);
  padding: 3px 8px;
  border-radius: 12px;
`;

const TaskCategory = styled.span`
  font-size: 0.8rem;
  background-color: var(--tertiary-color);
  padding: 3px 8px;
  border-radius: 12px;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--primary-color)'};
  color: white;
  font-size: 0.9rem;
`;

export default TaskItem;
