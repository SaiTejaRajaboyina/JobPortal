import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust path as needed
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import EmployerNavBar from './EmployerNavBar';

const ShortlistedCandidates = () => {
  const [candidates, setCandidates] = useState([]);

  // Function to send interview link
  const sendInterviewLink = async (candidate) => {
    const interviewLink = `https://example.com/schedule/${candidate.id}`;
    
    try {
      const candidateRef = doc(db, 'jobApplications', candidate.id);
      await updateDoc(candidateRef, { interviewLink });
      alert(`Interview link sent to ${candidate.firstName} ${candidate.lastName}`);
    } catch (error) {
      console.error("Error sending interview link: ", error);
    }
  };

  // Fetch shortlisted candidates from Firestore
  useEffect(() => {
    const fetchShortlistedCandidates = async () => {
      try {
        const candidatesCollection = collection(db, 'jobApplications');
        const q = query(candidatesCollection, where('status', '==', 'Accepted')); // Adjust status based on your criteria
        const querySnapshot = await getDocs(q);
        
        const shortlistedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCandidates(shortlistedData);
      } catch (error) {
        console.error("Error fetching shortlisted candidates: ", error);
      }
    };

    fetchShortlistedCandidates();
  }, []);

  return (
    <div className="shortlisted-candidates-page">
      <EmployerNavBar activePage={'Shortlisted Candidates'}/>

      <div className="candidates-container" style={{ padding: '20px' }}>
        <h3>Shortlisted Candidates</h3>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <p><strong>Name:</strong> {candidate.firstName} {candidate.lastName}</p>
              <p><strong>Job Title:</strong> {candidate.jobTitle}</p>
              <p><strong>Email:</strong> {candidate.email}</p>
              <button onClick={() => sendInterviewLink(candidate)}>Send Interview Link</button>
            </div>
          ))
        ) : (
          <p>No shortlisted candidates available.</p>
        )}
      </div>
    </div>
  );
};

export default ShortlistedCandidates;
