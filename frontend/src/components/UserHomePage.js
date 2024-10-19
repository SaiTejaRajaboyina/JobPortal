import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container, Box, IconButton, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';

const NavBar = styled(AppBar)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#000' : '#007bff',
  color: highContrast ? '#fff' : '#fff',
  marginBottom: '2rem',
}));

const NavButton = styled(Button)(({ active, highContrast }) => ({
  color: highContrast ? (active ? '#FFD700' : '#fff') : active ? '#FF9000' : '#fff',
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

const UserHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const checkActive = (path) => location.pathname === path;

  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10) || 16;
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('fontSize', fontSize);

    // Update the CSS variable for font size
    document.documentElement.style.setProperty('--app-font-size', `${fontSize}px`);
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
    <div style={{ fontSize: 'var(--app-font-size)', backgroundColor: highContrast ? '#000' : '#f0f4f8', color: highContrast ? '#fff' : '#000' }}>
      <NavBar position="static" highContrast={highContrast}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} /> {/* Empty box to push text to the center */}
          <Typography variant="h6" sx={{ textAlign: 'center', flexGrow: 0 }}>
            Inclusive Job Portal
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <NavButton highContrast={highContrast} active={checkActive('/home')} onClick={() => navigate('/home')}>
              Home
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/search-jobs-input')} onClick={() => navigate('/search-jobs-input')}>
              Search Jobs
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/manage-profile')} onClick={() => navigate('/manage-profile')}>
              Manage Profile
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/skills-assessments')} onClick={() => navigate('/skills-assessments')}>
              Skills Assessments
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/learning-resources')} onClick={() => navigate('/learning-resources')}>
              Learning Resources
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/voice-command')} onClick={() => navigate('/voice-command')}>
              Voice Command
            </NavButton>
            <NavButton highContrast={highContrast} active={checkActive('/accessibility-features')} onClick={() => navigate('/accessibility-features')}>
              Accessibility Features
            </NavButton>

            {/* Icons Section */}
            <IconSection>
              {/* Alert Icon - New Jobs */}
              <IconButton color="inherit" onClick={() => navigate('/new-jobs')}>
                <NotificationsIcon />
              </IconButton>

              {/* Saved Jobs Icon */}
              <IconButton color="inherit" onClick={() => navigate('/saved-jobs')}>
                <BookmarkIcon />
              </IconButton>

              {/* Messages Icon */}
              <IconButton color="inherit" onClick={() => navigate('/messages')}>
                <MessageIcon />
              </IconButton>

              {/* Profile Image Icon */}
              <IconButton color="inherit" onClick={() => navigate('/manage-profile')}>
                <Avatar alt="User Profile" src="/profile-pic.jpg" />
              </IconButton>
            </IconSection>
          </Box>
        </Toolbar>
      </NavBar>

      <Container>
        <CenteredBox highContrast={highContrast}>
          <Typography variant="h4" gutterBottom>
            Welcome to the Inclusive Job Portal
          </Typography>
          <Typography variant="body1" paragraph>
            The Inclusive Job Portal is designed to make job hunting accessible to everyone.
            Whether you're a job seeker or an employer, we provide tools that ensure a seamless experience.
          </Typography>
          <GetStartedButton highContrast={highContrast} onClick={() => navigate('/search-jobs-input')}>
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

export default UserHomePage;
