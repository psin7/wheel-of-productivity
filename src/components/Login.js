import React from 'react';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <LoginContainer>
      <LoginCard>
        <LogoContainer>
          <AppLogo>🎡</AppLogo>
          <AppTitle>Todo Wheel</AppTitle>
        </LogoContainer>
        <LoginButton 
          onClick={signInWithGoogle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FcGoogle size={24} />
          <ButtonText>Continue with Google</ButtonText>
        </LoginButton>
        <AppDescription>
          Combine your to-do list with a spin-the-wheel feature for a fun and productive experience!
        </AppDescription>
      </LoginCard>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const LogoContainer = styled.div`
  margin-bottom: 30px;
`;

const AppLogo = styled.div`
  font-size: 60px;
  margin-bottom: 10px;
`;

const AppTitle = styled.h1`
  font-size: 28px;
  color: var(--primary-color);
  margin: 0;
`;

const LoginButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin: 20px 0;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f8f8;
    border-color: #ccc;
  }
`;

const ButtonText = styled.span`
  margin-left: 12px;
`;

const AppDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 30px;
`;

export default Login;
