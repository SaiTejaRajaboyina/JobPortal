// src/components/UserNavBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box, IconButton, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';
import VoiceCommand from './VoiceCommand';

const NavBar = styled(AppBar)({
  backgroundColor: '#007bff',
  marginBottom: '2rem',
});

const NavButton = styled(Button)(({ active }) => ({
  color: active ? '#FF9000' : '#fff',
  marginLeft: '1rem',
}));

const IconSection = styled(Box)({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
});

const UserNavBar = ({ activePage }) => {
  const navigate = useNavigate();

  return (
    <NavBar position="static" aria-label="User Navigation Bar">
      <Toolbar>
        {/* Application Title */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textAlign: 'center' }}
          aria-label="Inclusive Job Portal"
          role="heading"
        >
          Inclusive Job Portal
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <NavButton
              active={activePage === 'Home'}
              aria-label="Go to Home page"
              onClick={() => navigate('/home')}
            >
              Home
            </NavButton>
            <NavButton
              active={activePage === 'Search Jobs'}
              aria-label="Go to Search Jobs page"
              onClick={() => navigate('/search-jobs-input')}
            >
              Search Jobs
            </NavButton>
            <NavButton
              active={activePage === 'Manage Profile'}
              aria-label="Go to Manage Profile page"
              onClick={() => navigate('/manage-profile')}
            >
              Manage Profile
            </NavButton>
            <NavButton
              active={activePage === 'Skill Assessment'}
              aria-label="Go to Skills Assessments page"
              onClick={() => navigate('/skills-assessments')}
            >
              Skills Assessments
            </NavButton>
            <NavButton
              active={activePage === 'Learning Resources'}
              aria-label="Go to Learning Resources page"
              onClick={() => navigate('/learning-resources')}
            >
              Learning Resources
            </NavButton>
            <NavButton
              active={activePage === 'Voice Command'}
              aria-label="Go to Voice Command page"
              onClick={() => navigate('/voice-command')}
            >
              Voice Command
            </NavButton>
            <NavButton
              active={activePage === 'Accessibility Feature'}
              aria-label="Go to Accessibility Features page"
              onClick={() => navigate('/accessibility-features')}
            >
              Accessibility Features
            </NavButton>
          </Box>

          {/* Icon Section with ARIA Labels */}
          <IconSection>
            <IconButton
              color="inherit"
              aria-label="View Notifications"
              onClick={() => navigate('/notifications')}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="View Saved Jobs"
              onClick={() => navigate('/saved-jobs')}
            >
              <BookmarkIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="View Messages"
              onClick={() => navigate('/messages')}
            >
              <MessageIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="Go to Profile"
              onClick={() => navigate('/manage-profile')}
            >
              <Avatar alt="User Profile" src="/profile-pic.jpg" />
            </IconButton>
          </IconSection>

          {/* Voice Command Component */}
          <VoiceCommand /> {/* Voice command component with default accessibility */}
        </Box>
      </Toolbar>
    </NavBar>
  );
};

export default UserNavBar;
