// src/components/LearningResources.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Select, MenuItem, Box, List, ListItem, ListItemText, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import UserNavBar from './UserNavBar';

const LearningResources = () => {
  const [category, setCategory] = useState('');
  const [resources, setResources] = useState([]);
  const [categories] = useState(['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  // Open confirmation dialog before making any category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setOpenDialog(true); // Show confirmation dialog
  };

  const handleDialogClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed) {
      fetchResources(category); // Fetch resources after user confirms
    }
  };

  // Trigger fetching resources when the category changes
  useEffect(() => {
    if (category) {
      fetchResources(category);
    }
  }, [category]);

  return (
    <div>
      <UserNavBar activePage="Learning Resources" />
      <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>Learning Resources</Typography>
        <Typography variant="h6">Choose a Learning Category</Typography>

        <label for="category-select" style={{ display: 'block', textAlign: 'center', marginBottom: '0.5rem' }}>
          <Typography variant="body1">Select a category to explore learning resources:</Typography>
          <Select
            id="category-select"
            value={category}
            onChange={handleCategoryChange}
            fullWidth
            sx={{ margin: '1rem 0' }}
            aria-label="Select a learning category"
            title="Choose your category from the dropdown"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </label>

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

        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirm Category Change</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to switch to the selected category? This will load new learning resources.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(false)} color="primary">Cancel</Button>
            <Button onClick={() => handleDialogClose(true)} color="primary">Confirm</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default LearningResources;
