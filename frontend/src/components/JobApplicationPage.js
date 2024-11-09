import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { storage, db, auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import UserNavBar from './UserNavBar';

const PageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center', // Center the form
  padding: '2rem',
  maxWidth: '800px', // Set a reasonable width for the form
  margin: 'auto',
});

const CenterSection = styled(Box)(({ highContrast }) => ({
  width: '100%',
  backgroundColor: highContrast ? '#000' : '#ffffff',
  color: highContrast ? '#fff' : '#000',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
}));

const ApplyButton = styled(Button)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#FFD700' : '#007bff',
  color: highContrast ? '#000' : '#fff',
  marginTop: '1.5rem',
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

const JobApplicationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { jobTitle, company } = location.state || { jobTitle: 'Software Engineer', company: 'Tech Corp' };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    country: '',
    zip: '',
  });

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [error, setError] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const { firstName, lastName, email } = userDoc.data();
          setFormData((prevData) => ({
            ...prevData,
            firstName,
            lastName,
            email,
          }));
        }
      }
    };
    fetchUserData();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleCoverLetterChange = (e) => {
    setCoverLetter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone || !formData.address || !formData.state || !formData.country || !formData.zip || !resume || !coverLetter) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const folderPath = `employers/${company}/${jobTitle}/${year}/${month}/${day}/${formData.firstName}-${formData.lastName}/`;

      const resumeRef = ref(storage, `${folderPath}resume.pdf`);
      const coverLetterRef = ref(storage, `${folderPath}cover-letter.pdf`);

      await uploadBytes(resumeRef, resume);
      await uploadBytes(coverLetterRef, coverLetter);

      const resumeURL = await getDownloadURL(resumeRef);
      const coverLetterURL = await getDownloadURL(coverLetterRef);

      const applicationData = {
        ...formData,
        jobTitle,
        company,
        resumeURL,
        coverLetterURL,
        date: date.toISOString(),
      };
      await addDoc(collection(db, 'jobApplications'), applicationData);

      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          country: formData.country,
          zip: formData.zip,
        });
      }

      navigate('/job-applied-successfully');
    } catch (err) {
      console.error('An error occurred while submitting your application:', err);
      setError('An error occurred while submitting your application.');
    }
  };

  return (
    <div style={{ fontSize: `${fontSize}px` }}>
      <UserNavBar activePage={'Search Jobs'}/>

      <PageContainer>
        <CenterSection highContrast={highContrast}>
          <Typography variant="h4" gutterBottom>
            Apply for {jobTitle} at {company}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName || 'Haven’t entered'}
              onChange={handleInputChange}
              disabled
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName || 'Haven’t entered'}
              onChange={handleInputChange}
              disabled
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email || 'Haven’t entered'}
              onChange={handleInputChange}
              disabled
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              required
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              required
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              required
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country || ''}
              onChange={handleInputChange}
              required
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Zip Code"
              name="zip"
              value={formData.zip || ''}
              onChange={handleInputChange}
              required
              variant="outlined"
              margin="normal"
            />
            <Box marginTop="1rem">
              <Typography variant="subtitle1">Upload Resume</Typography>
              <input type="file" onChange={handleResumeChange} required aria-label="Upload Resume" />
            </Box>
            <Box marginTop="1rem">
              <Typography variant="subtitle1">Upload Cover Letter</Typography>
              <input type="file" onChange={handleCoverLetterChange} required aria-label="Upload Cover Letter" />
            </Box>
            {error && <Typography color="error" marginTop="1rem" aria-live="assertive">{error}</Typography>}
            <ApplyButton highContrast={highContrast} data-command="Submit Application" type="submit">Submit Application</ApplyButton>
          </form>
        </CenterSection>
      </PageContainer>

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

export default JobApplicationPage;
