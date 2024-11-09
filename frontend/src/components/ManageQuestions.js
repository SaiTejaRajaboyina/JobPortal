import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import EmployerNavBar from './EmployerNavBar';

const skillCategories = ['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'HTML'];

const ManageQuestions = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, questionId: null });

  // Fetch questions from Firestore based on the selected skill category
  useEffect(() => {
    if (selectedCategory) {
      const q = query(
        collection(db, 'skillQuestions'),
        where('skillCategory', '==', selectedCategory)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedQuestions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(fetchedQuestions);
      });
      return unsubscribe;
    }
  }, [selectedCategory]);

  const handleAddQuestion = async () => {
    if (newQuestion && options.every(opt => opt) && correctAnswer && selectedCategory) {
      try {
        await addDoc(collection(db, 'skillQuestions'), {
          skillCategory: selectedCategory,
          question: newQuestion,
          options,
          correctAnswer,
        });
        setNewQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
        setFeedback({ open: true, message: 'Question added successfully!', severity: 'success' });
      } catch (error) {
        setFeedback({ open: true, message: 'Error adding question', severity: 'error' });
      }
    } else {
      setFeedback({ open: true, message: 'Please complete all fields', severity: 'warning' });
    }
  };

  const handleDeleteQuestion = async () => {
    if (confirmDelete.questionId) {
      try {
        await deleteDoc(doc(db, 'skillQuestions', confirmDelete.questionId));
        setFeedback({ open: true, message: 'Question deleted successfully!', severity: 'success' });
      } catch (error) {
        setFeedback({ open: true, message: 'Error deleting question', severity: 'error' });
      }
    }
    setConfirmDelete({ open: false, questionId: null });
  };

  return (
    <div>
      <EmployerNavBar activePage="Skill Assessment" />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>Manage Questions</Typography>
        
        <Typography variant="h6" gutterBottom>Choose a Skill Category</Typography>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ marginBottom: '1rem' }}
          aria-label="Skill category selection"
        >
          <MenuItem value="" disabled>Select a Category</MenuItem>
          {skillCategories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </Select>

        {selectedCategory && (
          <>
            <TableContainer component={Paper} style={{ marginTop: '1rem' }} aria-label="Questions table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Options</TableCell>
                    <TableCell>Correct Answer</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map(({ id, question, options, correctAnswer }) => (
                    <TableRow key={id}>
                      <TableCell>{question}</TableCell>
                      <TableCell>{options.join(', ')}</TableCell>
                      <TableCell>{correctAnswer}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => setConfirmDelete({ open: true, questionId: id })} aria-label="Delete question">
                          <Delete />
                        </IconButton>
                        <IconButton aria-label="Edit question">
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" style={{ marginTop: '2rem' }}>Add New Question</Typography>
            
            <TextField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              margin="normal"
              aria-label="New question"
            />

            {options.map((option, index) => (
              <TextField
                key={index}
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                fullWidth
                margin="normal"
                aria-label={`Option ${index + 1}`}
              />
            ))}

            <TextField
              label="Correct Answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              fullWidth
              margin="normal"
              aria-label="Correct answer"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddQuestion}
              style={{ marginTop: '1rem' }}
              disabled={!selectedCategory}
              data-command="Add Question"
              aria-label="Add question"
            >
              Add Question
            </Button>
          </>
        )}

        {/* Feedback Snackbar */}
        <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback({ ...feedback, open: false })}>
          <Alert onClose={() => setFeedback({ ...feedback, open: false })} severity={feedback.severity} sx={{ width: '100%' }}>
            {feedback.message}
          </Alert>
        </Snackbar>

        {/* Confirm Delete Dialog */}
        <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, questionId: null })}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this question?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete({ open: false, questionId: null })}>Cancel</Button>
            <Button onClick={handleDeleteQuestion} color="primary">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ManageQuestions;
