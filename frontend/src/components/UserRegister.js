import React, { useState, useRef } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { doc, setDoc } from 'firebase/firestore';

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
  backgroundColor: '#28a745',
  color: '#fff',
  marginTop: '1.5rem',
  width: '100%',
  '&:hover': {
    backgroundColor: '#218838',
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

const UserRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');

    if (!firstName) {
      setFirstNameError('First Name is required');
      firstNameRef.current?.focus();
      return;
    }

    if (!lastName) {
      setLastNameError('Last Name is required');
      lastNameRef.current?.focus();
      return;
    }

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with the first and last name
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Store user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email: user.email,
      });

      navigate('/login'); // Redirect to login page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Root>
      <FormContainer maxWidth="xs">
        <Title variant="h4">Register as User</Title>
        <form onSubmit={handleRegister}>
          <TextField
            label="First Name" // Label for first name
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            inputRef={firstNameRef}
            error={Boolean(firstNameError)}
            helperText={firstNameError}
            aria-invalid={Boolean(firstNameError)}
            aria-describedby="firstName-error-text"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name" // Label for last name
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            inputRef={lastNameRef}
            error={Boolean(lastNameError)}
            helperText={lastNameError}
            aria-invalid={Boolean(lastNameError)}
            aria-describedby="lastName-error-text"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email" // Label for email
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
          <TextField
            label="Password" // Label for password
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
          <SubmitButton type="submit">Register</SubmitButton>
          {error && (
            <Typography color="error" role="alert" aria-live="assertive">
              {error}
            </Typography>
          )}
        </form>
        <LinkBox onClick={() => navigate('/login')} aria-label="Login">
          Already have an account? Login
        </LinkBox>
      </FormContainer>
    </Root>
  );
};

export default UserRegister;
