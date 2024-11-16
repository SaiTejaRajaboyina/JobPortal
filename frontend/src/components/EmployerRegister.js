import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f4f8',
  direction: 'ltr', // Explicit text direction
});

const FormContainer = styled(Container)({
  padding: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px', // Ensure the container is not too wide
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

const EmployerRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save employer details to Firestore
      await setDoc(doc(db, 'employers', user.uid), {
        firstName,
        lastName,
        email,
        role: 'employer', // Define role as 'employer'
        createdAt: new Date(),
      });

      navigate('/employer-login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Root>
      <FormContainer maxWidth="xs">
        <Typography component="h1" variant="h4" id="register-title">
          Register as Employer
        </Typography>
        <form onSubmit={handleRegister} aria-labelledby="register-title">
          <Input
            label="First Name"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            inputProps={{ 'aria-label': 'First Name' }}
          />
          <Input
            label="Last Name"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            inputProps={{ 'aria-label': 'Last Name' }}
          />
          <Input
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            inputProps={{ 'aria-label': 'Email' }}
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
              'aria-describedby': 'password-instruction',
            }}
          />
          <Typography
            id="password-instruction"
            variant="body2"
            color="textSecondary"
            component="p"
          >
            Password must be at least 8 characters long.
          </Typography>
          <SubmitButton type="submit">Register</SubmitButton>
          {error && (
            <Typography role="alert" color="error">
              {error}
            </Typography>
          )}
        </form>
        <LinkBox
          onClick={() => navigate('/employer-login')}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && navigate('/employer-login')}
        >
          Already have an account? Login
        </LinkBox>
      </FormContainer>
    </Root>
  );
};

export default EmployerRegister;
