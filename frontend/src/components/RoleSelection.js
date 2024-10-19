// src/components/RoleSelection.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f4f8',
});

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
});

const RoleBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '2rem',
  marginTop: '2rem',
});

const RoleButton = styled(Button)({
  padding: '2rem',
  fontSize: '1.25rem',
  fontWeight: '600',
  backgroundColor: '#007bff',
  color: '#fff',
  width: '150px',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const RoleSelection = () => {
  const navigate = useNavigate();

  // Redirect to the correct login page based on the role
  const handleRoleSelection = (role) => {
    if (role === 'user') {
      navigate('/login');
    } else if (role === 'employer') {
      navigate('/employer-login');
    }
  };

  return (
    <Root>
      <CenteredContainer>
        <Typography variant="h4" gutterBottom>
          Choose your role
        </Typography>
        <RoleBox>
          <RoleButton onClick={() => handleRoleSelection('user')}>
            User
          </RoleButton>
          <RoleButton onClick={() => handleRoleSelection('employer')}>
            Employer
          </RoleButton>
        </RoleBox>
      </CenteredContainer>
    </Root>
  );
};

export default RoleSelection;
