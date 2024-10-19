import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box, IconButton, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';

const NavBar = styled(AppBar)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#000' : '#007bff',
  marginBottom: '2rem',
  color: highContrast ? '#fff' : '#fff',
}));

const NavButton = styled(Button)(({ active, ishome, highContrast }) => ({
  color: highContrast ? (ishome ? '#FFD700' : active ? '#FFD700' : '#fff') : ishome ? '#FF9000' : active ? '#002DFF' : '#fff',
  marginLeft: '1rem',
}));

const IconSection = styled(Box)({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
});

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
  const location = useLocation();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const handleGetStartedClick = () => {
    navigate('/posting-jobs'); // Redirect to the Posting Jobs Page
  };

  const checkActive = (path) => location.pathname === path; // Function to check active page

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
    <div style={{ fontSize: `${fontSize}px` }}>
      {/* Navigation Bar */}
      <NavBar highContrast={highContrast} position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Inclusive Job Portal
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <NavButton highContrast={highContrast} ishome={checkActive('/employer-home')} onClick={() => navigate('/employer-home')}>
              Home
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/posting-jobs')} onClick={handleGetStartedClick}>
              Post Jobs
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/employer-manage-profile')} onClick={() => navigate('/employer-manage-profile')}>
              Manage Profile
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/manage-applications')} onClick={() => navigate('/manage-applications')}>
              Manage Applications
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/shortlisted-candidates')} onClick={() => navigate('/shortlisted-candidates')}>
              Shortlisted Candidates
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/skill-assessment')} onClick={() => navigate('/skill-assessment')}>
              Skill Assessment
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/learning-resources')} onClick={() => navigate('/learning-resources')}>
              Learning Resources
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/accessibility-features')} onClick={() => navigate('/accessibility-features')}>
              Accessibility Features
            </NavButton>
          </Box>

          {/* Icons Section */}
          <IconSection>
            <IconButton color="inherit" onClick={() => navigate('/notifications')}>
              <NotificationsIcon />
            </IconButton>

            <IconButton color="inherit" onClick={() => navigate('/saved-jobs')}>
              <BookmarkIcon />
            </IconButton>

            <IconButton color="inherit" onClick={() => navigate('/messages')}>
              <MessageIcon />
            </IconButton>

            <IconButton color="inherit" onClick={() => navigate('/manage-profile')}>
              <Avatar alt="User Profile" src="/profile-pic.jpg" />
            </IconButton>
          </IconSection>
        </Toolbar>
      </NavBar>

      <Container>
        <CenteredBox highContrast={highContrast}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Inclusive Job Portal
          </Typography>
          <Typography variant="body1" paragraph>
            The Inclusive Job Portal is designed to make job hunting accessible to everyone. Whether you're a job seeker or an employer, we provide tools that ensure a seamless experience.
          </Typography>
          <GetStartedButton highContrast={highContrast} onClick={handleGetStartedClick}>
            Get Started
          </GetStartedButton>
        </CenteredBox>
      </Container>

      {/* Accessibility Bar */}
      <AccessibilityBar>
        <Button variant="contained" onClick={toggleHighContrast} sx={{ marginRight: '1rem' }}>
          Toggle High Contrast
        </Button>
        <Button variant="contained" onClick={increaseFontSize} sx={{ marginRight: '1rem' }}>
          Increase Font Size
        </Button>
        <Button variant="contained" onClick={decreaseFontSize}>
          Decrease Font Size
        </Button>
      </AccessibilityBar>
    </div>
  );
};

export default EmployerHomePage;
