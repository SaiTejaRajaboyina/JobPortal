import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmployerNavBar from './EmployerNavBar';

const CenteredBox = styled(Box)(({ highContrast }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  height: '60vh',
  color: highContrast ? '#fff' : 'inherit',
}));

const GetStartedButton = styled(Button)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#FFD700' : '#28a745',
  color: highContrast ? '#000' : '#fff',
  marginTop: '1.5rem',
  '&:hover': {
    backgroundColor: highContrast ? '#FFC107' : '#218838',
  },
}));

const AccessibilityBar = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  position: 'fixed',
  bottom: '10px',
  width: '100%',
  backgroundColor: '#f0f4f8',
  padding: '0.5rem',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
});

const EmployerHomePage = () => {
  const navigate = useNavigate();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const handleGetStartedClick = () => {
    navigate('/posting-jobs'); // Redirect to the Posting Jobs Page
  };

  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10) || 16;
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('fontSize', fontSize);
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(prevSize + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 12));
  };

  return (
    <div style={{ fontSize: `${fontSize}px` }} dir="ltr">
      <EmployerNavBar activePage="Home" />

      <Container>
        <CenteredBox highContrast={highContrast}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Inclusive Job Portal
          </Typography>
          <Typography variant="body1" paragraph>
            The Inclusive Job Portal is designed to make job hunting accessible to everyone. Whether you're a job seeker or an employer, we provide tools that ensure a seamless experience.
          </Typography>
          <GetStartedButton 
            highContrast={highContrast} 
            data-command="Get Started" 
            onClick={handleGetStartedClick}
            aria-label="Get started by posting jobs"
            title="Click to start posting jobs"
          >
            Get Started
          </GetStartedButton>
        </CenteredBox>
      </Container>

      {/* Accessibility Bar */}
      <AccessibilityBar aria-label="Accessibility options">
        <Button 
          variant="contained" 
          onClick={toggleHighContrast} 
          sx={{ marginRight: '1rem' }}
          aria-label="Toggle high contrast mode"
          title="Toggle high contrast mode for better visibility"
        >
          Toggle High Contrast
        </Button>
        <Button 
          variant="contained" 
          onClick={increaseFontSize} 
          sx={{ marginRight: '1rem' }}
          aria-label="Increase font size"
          title="Increase font size for better readability"
        >
          Increase Font Size
        </Button>
        <Button 
          variant="contained" 
          onClick={decreaseFontSize}
          aria-label="Decrease font size"
          title="Decrease font size"
        >
          Decrease Font Size
        </Button>
      </AccessibilityBar>
    </div>
  );
};

export default EmployerHomePage;
