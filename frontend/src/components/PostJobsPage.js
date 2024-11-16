import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Avatar, IconButton, TextField, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { db } from '../firebase';
import { doc, collection, addDoc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import EmployerNavBar from './EmployerNavBar';

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
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [employerInfo, setEmployerInfo] = useState({
    companyName: '',
    role: '',
  });
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

    // Fetch employer info from local storage
    const savedCompanyName = localStorage.getItem('topSectionData')
      ? JSON.parse(localStorage.getItem('topSectionData')).companyName
      : '';
    const savedRole = localStorage.getItem('topSectionData')
      ? JSON.parse(localStorage.getItem('topSectionData')).role
      : '';

    setEmployerInfo({
      companyName: savedCompanyName,
      role: savedRole,
    });

    // Fetch jobs from Firestore
    const fetchJobs = async () => {
      const jobsSnapshot = await getDocs(collection(db, 'jobs'));
      const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    };

    fetchJobs();
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
    <div style={{ fontSize: `${fontSize}px` }} lang="en">
      <EmployerNavBar activePage="Post Jobs" />

      <PageContainer>
        <LeftSide>
          <JobTitleBar>
            <Typography variant="h6">Jobs</Typography>
            <IconButton onClick={() => setOpenModal(true)} aria-label="Add a new job">
              <AddIcon />
            </IconButton>
          </JobTitleBar>

          {jobs.map((job) => (
            <JobItem
              key={job.id}
              onClick={() => handleJobSelect(job)}
              aria-label={`Select job titled ${job.title}`}
            >
              <JobLogo src="https://via.placeholder.com/50" alt={`${job.company} logo`} />
              <Box>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2">{job.company}</Typography>
                <Typography variant="body2">{job.location}</Typography>
              </Box>
              <IconButton onClick={() => handleDeleteJob(job)} aria-label={`Delete job titled ${job.title}`}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => handleJobSelect(job)} aria-label={`Edit job titled ${job.title}`}>
                <EditIcon />
              </IconButton>
            </JobItem>
          ))}
        </LeftSide>

        <CenterSection>
          {selectedJob ? (
            <>
              <Typography variant="h5">{selectedJob.title}</Typography>
              <Typography variant="subtitle1">{selectedJob.company}</Typography>
              <Typography variant="subtitle2">{selectedJob.location}</Typography>
              <Typography variant="h6" marginTop="1rem">Description</Typography>
              <Typography variant="body1" marginTop="0.5rem">{selectedJob.description}</Typography>
              <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={() => handleUpdateJob(selectedJob)} aria-label="Update job">
                Update Job
              </Button>
            </>
          ) : (
            <Typography variant="body1">Select a job to see the details</Typography>
          )}
        </CenterSection>

        <RightSide>
          <UserProfile>
            <Avatar alt="Employer" src="https://via.placeholder.com/150" sx={{ width: 100, height: 100 }} />
            <Typography variant="h6" sx={{ textAlign: 'center' }}>{employerInfo.companyName}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>{employerInfo.role}</Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} onClick={() => navigate('/employer-manage-profile')} aria-label="Edit profile">
              Edit Profile
            </Button>
          </UserProfile>
        </RightSide>
      </PageContainer>

      <JobFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="add-job-modal-title"
        aria-describedby="add-job-modal-description"
      >
        <Box sx={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: 24 }}>
          <Typography id="add-job-modal-title" variant="h6">Add New Job</Typography>
          <TextField
            label="Job Title"
            fullWidth
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Company Name"
            fullWidth
            value={newJob.company}
            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Location"
            fullWidth
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            sx={{ marginBottom: '1rem' }}
          />
          <TextField
            label="Job Description"
            fullWidth
            multiline
            rows={4}
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            sx={{ marginBottom: '1rem' }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleAddJob} aria-label="Add job">Add Job</Button>
        </Box>
      </JobFormModal>

      {/* Accessibility Bar */}
      <AccessibilityBar>
        <Button onClick={toggleHighContrast} sx={{ margin: '0 1rem' }} aria-label="Toggle high contrast mode">
          High Contrast {highContrast ? 'On' : 'Off'}
        </Button>
        <Button onClick={increaseFontSize} sx={{ margin: '0 1rem' }} aria-label="Increase font size">
          Increase Font Size
        </Button>
        <Button onClick={decreaseFontSize} sx={{ margin: '0 1rem' }} aria-label="Decrease font size">
          Decrease Font Size
        </Button>
      </AccessibilityBar>
    </div>
  );
};

export default PostJobsPage;
