// src/components/SkillAssessmentDashboard.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserNavBar from './UserNavBar';

const DashboardContainer = styled(Container)({
  padding: '2rem',
  maxWidth: 'md',
  textAlign: 'center',
});

const SkillAssessmentDashboard = () => {
  // Hardcoded list of skill categories
  const skillCategories = ['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML'];
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  // Wrap startAssessment in useCallback to avoid re-creation on every render
  const startAssessment = useCallback(() => {
    if (selectedCategory) {  // Make sure a category is selected
      navigate('/skills-assessments-list', { state: { skillCategory: selectedCategory } });
    } else {
      console.error("Skill category is undefined or not selected");
    }
  }, [navigate, selectedCategory]);

  return (
    <div>
      <UserNavBar activePage="Skill Assessment" />
      
      <DashboardContainer>
        <Typography variant="h4" gutterBottom>Skill Assessment</Typography>
        
        <Typography variant="h6">Choose a Skill Category</Typography>
        
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          fullWidth
          sx={{ margin: '1rem 0' }}
        >
          {skillCategories.map((category) => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={startAssessment}
          disabled={!selectedCategory}
          data-command="Start Assessment"
        >
          Start Assessment
        </Button>
      </DashboardContainer>
    </div>
  );
};

export default SkillAssessmentDashboard;
