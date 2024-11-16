import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmployerNavBar from './EmployerNavBar';  // Employer's navigation bar

// Styled container for the dashboard
const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: '2rem',
  maxWidth: 'md',
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: {
    marginTop: '1rem',
  },
}));

// The main dashboard component
const EmployerLearningResourceDashboard = () => {
  const categories = ['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML']; // Sample categories
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  // Function to handle navigating to resource management page
  const viewResources = () => {
    if (selectedCategory) {
      navigate('/add-resources', { state: { category: selectedCategory } });
      setFeedback({ open: true, message: `Navigating to resources for ${selectedCategory}`, severity: 'success' });
    } else {
      setFeedback({ open: true, message: 'Please select a category first.', severity: 'warning' });
    }
  };

  return (
    <div dir="ltr"> {/* Adding the dir attribute to the body for left-to-right text direction */}
      {/* Skip to content link for keyboard users */}
      <a href="#content" style={{ position: 'absolute', top: '-40px', left: '-40px', zIndex: -1 }}></a>
      
      <EmployerNavBar activePage="Learning Resources" /> {/* Active page indication */}
      
      <DashboardContainer id="content"> {/* Ensure "content" ID for accessibility */}
        <Typography variant="h4" gutterBottom>Manage Learning Resources</Typography>
        <Typography variant="h6">Choose a Category to Add Resources</Typography>
        
        {/* List of categories marked semantically */}
        <ul style={{ padding: 0, listStyleType: 'none' }}>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            fullWidth
            sx={{ margin: '1rem 0' }}
            aria-label="Select category for learning resources"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </ul>

        {/* View Resources Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={viewResources}
          disabled={!selectedCategory}
          aria-label="View selected category resources"
          data-command="View Resources"
        >
          View Resources
        </Button>
      </DashboardContainer>

      {/* Snackbar for feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setFeedback({ ...feedback, open: false })} severity={feedback.severity}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmployerLearningResourceDashboard;
