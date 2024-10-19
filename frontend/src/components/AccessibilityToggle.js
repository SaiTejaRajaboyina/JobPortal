import React, { useContext } from 'react';
import { Button, Box } from '@mui/material';
import { AccessibilityContext } from '../contexts/AccessibilityContext';

const AccessibilityToggle = () => {
  const { increaseFontSize, decreaseFontSize, resetFontSize } = useContext(AccessibilityContext);

  return (
    <Box sx={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
      <Button variant="outlined" onClick={increaseFontSize}>
        Increase Size
      </Button>
      <Button variant="outlined" onClick={decreaseFontSize}>
        Decrease Size
      </Button>
      <Button variant="outlined" onClick={resetFontSize}>
        Reset Size
      </Button>
    </Box>
  );
};

export default AccessibilityToggle;
