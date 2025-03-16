import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const TaskForm = ({ onAddTask, activeGoal }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }
    
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      time: time.trim() || null,
      goalCategory: activeGoal,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    onAddTask(newTask);
    setTitle('');
    setTime('');
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
          <Input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 30 mins, 2 hours..."
          />
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

export default TaskForm;
