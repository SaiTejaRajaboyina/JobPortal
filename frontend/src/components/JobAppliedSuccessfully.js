// src/components/JobAppliedSuccessfully.js

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JobAppliedSuccessfully = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      {/* Confetti Animation */}
      <Confetti width={windowDimensions.width} height={windowDimensions.height} />
      
      {/* Success Message */}
      <Typography variant="h3" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#28a745' }}>
        Congratulations!
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: '2rem', color: '#333' }}>
        Your job application has been submitted successfully.
      </Typography>

      {/* Button to navigate back to search jobs */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/search-jobs-input')}
      >
        Back to Search Jobs
      </Button>
    </Box>
  );
};

export default JobAppliedSuccessfully;
