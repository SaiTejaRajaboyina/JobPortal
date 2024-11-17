import React, { useState, useRef } from 'react';
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
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Refs for managing focus when there's an error
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      emailRef.current?.focus();
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      passwordRef.current?.focus();
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Root>
      <FormContainer maxWidth="xs">
        <Title variant="h4" component="h1">User Login</Title>
        
        <form onSubmit={handleLogin}>
          {/* Email Field with Label */}
          <TextField
            id="email"
            label="Email" 
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            inputRef={emailRef}
            error={Boolean(emailError)}
            helperText={emailError}
            aria-invalid={Boolean(emailError)}
            aria-describedby="email-error-text"
            fullWidth
            margin="normal"
          />

          {/* Password Field with Label */}
          <TextField
            id="password"
            label="Password" 
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputRef={passwordRef}
            error={Boolean(passwordError)}
            helperText={passwordError}
            aria-invalid={Boolean(passwordError)}
            aria-describedby="password-error-text"
            fullWidth
            margin="normal"
          />

          <SubmitButton type="submit">Login</SubmitButton>
          {error && (
            <Typography color="error" role="alert" aria-live="assertive">
              {error}
            </Typography>
          )}
        </form>

        <nav aria-label="Account management">
          <LinkBox
            onClick={() => navigate('/reset-password?role=user')}
            aria-label="Forgot password"
          >
            Forgot password?
          </LinkBox>
          <LinkBox
            onClick={() => navigate('/register')}
            aria-label="Create a new account"
          >
            Don't have an account? Create one
          </LinkBox>
        </nav>

      </FormContainer>
    </Root>
  );
};

export default UserLogin;
