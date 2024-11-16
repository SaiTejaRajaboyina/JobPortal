import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Autocomplete, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Root = styled('main')(({ highContrast, fontSize }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: highContrast ? '#333' : '#f0f4f8',
  color: highContrast ? '#fff' : '#000',
  fontSize: `${fontSize}px`,
}));

const FormContainer = styled(Container)(({ highContrast, fontSize }) => ({
  padding: '2rem',
  backgroundColor: highContrast ? '#000' : '#ffffff',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  width: '90%',
  maxWidth: '600px',
  fontSize: `${fontSize}px`,
}));

const SkipLink = styled('a')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: '#FFD700',
  color: '#000',
  padding: '0.5rem',
  zIndex: 1000,
  textDecoration: 'none',
}));

const Title = styled(Typography)(({ highContrast, fontSize }) => ({
  marginBottom: '1.5rem',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: '600',
  color: highContrast ? '#FFD700' : '#333',
  textAlign: 'center',
  fontSize: `${fontSize + 4}px`,
}));

const SearchButton = styled(Button)(({ highContrast, fontSize }) => ({
  backgroundColor: highContrast ? '#FFD700' : '#007bff',
  color: highContrast ? '#000' : '#fff',
  width: '100%',
  fontSize: `${fontSize}px`,
  '&:hover': {
    backgroundColor: highContrast ? '#FFC107' : '#0056b3',
  },
}));

const Breadcrumb = styled('nav')(() => ({
  fontSize: '0.9rem',
  marginBottom: '1rem',
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
  fontSize: `${fontSize}px`,
}));

const SearchJobsInputPage = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();

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
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobData();
  }, []);

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
    setFontSize((fontSize) => Math.min(fontSize + 2, 50));
  };

  const decreaseFontSize = () => {
    setFontSize((fontSize) => Math.max(fontSize - 2, 10));
  };

  const handleSearch = () => {
    navigate('/search-jobs', { state: { jobTitle, location } });
  };

  return (
    <div dir="ltr">
      <SkipLink href="#mainContent">Skip to content</SkipLink>
      <Root highContrast={highContrast} fontSize={fontSize}>
        <Breadcrumb aria-label="breadcrumb">
          <a href="/">Home</a> &gt; <span>Search Jobs</span>
        </Breadcrumb>
        <FormContainer highContrast={highContrast} fontSize={fontSize} id="mainContent">
          <Title variant="h4" highContrast={highContrast} fontSize={fontSize}>
            Search Jobs
          </Title>
          <Autocomplete
            options={jobTitles}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Job Title or Keywords"
                variant="outlined"
                InputLabelProps={{
                  style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` },
                }}
                InputProps={{
                  ...params.InputProps,
                  style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` },
                }}
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
                InputLabelProps={{
                  style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` },
                }}
                InputProps={{
                  ...params.InputProps,
                  style: { color: highContrast ? '#fff' : '#000', fontSize: `${fontSize}px` },
                }}
              />
            )}
            onChange={(event, value) => setLocation(value || '')}
            value={location}
          />
          <Box mt={2} />
          <SearchButton highContrast={highContrast} fontSize={fontSize} onClick={handleSearch}>
            Search
          </SearchButton>
        </FormContainer>
      </Root>
      <AccessibilityBar fontSize={fontSize}>
        <Button onClick={toggleHighContrast}>Toggle High Contrast</Button>
        <Button onClick={increaseFontSize}>Increase Font Size</Button>
        <Button onClick={decreaseFontSize}>Decrease Font Size</Button>
      </AccessibilityBar>
    </div>
  );
};

export default SearchJobsInputPage;
