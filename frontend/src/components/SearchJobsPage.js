import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography, Box, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { auth, db } from '../firebase'; // Import auth and db
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions
import UserNavBar from './UserNavBar';

const generateJobs = (jobTitle, location) => {
  const mockCompanies = [
    { name: 'Tech Corp', logo: 'https://via.placeholder.com/50?text=Tech+Corp' },
    { name: 'InnovateX', logo: 'https://via.placeholder.com/50?text=InnovateX' },
    { name: 'Data Insights', logo: 'https://via.placeholder.com/50?text=Data+Insights' },
    { name: 'Cloud Solutions', logo: 'https://via.placeholder.com/50?text=Cloud+Solutions' },
    { name: 'NextGen Systems', logo: 'https://via.placeholder.com/50?text=NextGen+Systems' },
  ];
  const jobCount = 10;
  const jobs = [];

  for (let i = 1; i <= jobCount; i++) {
    const company = mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
    jobs.push({
      id: i,
      title: `${jobTitle} ${i}`,
      company: company.name,
      logo: company.logo,
      location: location,
      description: `This is a ${jobTitle} position at ${company.name} in ${location}. The role involves key responsibilities related to ${jobTitle}, including software development, testing, and deployment. Skills required: JavaScript, React, Node.js, Python.`,
    });
  }

  return jobs;
};

const PageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2rem',
  maxWidth: '1200px',
  margin: 'auto',
});

const BoxContainer = styled(Box)(({ highContrast }) => ({
  padding: '1rem',
  backgroundColor: highContrast ? '#000' : '#ffffff',
  color: highContrast ? '#fff' : '#000',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  margin: '1rem',
  overflowY: 'auto',
  maxHeight: '75vh',
}));

const LeftSide = styled(BoxContainer)({
  width: '30%',
});

const JobTitleBar = styled(Box)(({ highContrast }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  backgroundColor: highContrast ? '#333' : '#f0f4f8',
  borderBottom: '1px solid #ddd',
}));

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

const ApplyButton = styled(Button)(({ highContrast }) => ({
  backgroundColor: highContrast ? '#FFD700' : '#007bff',
  color: highContrast ? '#000' : '#fff',
  marginTop: '1rem',
  '&:hover': {
    backgroundColor: highContrast ? '#FFC107' : '#0056b3',
  },
}));

const UserProfile = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '2rem',
});

const SkillBox = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '10px',
});

const SkillItem = styled(Box)(({ highContrast }) => ({
  padding: '0.5rem 1rem',
  backgroundColor: highContrast ? '#FFD700' : '#007bff',
  color: highContrast ? '#000' : '#fff',
  borderRadius: '20px',
  fontSize: '0.9rem',
}));

const CenteredButton = styled(Button)(({ highContrast, fontSize }) => ({
  display: 'block',
  margin: '1.5rem auto',
  backgroundColor: highContrast ? '#FFD700' : '#007bff',
  color: highContrast ? '#000' : '#fff',
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

const SearchJobsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobTitle, location: loc } = location.state || { jobTitle: '', location: '' };

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobs, setShowJobs] = useState(true);
  const [userName, setUserName] = useState('');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const [userRole] = useState(localStorage.getItem('userRole') || 'Job Seeker');
  const [userSkills] = useState(JSON.parse(localStorage.getItem('userSkills')) || ['JavaScript', 'React', 'Node.js']);

  useEffect(() => {
    const generatedJobs = generateJobs(jobTitle || 'Software Engineer', loc || 'New York, NY');
    setJobs(generatedJobs);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const { firstName, lastName } = userDoc.data();
          setUserName(`${firstName} ${lastName}`);
        }
      }
    });

    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('fontSize'), 10) || 16;
    setHighContrast(savedHighContrast);
    setFontSize(savedFontSize);

    return () => unsubscribe();
  }, [jobTitle, loc]);

  useEffect(() => {
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('fontSize', fontSize);
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => setHighContrast(!highContrast);
  const increaseFontSize = () => setFontSize((prevSize) => Math.min(prevSize + 2, 24));
  const decreaseFontSize = () => setFontSize((prevSize) => Math.max(prevSize - 2, 12));

  const handleJobSelect = (job) => setSelectedJob(job);

  return (
    <div style={{ fontSize: `${fontSize}px` }}>
      <UserNavBar activePage="Search Jobs" />

      <PageContainer aria-label="Search Jobs Page">
        <LeftSide highContrast={highContrast} aria-label="Job Listings">
          <JobTitleBar highContrast={highContrast} onClick={() => setShowJobs(!showJobs)} aria-label="Job Lists Toggle">
            <Typography variant="h6">Job Lists</Typography>
            <ArrowDropDownIcon style={{ transform: showJobs ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </JobTitleBar>

          {showJobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <JobItem key={job.id} onClick={() => handleJobSelect(job)} aria-label={`Job at ${job.company} for ${job.title}`}>
                <JobLogo src={job.logo} alt={`${job.company} Logo`} />
                <Box>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2">{job.company}</Typography>
                  <Typography variant="body2">{job.location}</Typography>
                </Box>
              </JobItem>
            ))
          ) : showJobs ? (
            <Typography variant="body1">No jobs found for your criteria.</Typography>
          ) : null}
        </LeftSide>

        <CenterSection highContrast={highContrast} aria-label="Job Description">
          {selectedJob ? (
            <>
              <Typography variant="h5">{selectedJob.title}</Typography>
              <Typography variant="subtitle1">{selectedJob.company}</Typography>
              <Typography variant="subtitle2">{selectedJob.location}</Typography>
              <Typography variant="h6" marginTop="1rem">Description</Typography>
              <Typography variant="body1" marginTop="0.5rem">
                {selectedJob.description}
              </Typography>
              <ApplyButton highContrast={highContrast} data-command="Apply for the Job" onClick={() => navigate('/job-application')} aria-label="Apply for the Job">
                Apply for the Job
              </ApplyButton>
            </>
          ) : (
            <Typography variant="body1">Select a job to see the details</Typography>
          )}
        </CenterSection>

        <RightSide highContrast={highContrast} aria-label="User Profile and Skills">
          <UserProfile aria-label="User Profile">
            <Avatar alt="User" src="https://via.placeholder.com/150" sx={{ width: 100, height: 100 }} />
            <Typography variant="h6" sx={{ textAlign: 'center' }}>{userName}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>{userRole}</Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: '1rem' }} data-command="Edit Profile" onClick={() => navigate('/manage-profile')} aria-label="Edit Profile">
              Edit Profile
            </Button>
          </UserProfile>

          <Box aria-label="User Skills">
            <Typography variant="h6">Skills</Typography>
            <SkillBox>
              {userSkills.map((skill, index) => (
                <SkillItem highContrast={highContrast} key={index} aria-label={`Skill: ${skill}`}>
                  {skill}
                </SkillItem>
              ))}
            </SkillBox>
            <CenteredButton highContrast={highContrast} data-command="View Profile" onClick={() => navigate('/manage-profile')} aria-label="View Profile">
              View Profile
            </CenteredButton>
          </Box>
        </RightSide>
      </PageContainer>

      <AccessibilityBar aria-label="Accessibility Options">
        <Button variant="contained" data-command="Toggle" onClick={toggleHighContrast} sx={{ marginRight: '1rem' }} aria-label="Toggle High Contrast">
          Toggle High Contrast
        </Button>
        <Button variant="contained" data-command="Increase Font Size" onClick={increaseFontSize} sx={{ marginRight: '1rem' }} aria-label="Increase Font Size">
          Increase Font Size
        </Button>
        <Button variant="contained" data-command="Decrease Font Size" onClick={decreaseFontSize} aria-label="Decrease Font Size">
          Decrease Font Size
        </Button>
      </AccessibilityBar>
    </div>
  );
};

export default SearchJobsPage;
