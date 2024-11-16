import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Box, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmployerNavBar from './EmployerNavBar';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled(Container)(({ theme }) => ({
  padding: '2rem',
  maxWidth: 'md',
  textAlign: 'center',
  marginTop: '1rem',
}));

const EmployerSkillAssessmentDashboard = () => {
  const [skillCategories] = useState(['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory) {
      fetchUserResults(selectedCategory);
    } else {
      setUserResults([]); // Clear results when no category is selected
    }
  }, [selectedCategory]);

  const fetchUserResults = async (category) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'skillAssessments'),
        where('skillCategory', '==', category)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserResults(results);
    } catch (error) {
      console.error("Error fetching user results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageQuestionsClick = () => {
    navigate('/manage-questions');
  };

  return (
    <div dir="ltr"> {/* Adding the dir attribute for left-to-right text direction */}
      {/* Skip to content link for keyboard users */}
      <a href="#content" style={{ position: 'absolute', top: '-40px', left: '-40px', zIndex: -1 }}></a>

      <EmployerNavBar activePage="Skill Assessment" />
      
      <DashboardContainer id="content">
        <Typography variant="h4" gutterBottom>Employer Skill Assessment Dashboard</Typography>

        <Typography variant="h6" gutterBottom id="category-select-label">Choose a Skill Category</Typography>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ marginBottom: '1rem' }}
          aria-labelledby="category-select-label"
        >
          <MenuItem value="" disabled>Select a Category</MenuItem>
          {skillCategories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </Select>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleManageQuestionsClick}
          sx={{ marginTop: '1rem', marginBottom: '2rem' }}
          data-command="Manage Questions"
          aria-label="Manage questions for selected skill category"
        >
          Manage Questions
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <CircularProgress aria-label="Loading user assessment results" aria-live="assertive" />
          </Box>
        ) : (
          <>
            {userResults.length > 0 ? (
              <Box sx={{ marginTop: '2rem' }}>
                <Typography variant="h6" gutterBottom>User Assessment Results</Typography>
                <Table aria-label="User assessment results">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Total Questions</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.username || 'Anonymous'}</TableCell>
                        <TableCell>{result.score}</TableCell>
                        <TableCell>{result.totalQuestions}</TableCell>
                        <TableCell>{new Date(result.timestamp?.seconds * 1000).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Typography aria-live="polite">No user results found for this category.</Typography>
            )}
          </>
        )}
      </DashboardContainer>
    </div>
  );
};

export default EmployerSkillAssessmentDashboard;
