import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { db } from '../firebase'; // Import Firestore database
import { collection, getDocs } from 'firebase/firestore';

const Root = styled('div')(({ highContrast, fontSize }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: highContrast ? '#333' : '#f0f4f8',
  color: highContrast ? '#fff' : '#000',
  fontSize: `${fontSize}px`, // Apply font size here
}));

const FormContainer = styled(Container)(({ highContrast, fontSize }) => ({
  padding: '2rem',
  backgroundColor: highContrast ? '#000' : '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  maxWidth: 'sm',
  fontSize: `${fontSize}px`, // Apply font size here
}));

const Title = styled(Typography)(({ highContrast, fontSize }) => ({
  marginBottom: '1.5rem',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: '600',
  color: highContrast ? '#FFD700' : '#333',
  textAlign: 'center',
  fontSize: `${fontSize + 4}px`, // Increase font size for title
}));

const SearchButton = styled(Button)(({ highContrast, fontSize }) => ({
  backgroundColor: highContrast ? '#FFD700' : '#007bff',
  color: highContrast ? '#000' : '#fff',
  width: '100%',
  fontSize: `${fontSize}px`, // Apply font size here
  '&:hover': {
    backgroundColor: highContrast ? '#FFC107' : '#0056b3',
  },
}));

const AccessibilityBar = styled(Box)(({ fontSize }) => ({
  display: 'flex',
  justifyContent: 'center',
  position: 'fixed',
  bottom: '10px',
  width: '100%',
  backgroundColor: '#f0f4f8',
  padding: '0.5rem',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  fontSize: `${fontSize}px`, // Apply font size here
}));

const jobTitles = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager', 'UI/UX Designer',
  'DevOps Engineer', 'Accountant', 'Sales Manager', 'Human Resources Manager', 'Customer Support',
  'Project Manager', 'Web Developer', 'Data Analyst', 'Business Analyst', 'Graphic Designer'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'San Francisco, CA', 'Austin, TX', 'Chicago, IL',
  'Boston, MA', 'Seattle, WA', 'Denver, CO', 'Atlanta, GA', 'Miami, FL'
];

const SearchJobsInputPage = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

  // Fetch job titles and locations from Firestore
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const titlesSet = new Set();
        const locationsSet = new Set();
        
        jobsSnapshot.forEach((doc) => {
          const data = doc.data();
          titlesSet.add(data.title);
          locationsSet.add(data.location);
        });

        setJobTitles(Array.from(titlesSet));
        setLocations(Array.from(locationsSet));
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobData();
  }, []);

  // Load settings for high contrast and font size from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10) || 16;
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);
  }, []);

  // Save settings for high contrast and font size to localStorage
  useEffect(() => {
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('fontSize', fontSize);
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const increaseFontSize = () => {
    setFontSize((fontSize) => Math.min(fontSize + 2, 50));
  };

  const decreaseFontSize = () => {
    setFontSize((fontSize) => Math.max(fontSize - 2, 10));
  };

  const handleSearch = () => {
    navigate('/search-jobs', { state: { jobTitle, location } });
  };

  return (
    <div style={{ fontSize: `${fontSize}px`, backgroundColor: highContrast ? '#333' : '#f0f4f8', color: highContrast ? '#fff' : '#000' }}>
      <Root highContrast={highContrast} fontSize={fontSize}>
        <FormContainer highContrast={highContrast} fontSize={fontSize}>
          <Title variant="h4" highContrast={highContrast} fontSize={fontSize}>Search Jobs</Title>

          <Autocomplete
            options={jobTitles}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Job Title or Keywords"
                variant="outlined"
                InputLabelProps={{ style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` } }}
                InputProps={{ ...params.InputProps, style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` } }}
              />
            )}
            onChange={(event, value) => setJobTitle(value || '')}
            value={jobTitle}
          />

          <Box mt={2} />

          <Autocomplete
            options={locations}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                variant="outlined"
                InputLabelProps={{ style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` } }}
                InputProps={{ ...params.InputProps, style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` } }}
              />
            )}
            onChange={(event, value) => setLocation(value || '')}
            value={location}
          />

          <Box mt={2} />

          <SearchButton highContrast={highContrast} fontSize={fontSize} onClick={handleSearch}>Search</SearchButton>
        </FormContainer>
      </Root>

      <AccessibilityBar fontSize={fontSize}>
        <Button variant="contained" onClick={toggleHighContrast} sx={{ marginRight: '1rem' }}>
          Toggle High Contrast
        </Button>
        <Button
          variant="contained"
          aria-label="Increase Font Size"
          data-command="Increase Font Size"
          onClick={increaseFontSize}
          sx={{ marginRight: '1rem' }}
        >
          Increase Font Size
        </Button>
        <Button
          variant="contained"
          aria-label="Decrease Font Size"
          data-command="Decrease Font Size"
          onClick={decreaseFontSize}
        >
          Decrease Font Size
        </Button>
      </AccessibilityBar>
    </div>
  );
};

export default SearchJobsInputPage;
