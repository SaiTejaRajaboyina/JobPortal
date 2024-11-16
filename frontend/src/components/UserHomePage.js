import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserNavBar from './UserNavBar';

const CenteredBox = styled(Box)(({ highContrast }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  height: '80vh',
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

const SkipLink = styled('a')({
  position: 'absolute',
  top: '-40px',
  left: '0',
  backgroundColor: '#000',
  color: '#fff',
  padding: '8px',
  textDecoration: 'none',
  zIndex: '100',
  '&:focus': {
    top: '0',
  },
});

const UserHomePage = () => {
  const navigate = useNavigate();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10) || 16;
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.style.setProperty('--app-font-size', `${fontSize}px`);
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const increaseFontSize = () => setFontSize((prevSize) => Math.min(prevSize + 2, 24));
  const decreaseFontSize = () => setFontSize((prevSize) => Math.max(prevSize - 2, 12));

  return (
    <div
      dir="ltr"
      lang="en"
      style={{
        fontSize: 'var(--app-font-size)',
        backgroundColor: highContrast ? '#000' : '#f0f4f8',
        color: highContrast ? '#fff' : '#000',
      }}
      aria-label="User Home Page"
    >
      <SkipLink href="#main-content">Skip to Content</SkipLink>
      <UserNavBar activePage="Home" />

      <Container id="main-content">
        <nav aria-label="Breadcrumb Navigation">
          <ul>
            <li>
              <a href="/" aria-label="Home Page">Home</a>
            </li>
            <li aria-current="page">Inclusive Job Portal</li>
          </ul>
        </nav>

        <CenteredBox highContrast={highContrast}>
          <Typography variant="h4" gutterBottom aria-label="Welcome Message">
            Welcome to the Inclusive Job Portal
          </Typography>
          <Typography
            variant="body1"
            paragraph
            aria-label="Description of the Inclusive Job Portal"
          >
            The <abbr title="Inclusive Job Portal">IJP</abbr> is designed to make job hunting
            accessible to everyone. Whether you're a job seeker or an employer, we provide tools
            that ensure a seamless experience.
          </Typography>
          <GetStartedButton
            highContrast={highContrast}
            aria-label="Get Started with Job Search"
            onClick={() => navigate('/search-jobs-input')}
          >
            Get Started
          </GetStartedButton>
        </CenteredBox>
      </Container>

      <AccessibilityBar aria-label="Accessibility Options">
        <Button
          variant="contained"
          aria-label="Toggle High Contrast Mode"
          onClick={toggleHighContrast}
          sx={{ marginRight: '1rem' }}
        >
          Toggle High Contrast
        </Button>
        <Button
          variant="contained"
          aria-label="Increase Font Size"
          onClick={increaseFontSize}
          sx={{ marginRight: '1rem' }}
        >
          Increase Font Size
        </Button>
        <Button
          variant="contained"
          aria-label="Decrease Font Size"
          onClick={decreaseFontSize}
        >
          Decrease Font Size
        </Button>
      </AccessibilityBar>
    </div>
  );
};

export default UserHomePage;
