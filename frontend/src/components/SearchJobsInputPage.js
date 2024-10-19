import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ highContrast }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: highContrast ? '#333' : '#f0f4f8',
  color: highContrast ? '#fff' : '#000',
}));

const FormContainer = styled(Container)(({ highContrast }) => ({
  padding: '2rem',
  backgroundColor: highContrast ? '#000' : '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  maxWidth: 'sm',
}));

const Title = styled(Typography)(({ highContrast }) => ({
  marginBottom: '1.5rem',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: '600',
  color: highContrast ? '#FFD700' : '#333',
  textAlign: 'center',
}));

const SearchButton = styled(Button)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#FFD700' : '#007bff',
  color: highContrast ? '#000' : '#fff',
  width: '100%',
  '&:hover': {
    backgroundColor: highContrast ? '#FFC107' : '#0056b3',
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

// Predefined list of job titles
const jobTitles = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager', 'UI/UX Designer',
  'DevOps Engineer', 'Accountant', 'Sales Manager', 'Human Resources Manager', 'Customer Support',
  'Project Manager', 'Web Developer', 'Data Analyst', 'Business Analyst', 'Graphic Designer'
];

// Predefined list of locations
const locations = [
  'New York, NY', 'Los Angeles, CA', 'San Francisco, CA', 'Austin, TX', 'Chicago, IL',
  'Boston, MA', 'Seattle, WA', 'Denver, CO', 'Atlanta, GA', 'Miami, FL'
];

const SearchJobsInputPage = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

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

  const handleSearch = () => {
    navigate('/search-jobs', { state: { jobTitle, location } });
  };

  return (
    <div style={{ fontSize: `${fontSize}px`, backgroundColor: highContrast ? '#333' : '#f0f4f8', color: highContrast ? '#fff' : '#000' }}>
      <Root highContrast={highContrast}>
        <FormContainer highContrast={highContrast}>
          <Title variant="h4" highContrast={highContrast}>Search Jobs</Title>

          {/* Job Title or Keywords Dropdown */}
          <Autocomplete
            options={jobTitles}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Job Title or Keywords"
                variant="outlined"
                InputLabelProps={{ style: { color: highContrast ? '#fff' : '#000' } }}
                InputProps={{ ...params.InputProps, style: { color: highContrast ? '#fff' : '#000' } }}
              />
            )}
            onChange={(event, value) => setJobTitle(value || '')}
            value={jobTitle}
          />

          <Box mt={2} />

          {/* Location Dropdown */}
          <Autocomplete
            options={locations}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                variant="outlined"
                InputLabelProps={{ style: { color: highContrast ? '#fff' : '#000' } }}
                InputProps={{ ...params.InputProps, style: { color: highContrast ? '#fff' : '#000' } }}
              />
            )}
            onChange={(event, value) => setLocation(value || '')}
            value={location}
          />

          <Box mt={2} />

          <SearchButton highContrast={highContrast} onClick={handleSearch}>Search</SearchButton>
        </FormContainer>
      </Root>

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

export default SearchJobsInputPage;
