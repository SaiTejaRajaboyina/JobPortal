import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { db } from '../firebase'; // Import Firestore database
import { collection, getDocs } from 'firebase/firestore';

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

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const increaseFontSize = () => setFontSize((prevSize) => Math.min(prevSize + 2, 24));
  const decreaseFontSize = () => setFontSize((prevSize) => Math.max(prevSize - 2, 12));

  const handleSearch = () => {
    navigate('/search-jobs', { state: { jobTitle, location } });
  };

  return (
    <div
      style={{ fontSize: `${fontSize}px`, backgroundColor: highContrast ? '#333' : '#f0f4f8', color: highContrast ? '#fff' : '#000' }}
      aria-label="Search Jobs Input Page"
    >
      <Root highContrast={highContrast}>
        <FormContainer highContrast={highContrast} aria-label="Job Search Form">
          <Title variant="h4" highContrast={highContrast} aria-label="Search Jobs Title">
            Search Jobs
          </Title>

          {/* Job Title or Keywords Dropdown */}
          <Autocomplete
            options={jobTitles}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Job Title or Keywords"
                variant="outlined"
                aria-label="Select Job Title or Keywords"
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
                aria-label="Select Location"
                InputLabelProps={{ style: { color: highContrast ? '#fff' : '#000' } }}
                InputProps={{ ...params.InputProps, style: { color: highContrast ? '#fff' : '#000' } }}
              />
            )}
            onChange={(event, value) => setLocation(value || '')}
            value={location}
          />

          <Box mt={2} />

          <SearchButton highContrast={highContrast} data-command="Search" aria-label="Search Jobs" onClick={handleSearch}>
            Search
          </SearchButton>
        </FormContainer>
      </Root>

      {/* Accessibility Bar */}
      <AccessibilityBar aria-label="Accessibility Options">
        <Button
          variant="contained"
          aria-label="Toggle High Contrast Mode"
          data-command="Toggle"
          onClick={toggleHighContrast}
          sx={{ marginRight: '1rem' }}
        >
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
