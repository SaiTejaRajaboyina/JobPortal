import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography, Box, Avatar, IconButton, AppBar, Toolbar, TextField, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const NavBar = styled(AppBar)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#000' : '#007bff',
  padding: '0rem',
  color: highContrast ? '#fff' : '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
}));

const NavButton = styled(Button)(({ isActive, isPostJobs, highContrast }) => ({
  color: highContrast ? (isPostJobs ? '#FFD700' : isActive ? '#FFD700' : '#fff') : isPostJobs ? '#FF9000' : isActive ? '#002DFF' : '#fff',
  marginRight: '1rem',
  '&:hover': {
    backgroundColor: highContrast ? '#444' : 'rgba(255, 255, 255, 0.2)',
  },
}));

const PageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2rem',
  maxWidth: '1200px',
  margin: 'auto',
});

const BoxContainer = styled(Box)({
  padding: '1rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  margin: '1rem',
  overflowY: 'auto',
  maxHeight: '75vh',
});

const LeftSide = styled(BoxContainer)({
  width: '30%',
});

const JobTitleBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  backgroundColor: '#f0f4f8',
  borderBottom: '1px solid #ddd',
});

const JobItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '1rem',
  borderBottom: '1px solid #ddd',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f4f8',
  },
});

const JobLogo = styled('img')({
  width: '50px',
  height: '50px',
  marginRight: '10px',
});

const CenterSection = styled(BoxContainer)({
  width: '40%',
});

const RightSide = styled(BoxContainer)({
  width: '25%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const UserProfile = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '2rem',
});

const JobFormModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

const PostJobsPage = () => {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [employerName, setEmployerName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    skills: [],
  });
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10) || 16;
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'employers', user.uid));
        if (userDoc.exists()) {
          const { firstName, lastName } = userDoc.data();
          setEmployerName(`${firstName} ${lastName}`);
        }
      }
    });

    // Fetch the existing jobs from Firestore
    const fetchJobs = async () => {
      const jobsSnapshot = await getDocs(collection(db, 'jobs'));
      const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    };

    fetchJobs();
    return () => unsubscribe();
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

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleAddJob = async () => {
    try {
      const jobRef = await addDoc(collection(db, 'jobs'), newJob);
      setJobs([...jobs, { id: jobRef.id, ...newJob }]);
      setOpenModal(false);
      setNewJob({ title: '', company: '', location: '', description: '', skills: [] });
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDeleteJob = async (jobToDelete) => {
    try {
      await deleteDoc(doc(db, 'jobs', jobToDelete.id));
      setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      await updateDoc(doc(db, 'jobs', updatedJob.id), updatedJob);
      setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div style={{ fontSize: `${fontSize}px` }}>
      {/* Navigation Bar */}
      <NavBar highContrast={highContrast} position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ color: '#fff', marginRight: '2rem', textAlign: 'center' }}>
            Inclusive Job Portal
          </Typography>
          <NavButton highContrast={highContrast} isActive={currentLocation.pathname === '/employer-home'} onClick={() => navigate('/employer-home')}>
            Home
          </NavButton>
          <NavButton highContrast={highContrast} isPostJobs={currentLocation.pathname === '/posting-jobs'} onClick={() => navigate('/post-jobs')}>
            Post Jobs
          </NavButton>
          <NavButton highContrast={highContrast} isActive={currentLocation.pathname === '/manage-profile'} onClick={() => navigate('/manage-profile')}>
            Manage Profile
          </NavButton>
          <NavButton highContrast={highContrast} isActive={currentLocation.pathname === '/manage-applications'} onClick={() => navigate('/manage-applications')}>
            Manage Applications
          </NavButton>
          <NavButton highContrast={highContrast} isActive={currentLocation.pathname === '/shortlisted-candidates'} onClick={() => navigate('/shortlisted-candidates')}>
            Shortlisted Candidates
          </NavButton>
          <NavButton highContrast={highContrast} isActive={currentLocation.pathname === '/skill-assessment'} onClick={() => navigate('/skill-assessment')}>
            Skill Assessment
          </NavButton>
          <NavButton highContrast={highContrast} isActive={currentLocation.pathname === '/learning-resources'} onClick={() => navigate('/learning-resources')}>
            Learning Resources
          </NavButton>
          <NavButton highContrast={highContrast} isActive={currentLocation.pathname === '/accessibility-features'} onClick={() => navigate('/accessibility-features')}>
            Accessibility Features
          </NavButton>

          {/* Icons Section */}
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: '#fff' }}>
            <IconButton color="inherit" onClick={() => navigate('/notifications')}>
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

      {/* Rest of the Page */}
      <PageContainer>
        {/* Left Side: Job Listings */}
        <LeftSide>
          <JobTitleBar>
            <Typography variant="h6">Jobs</Typography>
            <IconButton onClick={() => setOpenModal(true)}>
              <AddIcon />
            </IconButton>
          </JobTitleBar>

          {jobs.map((job) => (
            <JobItem key={job.id} onClick={() => handleJobSelect(job)}>
              <JobLogo src="https://via.placeholder.com/50" alt={job.company} />
              <Box>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2">{job.company}</Typography>
                <Typography variant="body2">{job.location}</Typography>
              </Box>
              <IconButton onClick={() => handleDeleteJob(job)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleJobSelect(job)}>
                <EditIcon />
              </IconButton>
            </JobItem>
          ))}
        </LeftSide>

        {/* Center Section: Job Description */}
        <CenterSection>
          {selectedJob ? (
            <>
              <Typography variant="h5">{selectedJob.title}</Typography>
              <Typography variant="subtitle1">{selectedJob.company}</Typography>
              <Typography variant="subtitle2">{selectedJob.location}</Typography>
              <Typography variant="h6" marginTop="1rem">
                Description
              </Typography>
              <Typography variant="body1" marginTop="0.5rem">
                {selectedJob.description}
              </Typography>
              <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={() => handleUpdateJob(selectedJob)}>
                Update Job
              </Button>
            </>
          ) : (
            <Typography variant="body1">Select a job to see the details</Typography>
          )}
        </CenterSection>

        {/* Right Side: Employer Profile */}
        <RightSide>
          <UserProfile>
            <Avatar alt="Employer" src="https://via.placeholder.com/150" sx={{ width: 100, height: 100 }} />
            <Typography variant="h6" sx={{ textAlign: 'center' }}>{employerName}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>Employer</Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={() => navigate('/manage-profile')}>
              Edit Profile
            </Button>
          </UserProfile>
        </RightSide>
      </PageContainer>

      {/* Modal for Adding New Job */}
      <JobFormModal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', width: '400px' }}>
          <Typography variant="h6" gutterBottom>
            Add New Job
          </Typography>
          <TextField
            label="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Company"
            value={newJob.company}
            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" fullWidth sx={{ marginTop: '1rem' }} onClick={handleAddJob}>
            Add Job
          </Button>
        </Box>
      </JobFormModal>

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

export default PostJobsPage;
