import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon } from '@mui/icons-material';
import { db, auth } from '../firebase'; // Firebase Firestore and Auth
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import UserNavBar from './UserNavBar';

const PageContainer = styled(Box)({
  padding: '2rem',
  maxWidth: '800px',
  margin: 'auto',
});

const ProfileSection = styled(Box)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#000' : '#ffffff',
  color: highContrast ? '#fff' : '#000',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
}));

const EditButton = styled(IconButton)({
  marginTop: '1rem',
});

const SaveButton = styled(Button)({
  marginTop: '1.5rem',
  display: 'block',
  margin: 'auto',
});

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

const ManageProfilePage = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    photoURL: 'https://via.placeholder.com/150',
    firstName: '',
    lastName: '',
    role: '',
    available: true,
    email: '',
    phone: '',
    address: '',
    state: '',
    country: '',
    zip: '',
    skills: [],
    hasSubmittedApplication: false,
  });

  const [isEditingTopSection, setIsEditingTopSection] = useState(false);
  const [isEditingMiddleSection, setIsEditingMiddleSection] = useState(false);
  const [topSectionData, setTopSectionData] = useState({});
  const [middleSectionData, setMiddleSectionData] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              ...data,
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: user.email || '',
              skills: JSON.parse(localStorage.getItem('userSkills')) || [],
              role: localStorage.getItem('userRole') || '',
              hasSubmittedApplication: data.hasSubmittedApplication || false,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
      } else {
        navigate('/login');
      }
    });

    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10) || 16;
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);

    return () => unsubscribe();
  }, [navigate]);

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

  const handleEditTopSection = () => {
    setIsEditingTopSection(true);
    setTopSectionData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      available: userData.available,
    });
  };

  const handleSaveTopSection = () => {
    if (!topSectionData.firstName || !topSectionData.lastName || !topSectionData.role) {
      alert('First Name, Last Name, and Role are required.');
      return;
    }

    localStorage.setItem('userRole', topSectionData.role);
    localStorage.setItem('userSkills', JSON.stringify(userData.skills));

    setUserData((prevData) => ({
      ...prevData,
      ...topSectionData,
    }));

    setIsEditingTopSection(false);
    setPopupOpen(true);
  };

  const handleEditMiddleSection = () => {
    setIsEditingMiddleSection(true);
    setMiddleSectionData({
      phone: userData.phone,
      address: userData.address,
      state: userData.state,
      country: userData.country,
      zip: userData.zip,
    });
  };

  const handleSaveMiddleSection = async () => {
    if (userData.hasSubmittedApplication) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          phone: middleSectionData.phone,
          address: middleSectionData.address,
          state: middleSectionData.state,
          country: middleSectionData.country,
          zip: middleSectionData.zip,
        });
      } catch (error) {
        console.error('Error saving middle section:', error);
      }
    }

    setUserData((prevData) => ({
      ...prevData,
      ...middleSectionData,
    }));
    setIsEditingMiddleSection(false);
    setPopupOpen(true);
  };

  const handleAddSkill = () => {
    if (newSkill && !userData.skills.includes(newSkill)) {
      const updatedSkills = [...userData.skills, newSkill];
      setUserData((prevData) => ({ ...prevData, skills: updatedSkills }));
      localStorage.setItem('userSkills', JSON.stringify(updatedSkills));
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = userData.skills.filter((skill) => skill !== skillToDelete);
    setUserData((prevData) => ({ ...prevData, skills: updatedSkills }));
    localStorage.setItem('userSkills', JSON.stringify(updatedSkills));
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ fontSize: `${fontSize}px` }}>
      <UserNavBar activePage={'Manage Profile'} />

      <PageContainer>
        {/* Top Section */}
        <ProfileSection highContrast={highContrast} sx={{ position: 'relative', textAlign: 'center' }}>
          <Avatar src={userData.photoURL} sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h6" sx={{ marginTop: '1rem' }} tabIndex="0">
            {`${userData.firstName} ${userData.lastName}`}
          </Typography>
          {isEditingTopSection ? (
            <>
              <TextField
                label="First Name"
                value={topSectionData.firstName}
                onChange={(e) => setTopSectionData({ ...topSectionData, firstName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                value={topSectionData.lastName}
                onChange={(e) => setTopSectionData({ ...topSectionData, lastName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Role"
                value={topSectionData.role}
                onChange={(e) => setTopSectionData((prevData) => ({ ...prevData, role: e.target.value }))}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Availability Status"
                value={topSectionData.available ? 'Available' : 'Not Available'}
                onChange={(e) =>
                  setTopSectionData((prevData) => ({
                    ...prevData,
                    available: e.target.value === 'Available',
                  }))
                }
                select
                SelectProps={{ native: true }}
                fullWidth
                margin="normal"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
              </TextField>
              <SaveButton variant="contained" data-command="Top Save" onClick={handleSaveTopSection}>
                Save
              </SaveButton>
            </>
          ) : (
            <>
              <Typography variant="h6">{userData.role || ''}</Typography>
              <Typography variant="body2">{userData.available ? 'Available to Work' : 'Not Available'}</Typography>
              <EditButton data-command="Top Edit" onClick={handleEditTopSection}>
                <EditIcon />
              </EditButton>
            </>
          )}
        </ProfileSection>

        {/* Middle Section */}
        <ProfileSection highContrast={highContrast} sx={{ position: 'relative' }}>
          {isEditingMiddleSection ? (
            <>
              <TextField
                label="Phone Number"
                value={middleSectionData.phone}
                onChange={(e) => setMiddleSectionData({ ...middleSectionData, phone: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={middleSectionData.address}
                onChange={(e) => setMiddleSectionData({ ...middleSectionData, address: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                value={middleSectionData.state}
                onChange={(e) => setMiddleSectionData({ ...middleSectionData, state: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Country"
                value={middleSectionData.country}
                onChange={(e) => setMiddleSectionData({ ...middleSectionData, country: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Zip Code"
                value={middleSectionData.zip}
                onChange={(e) => setMiddleSectionData({ ...middleSectionData, zip: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Box sx={{ marginTop: '1rem' }}>
                <Typography variant="h6">Skills and Expertise</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {userData.skills.map((skill) => (
                    <Chip key={skill} label={skill} onDelete={() => handleDeleteSkill(skill)} color="primary" />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', marginTop: '0.5rem' }}>
                  <TextField label="Add Skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} fullWidth />
                  <Button variant="contained" data-command="Add" onClick={handleAddSkill} sx={{ marginLeft: '1rem' }}>
                    Add
                  </Button>
                </Box>
              </Box>
              <SaveButton variant="contained" data-command="Bottom Save" onClick={handleSaveMiddleSection}>
                Save
              </SaveButton>
            </>
          ) : (
            <>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {userData.phone || 'Not Provided'}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {userData.address || 'Not Provided'}
              </Typography>
              <Typography variant="body1">
                <strong>State:</strong> {userData.state || 'Not Provided'}
              </Typography>
              <Typography variant="body1">
                <strong>Country:</strong> {userData.country || 'Not Provided'}
              </Typography>
              <Typography variant="body1">
                <strong>Zip Code:</strong> {userData.zip || 'Not Provided'}
              </Typography>
              <Box sx={{ marginTop: '1rem' }}>
                <Typography variant="h6">Skills and Expertise</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {userData.skills.map((skill) => (
                    <Chip key={skill} label={skill} color="primary" />
                  ))}
                </Box>
              </Box>
              <EditButton data-command="Bottom Edit" onClick={handleEditMiddleSection}>
                <EditIcon />
              </EditButton>
            </>
          )}
        </ProfileSection>

        {/* Popup Notification */}
        <Snackbar open={popupOpen} autoHideDuration={3000} onClose={handlePopupClose}>
          <Alert onClose={handlePopupClose} severity="success" sx={{ width: '100%' }}>
            Profile updated successfully!
          </Alert>
        </Snackbar>
      </PageContainer>

      {/* Accessibility Bar */}
      <AccessibilityBar>
        <Button variant="contained" data-command="Toggle" onClick={toggleHighContrast} sx={{ marginRight: '1rem' }}>
          Toggle High Contrast
        </Button>
        <Button variant="contained" data-command="Increase Font Size" onClick={increaseFontSize} sx={{ marginRight: '1rem' }}>
          Increase Font Size
        </Button>
        <Button variant="contained" data-command="Decrease Font Size" onClick={decreaseFontSize}>
          Decrease Font Size
        </Button>
      </AccessibilityBar>
    </div>
  );
};

export default ManageProfilePage;
