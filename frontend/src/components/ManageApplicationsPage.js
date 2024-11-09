/*import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import { db, auth } from '../firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import EmployerNavBar from './EmployerNavBar';

const PageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2rem',
  maxWidth: '1200px',
  margin: 'auto',
});

const Sidebar = styled(Box)({
  width: '30%',
  padding: '1rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
});

const MainSection = styled(Box)({
  width: '65%',
  padding: '1rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
});

const ApplicationDetails = styled(Box)({
  marginTop: '1rem',
  padding: '1rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
});

const ManageApplicationsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const user = auth.currentUser;
      if (user) {
        const jobsQuery = query(collection(db, 'jobs'), where('employerId', '==', user.uid));
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobsData = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsData);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const fetchApplications = async (jobId) => {
    setLoading(true);
    const applicationsQuery = query(collection(db, 'jobApplications'), where('jobId', '==', jobId));
    const applicationsSnapshot = await getDocs(applicationsQuery);
    const applicationsData = applicationsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setApplications(applicationsData);
    setLoading(false);
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setSelectedApplication(null);
    fetchApplications(job.id);
  };

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'jobApplications', applicationId), { status: newStatus });
      setApplications((prevApplications) =>
        prevApplications.map((app) => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <div>
      <EmployerNavBar activePage="Manage Applications" />
      <PageContainer>
        <Sidebar>
          <Typography variant="h6" gutterBottom id="jobs-header">Jobs</Typography>
          {loading ? (
            <CircularProgress aria-label="Loading jobs" aria-live="assertive" />
          ) : (
            <List aria-labelledby="jobs-header">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <ListItem button key={job.id} onClick={() => handleJobSelect(job)} aria-label={`Job: ${job.title}`}>
                    <ListItemText primary={job.title} secondary={job.location} />
                  </ListItem>
                ))
              ) : (
                <Typography>No jobs found.</Typography>
              )}
            </List>
          )}
        </Sidebar>

        <MainSection>
          {selectedJob ? (
            <>
              <Typography variant="h5" gutterBottom id="applications-header">{selectedJob.title}</Typography>
              <Typography variant="subtitle1" gutterBottom>{selectedJob.location}</Typography>
              <Typography variant="h6" marginTop="1rem" aria-live="polite">Applications</Typography>
              {loading ? (
                <CircularProgress aria-label="Loading applications" aria-live="assertive" />
              ) : applications.length > 0 ? (
                <List aria-labelledby="applications-header">
                  {applications.map((application) => (
                    <ListItem key={application.id} button onClick={() => handleApplicationSelect(application)} aria-label={`Application from ${application.firstName} ${application.lastName}`}>
                      <ListItemText
                        primary={`${application.firstName} ${application.lastName}`}
                        secondary={`Status: ${application.status || 'Pending'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No applications for this job.</Typography>
              )}

              {selectedApplication && (
                <ApplicationDetails aria-labelledby="application-details-header">
                  <Typography id="application-details-header" variant="h6">Application Details</Typography>
                  <Typography variant="body1"><strong>Name:</strong> {`${selectedApplication.firstName} ${selectedApplication.lastName}`}</Typography>
                  <Typography variant="body1"><strong>Email:</strong> {selectedApplication.email}</Typography>
                  <Typography variant="body1"><strong>Phone:</strong> {selectedApplication.phone}</Typography>
                  <Typography variant="h6" marginTop="1rem">Resume & Cover Letter</Typography>
                  <Button variant="outlined" href={selectedApplication.resumeURL} target="_blank" sx={{ marginTop: '0.5rem', marginRight: '1rem' }} aria-label="View Resume">View Resume</Button>
                  <Button variant="outlined" href={selectedApplication.coverLetterURL} target="_blank" sx={{ marginTop: '0.5rem' }} aria-label="View Cover Letter">View Cover Letter</Button>
                  <Typography variant="h6" marginTop="1rem">Application Status</Typography>
                  <Select
                    value={selectedApplication.status || 'Pending'}
                    onChange={(e) => handleStatusChange(selectedApplication.id, e.target.value)}
                    fullWidth
                    sx={{ marginTop: '0.5rem' }}
                    aria-label="Application Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Reviewed">Reviewed</MenuItem>
                    <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </ApplicationDetails>
              )}
            </>
          ) : (
            <Typography variant="body1">Select a job to view applications.</Typography>
          )}
        </MainSection>
      </PageContainer>
    </div>
  );
};

export default ManageApplicationsPage;
*/

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust the path to your Firebase config
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import EmployerNavBar from './EmployerNavBar';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications from Firebase Firestore
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsCollection = collection(db, 'jobApplications');
        const querySnapshot = await getDocs(applicationsCollection);
        
        const applicationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setApplications(applicationsData);
      } catch (error) {
        console.error("Error fetching applications: ", error);
      }
    };

    fetchApplications();
  }, []);

  // Function to handle selection of an application
  const selectApplication = (application) => {
    setSelectedApplication(application);
  };

  // Function to update application status in Firestore
  const updateStatus = async (newStatus) => {
    if (selectedApplication) {
      const applicationRef = doc(db, 'jobApplications', selectedApplication.id);
      try {
        await updateDoc(applicationRef, { status: newStatus });
        
        // Update the local state to reflect the change
        setSelectedApplication({ ...selectedApplication, status: newStatus });
        setApplications(applications.map(app => 
          app.id === selectedApplication.id ? { ...app, status: newStatus } : app
        ));
      } catch (error) {
        console.error("Error updating status: ", error);
      }
    }
  };

  return (
    <div className="manage-applications-page">
      <EmployerNavBar activePage={'Manage Applications'}/>

      <div className="applications-container" style={{ display: 'flex', padding: '20px' }}>
        {/* Left Section: Application List */}
        <div className="application-list" style={{ width: '30%', marginRight: '20px', border: '1px solid #ddd', padding: '10px', overflowY: 'scroll', height: '80vh' }}>
          <h3>Applications</h3>
          {applications.map((app) => (
            <div key={app.id} onClick={() => selectApplication(app)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
              <h4>{app.firstName} {app.lastName}</h4>
              <p>Job Title: {app.jobTitle}</p>
              <p>Date: {new Date(app.date).toLocaleDateString()}</p>
              <p>Status: {app.status || 'Pending'}</p>
            </div>
          ))}
        </div>

        {/* Right Section: Application Details */}
        <div className="application-details" style={{ width: '70%', border: '1px solid #ddd', padding: '10px' }}>
          {selectedApplication ? (
            <>
              <h3>Application Details</h3>
              <p><strong>Name:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</p>
              <p><strong>Job Title:</strong> {selectedApplication.jobTitle}</p>
              <p><strong>Date Applied:</strong> {new Date(selectedApplication.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selectedApplication.status || 'Pending'}</p>
              <p><strong>Address:</strong> {selectedApplication.address}</p>
              <p><strong>Company:</strong> {selectedApplication.company}</p>
              <p><strong>Country:</strong> {selectedApplication.country}</p>
              
              {/* Action Buttons for Status Update */}
              <div style={{ marginTop: '20px' }}>
                <button onClick={() => updateStatus('Reviewed')}>Mark as Reviewed</button>
                <button onClick={() => updateStatus('Accepted')} style={{ marginLeft: '10px' }}>Accept</button>
                <button onClick={() => updateStatus('Rejected')} style={{ marginLeft: '10px' }}>Reject</button>
              </div>
            </>
          ) : (
            <p>Select an application to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
