// src/components/AccessibilityBar.js
import React, { useContext } from 'react';
import { Button, Box } from '@mui/material';
import { AccessibilityContext } from './AccessibilityContext';
import { styled } from '@mui/material/styles';

const AccessibilityBarContainer = styled(Box)({
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

const AccessibilityBar = () => {
  const {
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
  } = useContext(AccessibilityContext);

  return (
    <AccessibilityBarContainer aria-label="Accessibility Options">
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
    </AccessibilityBarContainer>
  );
};

export default AccessibilityBar;
