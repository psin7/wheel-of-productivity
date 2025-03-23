import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FaRedo } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabase';

const SpinWheel = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef(null);
  const controls = useAnimation();

  const getRandomDegree = () => {
    return Math.floor(Math.random() * 360) + 1440; // At least 4 full rotations
  };

  const spinWheel = () => {
    if (tasks.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setSelectedTask(null);
    
    const spinDegree = getRandomDegree();
    
    controls.start({
      rotate: spinDegree,
      transition: { 
        duration: 3,
        ease: [0.2, 0.8, 0.2, 1] // Custom easing function for realistic spin
      }
    });
    
    setTimeout(() => {
      // Calculate which task is selected based on the final position
      const finalPosition = spinDegree % 360;
      const segmentSize = 360 / tasks.length;
      const selectedIndex = Math.floor(finalPosition / segmentSize);
      
      setSelectedTask(tasks[selectedIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  // Generate a pastel HSL color based on index
  const generatePastelColor = (index, total) => {
    // Define a set of pastel colors similar to the reference image
    const pastelColors = [
      'hsl(0, 80%, 80%)',      // Light Red
      'hsl(30, 80%, 80%)',     // Light Orange
      'hsl(60, 80%, 80%)',     // Light Yellow
      'hsl(90, 70%, 80%)',     // Light Green-Yellow
      'hsl(120, 60%, 80%)',    // Light Green
      'hsl(150, 60%, 75%)',    // Light Teal
      'hsl(180, 70%, 75%)',    // Light Cyan
      'hsl(210, 70%, 80%)',    // Light Sky Blue
      'hsl(240, 70%, 85%)',    // Light Blue
      'hsl(270, 70%, 85%)',    // Light Purple
      'hsl(300, 70%, 85%)',    // Light Magenta
      'hsl(330, 80%, 85%)',    // Light Pink
    ];
    
    // Use modulo to cycle through the colors if there are more tasks than colors
    return pastelColors[index % pastelColors.length];
  };
  
  // Create wheel segments based on tasks
  const createWheelSegments = () => {
    if (tasks.length === 0) return null;
    
    const segments = [];
    const segmentAngle = 360 / tasks.length;
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      
      // Calculate coordinates for the segment path
      const pathData = describeArc(150, 150, 150, startAngle, endAngle);
      
      // Get color for this segment
      const color = generatePastelColor(i, tasks.length);
      
      segments.push(
        <g key={task.id || uuidv4()}>
          <path 
            d={pathData}
            fill={color}
            stroke="white"
            strokeWidth="1"
          />
          <WheelText 
            x={150} 
            y={150} 
            textAnchor="middle"
            transform={`rotate(${startAngle + segmentAngle/2}, 150, 150) translate(0, -100)`}
          >
            {task.title}
          </WheelText>
        </g>
      );
    }
    
    return segments;
  };
  
  // Helper function to describe an arc path for SVG
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  return (
    <WheelContainer>
      <WheelTitle>Spin the Wheel!</WheelTitle>
      <WheelWrapper>
        <WheelSVG 
          viewBox="0 0 300 300" 
          xmlns="http://www.w3.org/2000/svg"
          as={motion.svg}
          ref={wheelRef}
          animate={controls}
          initial={{ rotate: 0 }}
        >
          {createWheelSegments()}
          <circle 
            cx="150" 
            cy="150" 
            r="30" 
            fill="black" 
            stroke="white"
            strokeWidth="3"
          />
          <text 
            x="150" 
            y="155" 
            textAnchor="middle" 
            fill="white" 
            fontWeight="bold"
            fontSize="12"
          >
            SPIN
          </text>
        </WheelSVG>
        <SpinButton 
          onClick={spinWheel}
          disabled={isSpinning || tasks.length === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaRedo /> Spin
        </SpinButton>
      </WheelWrapper>
      
      {selectedTask && (
        <SelectedTaskContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SelectedTaskTitle>Your Task:</SelectedTaskTitle>
          <SelectedTaskContent>
            <TaskName>{selectedTask.title}</TaskName>
            {selectedTask.time && <TaskTime>⏰ {selectedTask.time}</TaskTime>}
          </SelectedTaskContent>
        </SelectedTaskContainer>
      )}
      
      {tasks.length === 0 && (
        <EmptyMessage>Add tasks to spin the wheel!</EmptyMessage>
      )}
    </WheelContainer>
  );
};

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const WheelTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--text-color);
  text-align: center;
`;

const WheelWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WheelSVG = styled(motion.svg)`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 6px 12px var(--shadow-color), 0 0 0 8px rgba(255, 255, 255, 0.8);
  transform-origin: center;
`;

const WheelText = styled.text`
  font-size: 12px;
  font-weight: 600;
  fill: rgba(0, 0, 0, 0.8);
  text-shadow: 0 0 1px white;
`;

const SpinButton = styled(motion.button)`
  position: absolute;
  bottom: -20px;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px var(--shadow-color);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const SelectedTaskContainer = styled(motion.div)`
  margin-top: 30px;
  background-color: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 8px var(--shadow-color);
  width: 100%;
  max-width: 300px;
`;

const SelectedTaskTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--text-color);
  text-align: center;
`;

const SelectedTaskContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const TaskName = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
`;

const TaskTime = styled.span`
  font-size: 0.9rem;
  background-color: var(--secondary-color);
  padding: 3px 8px;
  border-radius: 12px;
`;

const EmptyMessage = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: var(--text-color);
  text-align: center;
  font-style: italic;
`;

export default SpinWheel;
