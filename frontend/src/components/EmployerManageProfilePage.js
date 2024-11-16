import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Avatar,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import EmployerNavBar from './EmployerNavBar';

const PageContainer = styled(Box)({
  padding: '2rem',
  maxWidth: '800px',
  margin: 'auto',
});

const ProfileSection = styled(Box)({
  backgroundColor: '#ffffff',
  color: '#000',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  marginBottom: '2rem',
});

const SaveButton = styled(Button)({
  marginTop: '1.5rem',
  display: 'block',
  margin: 'auto',
});

const EmployerManageProfilePage = () => {
  const navigate = useNavigate();
  const [employerData, setEmployerData] = useState({
    photoURL: 'https://via.placeholder.com/150',
    companyName: '',
    firstName: '',
    lastName: '',
    role: '',
    phone: '',
    address: '',
    state: '',
    country: '',
    zip: '',
    description: '',
  });

  const [isEditingTopSection, setIsEditingTopSection] = useState(false);
  const [isEditingBottomSection, setIsEditingBottomSection] = useState(false);
  const [topSectionData, setTopSectionData] = useState({});
  const [bottomSectionData, setBottomSectionData] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEmployerData = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const employerDocRef = doc(db, 'employers', user.uid);
        const employerDoc = await getDoc(employerDocRef);
  
        if (employerDoc.exists()) {
          const data = employerDoc.data();
          setEmployerData({
            ...data,
            companyName: data.companyName || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            role: data.role || '',
            phone: data.phone || '',
            address: data.address || '',
            state: data.state || '',
            country: data.country || '',
            zip: data.zip || '',
            description: data.description || '',
          });
        } else {
          await setDoc(employerDocRef, employerData);
        }
  
        const savedTopSection = JSON.parse(localStorage.getItem('topSectionData'));
        if (savedTopSection) {
          setEmployerData((prevData) => ({
            ...prevData,
            ...savedTopSection,
          }));
        }
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    }
    setLoading(false);
  }, [employerData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchEmployerData();
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, fetchEmployerData]);

  const handleEditTopSection = () => {
    setIsEditingTopSection(true);
    setTopSectionData({
      companyName: employerData.companyName,
      firstName: employerData.firstName,
      lastName: employerData.lastName,
      role: employerData.role,
    });
  };

  const handleSaveTopSection = () => {
    localStorage.setItem('topSectionData', JSON.stringify(topSectionData));
    setEmployerData((prevData) => ({
      ...prevData,
      ...topSectionData,
    }));
    setIsEditingTopSection(false);
    setPopupOpen(true);
  };

  const handleEditBottomSection = () => {
    setIsEditingBottomSection(true);
    setBottomSectionData({
      phone: employerData.phone,
      address: employerData.address,
      state: employerData.state,
      country: employerData.country,
      zip: employerData.zip,
      description: employerData.description,
    });
  };

  const handleSaveBottomSection = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'employers', user.uid), {
          phone: bottomSectionData.phone,
          address: bottomSectionData.address,
          state: bottomSectionData.state,
          country: bottomSectionData.country,
          zip: bottomSectionData.zip,
          description: bottomSectionData.description,
        });
        setEmployerData((prevData) => ({
          ...prevData,
          ...bottomSectionData,
        }));
        setPopupOpen(true);
      } catch (error) {
        console.error('Error saving bottom section to Firestore:', error);
      }
    }
    setIsEditingBottomSection(false);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress aria-busy="true" aria-live="polite" />
      </Box>
    );
  }

  return (
    <div dir="ltr"> {/* Ensure text directionality is properly handled */}
      <EmployerNavBar activePage="Manage Profile" />
      <PageContainer>
        <ProfileSection aria-labelledby="profile-header">
          <Avatar
            src={employerData.photoURL}
            sx={{ width: 100, height: 100, margin: 'auto' }}
            alt="Profile photo"
          />
          <Typography id="profile-header" variant="h6" sx={{ marginTop: '1rem' }}>
            {employerData.companyName}
          </Typography>
          {isEditingTopSection ? (
            <>
              <TextField
                label="Company Name"
                value={topSectionData.companyName}
                onChange={(e) => setTopSectionData({ ...topSectionData, companyName: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="Company Name"
              />
              <TextField
                label="First Name"
                value={topSectionData.firstName}
                onChange={(e) => setTopSectionData({ ...topSectionData, firstName: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="First Name"
              />
              <TextField
                label="Last Name"
                value={topSectionData.lastName}
                onChange={(e) => setTopSectionData({ ...topSectionData, lastName: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="Last Name"
              />
              <TextField
                label="Role"
                value={topSectionData.role}
                onChange={(e) => setTopSectionData({ ...topSectionData, role: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="Role"
              />
              <SaveButton variant="contained" data-command="Top Save" onClick={handleSaveTopSection}>
                Save
              </SaveButton>
            </>
          ) : (
            <>
              <Typography variant="body1">
                <strong>Company Name:</strong> {employerData.companyName}
              </Typography>
              <Typography variant="body1">
                <strong>Contact Person:</strong> {`${employerData.firstName} ${employerData.lastName}`}
              </Typography>
              <Typography variant="body1">
                <strong>Role:</strong> {employerData.role}
              </Typography>
              <Button
                variant="contained"
                data-command="Top Edit"
                onClick={handleEditTopSection}
                sx={{ marginTop: '1rem' }}
              >
                Edit
              </Button>
            </>
          )}
        </ProfileSection>

        <ProfileSection aria-labelledby="profile-header-bottom">
          <Typography id="profile-header-bottom" variant="h6">
            Contact Information
          </Typography>
          {isEditingBottomSection ? (
            <>
              <TextField
                label="Phone"
                value={bottomSectionData.phone}
                onChange={(e) => setBottomSectionData({ ...bottomSectionData, phone: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="Phone"
              />
              <TextField
                label="Address"
                value={bottomSectionData.address}
                onChange={(e) => setBottomSectionData({ ...bottomSectionData, address: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="Address"
              />
              <TextField
                label="State"
                value={bottomSectionData.state}
                onChange={(e) => setBottomSectionData({ ...bottomSectionData, state: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="State"
              />
              <TextField
                label="Country"
                value={bottomSectionData.country}
                onChange={(e) => setBottomSectionData({ ...bottomSectionData, country: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="Country"
              />
              <TextField
                label="Zip Code"
                value={bottomSectionData.zip}
                onChange={(e) => setBottomSectionData({ ...bottomSectionData, zip: e.target.value })}
                fullWidth
                margin="normal"
                aria-label="Zip Code"
              />
              <TextField
                label="Description"
                value={bottomSectionData.description}
                onChange={(e) => setBottomSectionData({ ...bottomSectionData, description: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                aria-label="Description"
              />
              <SaveButton variant="contained" data-command="Bottom Save" onClick={handleSaveBottomSection}>
                Save
              </SaveButton>
            </>
          ) : (
            <>
              <Typography variant="body1">
                <strong>Phone:</strong> {employerData.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {employerData.address}
              </Typography>
              <Typography variant="body1">
                <strong>State:</strong> {employerData.state}
              </Typography>
              <Typography variant="body1">
                <strong>Country:</strong> {employerData.country}
              </Typography>
              <Typography variant="body1">
                <strong>Zip Code:</strong> {employerData.zip}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {employerData.description}
              </Typography>
              <Button
                variant="contained"
                data-command="Bottom Edit"
                onClick={handleEditBottomSection}
                sx={{ marginTop: '1rem' }}
              >
                Edit
              </Button>
            </>
          )}
        </ProfileSection>

        <Snackbar open={popupOpen} autoHideDuration={6000} onClose={handlePopupClose}>
          <Alert onClose={handlePopupClose} severity="success" sx={{ width: '100%' }}>
            Profile Updated Successfully!
          </Alert>
        </Snackbar>
      </PageContainer>
    </div>
  );
};

export default EmployerManageProfilePage;
