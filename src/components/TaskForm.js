import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase';
import { FaClock } from 'react-icons/fa';

const TaskForm = ({ onAddTask, activeGoal }) => {
  const [title, setTitle] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [timeUnit, setTimeUnit] = useState('minutes');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    
    // Create a new task with UUID
    const taskId = uuidv4();
    
    // Parse time value as integer if provided
    let timeInMinutes = null;
    if (timeValue && !isNaN(timeValue) && parseInt(timeValue) > 0) {
      const value = parseInt(timeValue);
      
      // Convert all time units to minutes for storage
      switch (timeUnit) {
        case 'hours':
          timeInMinutes = value * 60;
          break;
        case 'days':
          timeInMinutes = value * 24 * 60;
          break;
        default: // minutes
          timeInMinutes = value;
      }
    }
    
    const newTask = {
      id: taskId,
      title: title.trim(),
      time_minutes: timeInMinutes, // Store everything in minutes
      display_unit: timeValue ? timeUnit : null, // Store display preference
      goal: activeGoal,
      completed: false,
      created_at: new Date().toISOString()
    };
    
    // Add task to local state via the callback
    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setTimeValue('');
    setTimeUnit('minutes');
    setError('');
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <FormTitle>Add New Task</FormTitle>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Task Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
          />
        </InputGroup>
        <InputGroup>
          <Label>Time (optional)</Label>
          <TimeInputContainer>
            <TimeInputWrapper>
              <TimeInput
                type="number"
                min="1"
                max="999"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                placeholder="Amount"
              />
              <TimeUnitSelect
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </TimeUnitSelect>
            </TimeInputWrapper>
            <TimeIcon><FaClock /></TimeIcon>
          </TimeInputContainer>
        </InputGroup>
        <SubmitButton 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Task
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

const FormContainer = styled(motion.div)`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px var(--shadow-color);
  margin-bottom: 20px;
`;

const FormTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: var(--text-color);
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: var(--text-color);
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--shadow-color);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(248, 200, 220, 0.3);
  }
`;

const SubmitButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5b5d0;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-align: center;
`;

const TimeInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TimeInputWrapper = styled.div`
  display: flex;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--shadow-color);
`;

const TimeInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: none;
  outline: none;
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(248, 200, 220, 0.3);
  }
  font-size: 0.9rem;
  color: var(--text-color);
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const TimeUnitSelect = styled.select`
  padding: 10px 15px;
  border: none;
  border-left: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
`;

const TimeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 1.1rem;
`;

export default TaskForm;
