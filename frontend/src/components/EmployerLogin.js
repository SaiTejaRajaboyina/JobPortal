// src/components/EmployerLogin.js

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f4f8',
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

const EmployerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/employer-home');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <>
      <CssBaseline />
      <Root>
        <FormContainer maxWidth="xs">
          <Title variant="h4" component="h1">
            Employer Login
          </Title>
          <form onSubmit={handleLogin} aria-label="Employer Login Form">
            <Input
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              inputProps={{
                'aria-label': 'Email Address',
                'aria-required': 'true',
              }}
            />
            <Input
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{
                'aria-label': 'Password',
                'aria-required': 'true',
              }}
            />
            <SubmitButton type="submit" aria-label="Login">
              Login
            </SubmitButton>
            {error && (
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            )}
          </form>
          <LinkBox
            role="link"
            tabIndex={0}
            onClick={() => navigate('/employer-reset-password?role=employer')}
            aria-label="Reset Password"
          >
            Forgot password?
          </LinkBox>
          <LinkBox
            role="link"
            tabIndex={0}
            onClick={() => navigate('/employer-register')}
            aria-label="Register New Account"
          >
            Don't have an account? Create one
          </LinkBox>
        </FormContainer>
      </Root>
    </>
  );
};

export default EmployerLogin;
