// src/components/SkillAssessmentResult.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserNavBar from './UserNavBar';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const ResultContainer = styled(Container)({
  padding: '2rem',
  maxWidth: 'md',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  marginTop: '2rem',
});

const SkillAssessmentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, total = 0, skillCategory = 'N/A' } = location.state || {};

  useEffect(() => {
    const saveAssessmentResult = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const assessmentRef = doc(db, 'skillAssessments', `${user.uid}_${skillCategory}_${Date.now()}`);
      
      try {
        await setDoc(assessmentRef, {
          userId: user.uid,
          skillCategory,
          score,
          totalQuestions: total,
          timestamp: new Date(),
        });
        console.log('Assessment saved successfully');
      } catch (error) {
        console.error('Error saving assessment:', error);
      }
    };

    saveAssessmentResult();
  }, [score, total, skillCategory]);

  return (
    <div>
      <UserNavBar activePage="Skill Assessment" />
      <ResultContainer>
        <Typography variant="h4" gutterBottom>Assessment Complete!</Typography>
        <Typography variant="h6" gutterBottom>Skill Category: {skillCategory}</Typography>
        <Typography variant="h3" color="primary" gutterBottom>
          Score: {score} / {total}
        </Typography>
        <Typography variant="body1">
          Well done! You completed the {total}-question assessment in {skillCategory}. Keep practicing to improve!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/skills-assessments')}
          sx={{ marginTop: '1.5rem' }}
          data-command="Back to Dashboard"
        >
          Back to Dashboard
        </Button>
      </ResultContainer>
    </div>
  );
};

export default SkillAssessmentResult;
