import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmployerNavBar from './EmployerNavBar';  // Employer's navigation bar

const DashboardContainer = styled(Container)({
  padding: '2rem',
  maxWidth: 'md',
  textAlign: 'center',
});

const EmployerLearningResourceDashboard = () => {
  const categories = ['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML']; // Sample categories
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const viewResources = () => {
    if (selectedCategory) {
      navigate('/add-resources', { state: { category: selectedCategory } });
      setFeedback({ open: true, message: `Navigating to resources for ${selectedCategory}`, severity: 'success' });
    } else {
      setFeedback({ open: true, message: 'Please select a category first.', severity: 'warning' });
    }
  };

  return (
    <div>
      <EmployerNavBar activePage="Learning Resources" />  {/* Active page indication */}

      <DashboardContainer>
        <Typography variant="h4" gutterBottom>Manage Learning Resources</Typography>

        {/* Correcting the label association */}
        <label for="category-select"> {/* Set the for attribute to link the label with the select element */}
          <Typography variant="h6">Choose a Category to Add Resources</Typography>
        </label>

        <Select
          id="category-select"  // Set the id to match the label's 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}  // Corrected onChange handler
          fullWidth
          sx={{ margin: '1rem 0' }}
          aria-label="Select category for learning resources"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>

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
