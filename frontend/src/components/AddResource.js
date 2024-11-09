import React, { useState } from 'react';
import { Container, TextField, Button, Typography, MenuItem, Select, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import EmployerNavBar from './EmployerNavBar';

const FormContainer = styled(Container)({
  padding: '2rem',
  maxWidth: 'sm',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  marginTop: '2rem',
});

const AddResource = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });

  const categories = ['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML'];

  const handleAddResource = async () => {
    if (!isValidURL(url)) {
      setFeedback({ open: true, message: 'Please enter a valid URL.', severity: 'warning' });
      return;
    }

    try {
      await addDoc(collection(db, 'learningResources'), {
        category,
        title,
        url,
        description,
      });
      setFeedback({ open: true, message: 'Resource added successfully!', severity: 'success' });
      setCategory('');
      setTitle('');
      setUrl('');
      setDescription('');
    } catch (error) {
      console.error('Error adding resource:', error);
      setFeedback({ open: true, message: 'Failed to add resource.', severity: 'error' });
    }
  };

  const isValidURL = (url) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
    );
    return !!pattern.test(url);
  };

  return (
    <div>
      <EmployerNavBar activePage="Learning Resources" />
      <FormContainer>
        <Typography variant="h4" gutterBottom>Add Learning Resource</Typography>

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ marginBottom: '1rem' }}
          aria-label="Select Category"
        >
          <MenuItem value="" disabled>Select Category</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ marginBottom: '1rem' }}
          aria-label="Resource Title"
        />
        <TextField
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          sx={{ marginBottom: '1rem' }}
          aria-label="Resource URL"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: '1rem' }}
          aria-label="Resource Description"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddResource}
          disabled={!category || !title || !url || !description}
          data-command="Add Resource"
          aria-label="Add Resource"
        >
          Add Resource
        </Button>
      </FormContainer>

      {/* Snackbar for feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setFeedback({ ...feedback, open: false })} severity={feedback.severity}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddResource;
