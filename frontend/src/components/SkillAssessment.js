// src/components/SkillAssessment.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { Container, Typography, Button, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { styled } from '@mui/material/styles';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import UserNavBar from './UserNavBar';


const AssessmentContainer = styled(Container)({
  padding: '2rem',
  maxWidth: 'md',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  marginTop: '2rem',
});


const SkillAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { skillCategory = 'JavaScript' } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(`${data.firstName || 'Anonymous'} ${data.lastName || ''}`);
        }
      }
    };

    const fetchQuestions = async () => {
      try {
        const q = query(
          collection(db, 'skillQuestions'),
          where('skillCategory', '==', skillCategory)
        );
        const querySnapshot = await getDocs(q);
        const fetchedQuestions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchQuestions();
  }, [skillCategory]);

  const handleOptionChange = (e) => setSelectedOption(e.target.value);

  const handleSubmit = async () => {
    const isCorrectAnswer = questions[currentQuestion]?.correctAnswer === selectedOption;
    if (isCorrectAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedOption('');

    if (currentQuestion === questions.length - 1) {
      // Save result to Firestore
      const user = auth.currentUser;
      if (user) {
        const assessmentRef = doc(
          db,
          'skillAssessments',
          `${user.uid}_${skillCategory}_${Date.now()}`
        );
        
        await setDoc(assessmentRef, {
          userId: user.uid,
          username: username,  // Include the username here
          skillCategory: skillCategory,
          score: isCorrectAnswer ? score + 1 : score,
          totalQuestions: questions.length,
          timestamp: new Date(),
        });
      }

      navigate('/skills-assessments-result', { 
        state: { 
          score: isCorrectAnswer ? score + 1 : score, 
          total: questions.length,
          skillCategory,
          username
        } 
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div>
      <UserNavBar activePage="Skill Assessment" />
      <AssessmentContainer>
        <Typography variant="h4" gutterBottom>{skillCategory} Assessment</Typography>
        
        {loading ? (
          <Typography>Loading questions...</Typography>
        ) : (
          questions[currentQuestion] && (
            <>
              <Typography variant="h6">{questions[currentQuestion].question}</Typography>
              
              <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                {questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!selectedOption}
                sx={{ marginTop: '1.5rem' }}
              >
                {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </>
          )
        )}
      </AssessmentContainer>
    </div>
  );
};

export default SkillAssessment;
