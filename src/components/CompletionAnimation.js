import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const CompletionAnimation = ({ onComplete }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    const animateSequence = async () => {
      await controls.start({
        scale: [0, 1.2, 1],
        opacity: [0, 1, 1],
        transition: { duration: 0.5 }
      });
      
      // Animate stars
      await controls.start('stars');
      
      // Wait a bit and then fade out
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await controls.start({
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0],
        transition: { duration: 0.5 }
      });
      
      onComplete();
    };
    
    animateSequence();
  }, [controls, onComplete]);
  
  // Create random stars
  const stars = Array.from({ length: 12 }, (_, i) => {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const size = Math.random() * 0.5 + 0.5;
    const delay = Math.random() * 0.3;
    
    return { id: i, x, y, size, delay };
  });
  
  return (
    <AnimationContainer>
      <AnimationWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <CenterCircle
          animate={controls}
          initial={{ scale: 0, opacity: 0 }}
        >
          <CheckmarkText>Done!</CheckmarkText>
        </CenterCircle>
        
        {stars.map(star => (
          <Star
            key={star.id}
            custom={star}
            variants={{
              initial: { scale: 0, x: 0, y: 0, opacity: 0 },
              stars: {
                scale: star.size,
                x: star.x,
                y: star.y,
                opacity: [0, 1, 0],
                transition: {
                  delay: star.delay,
                  duration: 0.8,
                }
              }
            }}
            initial="initial"
            animate={controls}
          >
            <FaStar />
          </Star>
        ))}
      </AnimationWrapper>
    </AnimationContainer>
  );
};

const AnimationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const AnimationWrapper = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenterCircle = styled(motion.div)`
  width: 120px;
  height: 120px;
  background-color: var(--completed-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 20px rgba(200, 248, 216, 0.8);
`;

const CheckmarkText = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text-color);
`;

const Star = styled(motion.div)`
  position: absolute;
  color: #FFD700;
  font-size: 1.5rem;
  transform-origin: center center;
`;

export default CompletionAnimation;
