// src/components/EmployerNavBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';
import EmployerVoiceCommand from './EmployerVoiceCommand';

const NavBar = styled(AppBar)({
  backgroundColor: '#007bff',
  marginBottom: '2rem',
});

const NavButton = styled(Button)(({ active }) => ({
  color: active ? '#FF9000' : '#fff',
  marginLeft: '1rem',
}));

const EmployerNavBar = ({ activePage }) => {
  const navigate = useNavigate();

  return (
    <NavBar position="static" aria-label="Employer Navigation Bar">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }} aria-label="Inclusive Job Portal">
          Inclusive Job Portal
        </Typography>

        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <NavButton
              active={activePage === 'Home'}
              onClick={() => navigate('/employer-home')}
              aria-label="Go to Home"
            >
              HOME
            </NavButton>
            <NavButton
              active={activePage === 'Post Jobs'}
              onClick={() => navigate('/posting-jobs')}
              aria-label="Post Jobs"
            >
              POST JOBS
            </NavButton>
            <NavButton
              active={activePage === 'Manage Profile'}
              onClick={() => navigate('/employer-manage-profile')}
              aria-label="Manage Profile"
            >
              MANAGE PROFILE
            </NavButton>
            <NavButton
              active={activePage === 'Manage Applications'}
              onClick={() => navigate('/manage-applications')}
              aria-label="Manage Applications"
            >
              MANAGE APPLICATIONS
            </NavButton>
            <NavButton
              active={activePage === 'Shortlisted Candidates'}
              onClick={() => navigate('/shortlisted-candidates')}
              aria-label="View Shortlisted Candidates"
            >
              SHORTLISTED CANDIDATES
            </NavButton>
            <NavButton
              active={activePage === 'Skill Assessment'}
              onClick={() => navigate('/employer-skill-assessment')}
              aria-label="Skill Assessment"
            >
              SKILL ASSESSMENT
            </NavButton>
            <NavButton
              active={activePage === 'Learning Resources'}
              onClick={() => navigate('/employer-learning-resources')}
              aria-label="Learning Resources"
            >
              LEARNING RESOURCES
            </NavButton>
            <NavButton
              active={activePage === 'Accessibility Features'}
              onClick={() => navigate('/accessibility-features')}
              aria-label="Accessibility Features"
            >
              ACCESSIBILITY FEATURES
            </NavButton>
          </Box>

          {/* Icons Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={() => navigate('/notifications')} aria-label="Notifications">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/saved-jobs')} aria-label="Saved Jobs">
              <BookmarkIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/messages')} aria-label="Messages">
              <MessageIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/manage-profile')} aria-label="User Profile">
              <Avatar alt="User Profile" />
            </IconButton>
          </Box>
          <EmployerVoiceCommand aria-label="Voice Command" /> {/* Insert the Voice Command component */}
        </Box>
      </Toolbar>
    </NavBar>
  );
};

export default EmployerNavBar;
