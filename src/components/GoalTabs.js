import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const GoalTabs = ({ goals, activeGoal, onSelectGoal, onAddGoal }) => {
  const [newGoalName, setNewGoalName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGoal = () => {
    if (newGoalName.trim()) {
      onAddGoal(newGoalName.trim());
      setNewGoalName('');
      setIsAdding(false);
    }
  };

  return (
    <TabsContainer>
      <TabsList>
        {goals.map((goal) => (
          <TabItem
            key={goal}
            data-active={(activeGoal === goal).toString()}
            onClick={() => onSelectGoal(goal)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            {goal}
            {activeGoal === goal && <ActiveIndicator layoutId="activeIndicator" />}
          </TabItem>
        ))}
        {isAdding ? (
          <AddGoalForm>
            <AddGoalInput
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Goal name..."
              autoFocus
            />
            <AddGoalButton 
              onClick={handleAddGoal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add
            </AddGoalButton>
            <CancelButton 
              onClick={() => setIsAdding(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </CancelButton>
          </AddGoalForm>
        ) : (
          <AddTabButton 
            onClick={() => setIsAdding(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPlus />
          </AddTabButton>
        )}
      </TabsList>
    </TabsContainer>
  );
};

const TabsContainer = styled.div`
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 5px;
  
  &::-webkit-scrollbar {
    height: 5px;
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

const TabsList = styled.div`
  display: flex;
  gap: 10px;
  min-width: max-content;
`;

const TabItem = styled(motion.button)`
  padding: 10px 20px;
  background-color: ${props => props['data-active'] === 'true' ? 'white' : 'var(--secondary-color)'};
  border-radius: 20px;
  font-weight: ${props => props['data-active'] === 'true' ? '600' : '400'};
  color: var(--text-color);
  position: relative;
  box-shadow: 0 2px 4px var(--shadow-color);
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background-color: var(--primary-color);
  border-radius: 50%;
`;

const AddTabButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 4px var(--shadow-color);
`;

const AddGoalForm = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const AddGoalInput = styled.input`
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid var(--shadow-color);
  font-size: 0.9rem;
  width: 150px;
`;

const AddGoalButton = styled(motion.button)`
  padding: 8px 12px;
  background-color: var(--quaternary-color);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-color);
`;

const CancelButton = styled(motion.button)`
  padding: 8px 12px;
  background-color: var(--error-color);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-color);
`;

export default GoalTabs;
