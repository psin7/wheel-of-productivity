import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaTrash } from 'react-icons/fa';

const HistoryTab = ({ completedTasks, onClearHistory, onClearTask }) => {
  if (completedTasks.length === 0) {
    return (
      <HistoryContainer>
        <HistoryTitle>
          <FaHistory /> Task History
        </HistoryTitle>
        <EmptyMessage>No completed tasks yet.</EmptyMessage>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>
          <FaHistory /> Task History
        </HistoryTitle>
        <ClearButton 
          onClick={onClearHistory}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear All
        </ClearButton>
      </HistoryHeader>
      
      <TaskList>
        <AnimatePresence>
          {completedTasks.map(task => (
            <TaskItem
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <TaskContent>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskDetails>
                  {task.completedAt && (
                    <CompletedTime>
                      Completed: {new Date(task.completedAt).toLocaleString()}
                    </CompletedTime>
                  )}
                  {task.goalCategory && <TaskCategory>{task.goalCategory}</TaskCategory>}
                  {task.time && <TaskTime>⏰ {task.time}</TaskTime>}
                </TaskDetails>
              </TaskContent>
              <DeleteButton 
                onClick={() => onClearTask(task.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTrash />
              </DeleteButton>
            </TaskItem>
          ))}
        </AnimatePresence>
      </TaskList>
    </HistoryContainer>
  );
};

const HistoryContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px var(--shadow-color);
  margin-top: 20px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const HistoryTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled(motion.button)`
  background-color: var(--error-color);
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const TaskList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
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

const TaskItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: var(--completed-color);
  box-shadow: 0 2px 4px var(--shadow-color);
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 5px;
  color: var(--text-color);
`;

const TaskDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8rem;
`;

const CompletedTime = styled.span`
  color: #666;
  font-style: italic;
`;

const TaskCategory = styled.span`
  background-color: var(--tertiary-color);
  padding: 2px 6px;
  border-radius: 10px;
`;

const TaskTime = styled.span`
  background-color: var(--secondary-color);
  padding: 2px 6px;
  border-radius: 10px;
`;

const DeleteButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--error-color);
  color: white;
  margin-left: 10px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 20px 0;
`;

export default HistoryTab;
