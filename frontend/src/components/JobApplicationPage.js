import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Box, Toolbar, Avatar, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { storage, db, auth } from '../firebase'; // Firebase setup
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, updateDoc  } from 'firebase/firestore'; // Ensure getDoc is imported
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';

const NavBar = styled('div')(({ highContrast }) => ({
  backgroundColor: highContrast ? '#000' : '#007bff',
  padding: '0rem',
  color: highContrast ? '#fff' : '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
}));

const NavButton = styled(Button)(({ isActive, isSearchJobs, highContrast }) => ({
  color: highContrast ? (isSearchJobs ? '#FFD700' : isActive ? '#FFD700' : '#fff') : isSearchJobs ? '#FF9000' : isActive ? '#002DFF' : '#fff',
  marginRight: '1rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

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

  // Get jobTitle and company from location.state or default values
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

  // Fetch current user's data (first name, last name, email) from Firestore
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
  
    // Check if all required fields are filled
    if (!formData.phone || !formData.address || !formData.state || !formData.country || !formData.zip || !resume || !coverLetter) {
      setError('Please fill in all mandatory fields.');
      return;
    }
  
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2 digits
      const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits
  
      const folderPath = `employers/${company}/${jobTitle}/${year}/${month}/${day}/${formData.firstName}-${formData.lastName}/`;
  
      // Upload resume and cover letter to Firebase Storage
      const resumeRef = ref(storage, `${folderPath}resume.pdf`);
      const coverLetterRef = ref(storage, `${folderPath}cover-letter.pdf`);
  
      await uploadBytes(resumeRef, resume);
      await uploadBytes(coverLetterRef, coverLetter);
  
      const resumeURL = await getDownloadURL(resumeRef);
      const coverLetterURL = await getDownloadURL(coverLetterRef);
  
      // Save application data to Firestore in the 'jobApplications' collection
      await addDoc(collection(db, 'jobApplications'), {
        ...formData,
        jobTitle, // Save the passed job title
        company, // Save the passed company name
        resumeURL,
        coverLetterURL,
        date: date.toISOString(),
      });
  
      // Update the existing user document in Firestore with additional fields
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        
        // Update user document with additional details
        await updateDoc(userDocRef, {
          phone: formData.phone,
          address: formData.address,
          state: formData.state,
          country: formData.country,
          zip: formData.zip,
        });
        
        console.log("User details updated successfully in Firestore.");
      }
  
      navigate('/job-applied-successfully');
    } catch (err) {
      console.error('An error occurred while submitting your application:', err);
      setError('An error occurred while submitting your application.');
    }
  };  

  return (
    <div style={{ fontSize: `${fontSize}px` }}>
      {/* Navigation Bar */}
      <NavBar position="static" highContrast={highContrast}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: '#fff', marginRight: '2rem', textAlign: 'center' }}>
            Inclusive Job Portal
          </Typography>

          {/* Navigation buttons */}
          <NavButton highContrast={highContrast} isActive={location.pathname === '/home'} onClick={() => navigate('/home')}>
            Home
          </NavButton>
          <NavButton highContrast={highContrast} isSearchJobs={location.pathname === '/job-application'} onClick={() => navigate('/search-jobs')}>
            Search Jobs
          </NavButton>
          <NavButton highContrast={highContrast} isActive={location.pathname === '/manage-profile'} onClick={() => navigate('/manage-profile')}>
            Manage Profile
          </NavButton>
          <NavButton highContrast={highContrast} isActive={location.pathname === '/skills-assessments'} onClick={() => navigate('/skills-assessments')}>
            Skills Assessments
          </NavButton>
          <NavButton highContrast={highContrast} isActive={location.pathname === '/learning-resources'} onClick={() => navigate('/learning-resources')}>
            Learning Resources
          </NavButton>
          <NavButton highContrast={highContrast} isActive={location.pathname === '/voice-command'} onClick={() => navigate('/voice-command')}>
            Voice Command
          </NavButton>
          <NavButton highContrast={highContrast} isActive={location.pathname === '/accessibility-features'} onClick={() => navigate('/accessibility-features')}>
            Accessibility Features
          </NavButton>

          {/* Icons Section */}
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: '#fff' }}>
            <IconButton color="inherit" onClick={() => navigate('/new-jobs')}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/saved-jobs')}>
              <BookmarkIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/messages')}>
              <MessageIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/manage-profile')}>
              <Avatar alt="User Profile" src="/profile-pic.jpg" />
            </IconButton>
          </Box>
        </Toolbar>
      </NavBar>

      <PageContainer>
        {/* Center Section: Job Application Form */}
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
              <input type="file" onChange={handleResumeChange} required />
            </Box>
            <Box marginTop="1rem">
              <Typography variant="subtitle1">Upload Cover Letter</Typography>
              <input type="file" onChange={handleCoverLetterChange} required />
            </Box>
            {error && <Typography color="error" marginTop="1rem">{error}</Typography>}
            <ApplyButton highContrast={highContrast} type="submit">Submit Application</ApplyButton>
          </form>
        </CenterSection>
      </PageContainer>

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

export default JobApplicationPage;
