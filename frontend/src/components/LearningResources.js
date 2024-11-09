// src/components/LearningResources.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Box, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import UserNavBar from './UserNavBar';

const LearningResources = () => {
  const [category, setCategory] = useState('');
  const [resources, setResources] = useState([]);
  const [categories] = useState(['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch resources based on the selected category
  const fetchResources = async (selectedCategory) => {
    setLoading(true);
    setError(null);
    setResources([]);
    
    if (selectedCategory) {
      try {
        const q = query(collection(db, 'learningResources'), where('category', '==', selectedCategory));
        const querySnapshot = await getDocs(q);
        const resourcesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResources(resourcesData);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("An error occurred while fetching resources. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Trigger fetching resources when the category changes
  useEffect(() => {
    fetchResources(category);
  }, [category]);

  return (
    <div>
      <UserNavBar activePage="Learning Resources" />
      <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>Learning Resources</Typography>
        <Typography variant="h6">Choose a Learning Category</Typography>
        
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          sx={{ margin: '1rem 0' }}
          aria-label="Select a learning category"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : resources.length > 0 ? (
            <List sx={{ width: '100%', maxWidth: 600, textAlign: 'left' }}>
              {resources.map((resource) => (
                <ListItem key={resource.id} divider>
                  <ListItemText
                    primary={<Typography variant="h6" align="center">{resource.title}</Typography>}
                    secondary={
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {resource.description}
                        </Typography>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          {resource.url}
                        </a>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No resources found for this category.</Typography>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default LearningResources;
