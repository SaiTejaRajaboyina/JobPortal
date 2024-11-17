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

  // New function for handling select change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateStatus(newStatus); // Call the updateStatus function with the new status
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
                {/* Label element surrounding the select input */}
                <label for="application-status">
                  <span>Application Status</span> {/* Visible label text */}
                </label>
                <select
                  id="application-status"  // The id for matching the label's for attribute
                  value={selectedApplication.status || 'Pending'}
                  onChange={handleStatusChange} // Use the new function here
                  aria-label="Change application status"  // Added aria-label for accessibility
                  title="Change the application status"  // Added title for additional context
                  style={{ display: 'block', width: '100%', marginTop: '1rem' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <div style={{ marginTop: '20px' }}>
                  <button onClick={() => updateStatus('Reviewed')}>Mark as Reviewed</button>
                  <button onClick={() => updateStatus('Accepted')} style={{ marginLeft: '10px' }}>Accept</button>
                  <button onClick={() => updateStatus('Rejected')} style={{ marginLeft: '10px' }}>Reject</button>
                </div>
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
