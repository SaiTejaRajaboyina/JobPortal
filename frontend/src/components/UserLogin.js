// src/components/UserLogin.js

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f4f8',
  direction: 'ltr', // Ensure text direction is set
});

const FormContainer = styled(Container)({
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
});

const Title = styled(Typography)({
  marginBottom: '1.5rem',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: '600',
  color: '#333',
});

const Input = styled(TextField)({
  marginBottom: '1.5rem',
  width: '100%',
});

const SubmitButton = styled(Button)({
  backgroundColor: '#007bff',
  color: '#fff',
  marginTop: '1.5rem',
  width: '100%',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const LinkBox = styled(Box)({
  marginTop: '1rem',
  textAlign: 'center',
  color: '#007bff',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Root>
      <a href="#main-content" style={{ position: 'absolute', top: 0, left: 0 }}>
        Skip to content
      </a>
      <FormContainer maxWidth="xs" id="main-content">
        <Title variant="h4" component="h1">
          User Login
        </Title>
        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            inputProps={{ 'aria-label': 'Enter your email' }}
          />
          <Input
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputProps={{ 'aria-label': 'Enter your password' }}
          />
          <SubmitButton type="submit" aria-label="Login">
            Login
          </SubmitButton>
          {error && <Typography color="error">{error}</Typography>}
        </form>
        <LinkBox
          onClick={() => navigate('/reset-password?role=user')}
          role="link"
          tabIndex={0}
          aria-label="Forgot password? Click to reset."
        >
          Forgot password?
        </LinkBox>
        <LinkBox
          onClick={() => navigate('/register')}
          role="link"
          tabIndex={0}
          aria-label="Don't have an account? Click to create one."
        >
          Don't have an account? Create one
        </LinkBox>
      </FormContainer>
    </Root>
  );
};

export default UserLogin;
