import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import UserLogin from './components/UserLogin';
import UserRegister from './components/UserRegister';
import EmployerLogin from './components/EmployerLogin';
import EmployerRegister from './components/EmployerRegister';
import UserResetPassword from './components/UserResetPassword';
import EmployerResetPassword from './components/EmployerResetPassword';
import UserHomePage from './components/UserHomePage';
import SearchJobsInputPage from './components/SearchJobsInputPage';
import SearchJobsPage from './components/SearchJobsPage'; 
import JobApplicationPage from './components/JobApplicationPage';
import JobAppliedSuccessfully from './components/JobAppliedSuccessfully';
import ManageProfilePage from './components/ManageProfilePage';
import EmployerHomePage from './components/EmployerHomePage';
import PostJobsPage from './components/PostJobsPage';
import { AccessibilityProvider } from './components/AccessibilityProvider'; // Import AccessibilityProvider

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <Routes>
          {/* Role Selection */}
          <Route path="/" element={<RoleSelection />} />
          
          {/* User Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/reset-password" element={<UserResetPassword />} />
          <Route path="/home" element={<UserHomePage />} />
          
          {/* Employer Routes */}
          <Route path="/employer-login" element={<EmployerLogin />} />
          <Route path="/employer-register" element={<EmployerRegister />} />
          <Route path="/employer-reset-password" element={<EmployerResetPassword />} />

          {/* Search Jobs Input Page */}
          <Route path="/search-jobs-input" element={<SearchJobsInputPage />} />
          
          {/* Search Jobs Page */}
          <Route path="/search-jobs" element={<SearchJobsPage />} /> 

          {/* Route for Job Application Page */}
          <Route path="/job-application" element={<JobApplicationPage />} />
          <Route path="/job-applied-successfully" element={<JobAppliedSuccessfully />} />

          {/* Manage Profile Page */}
          <Route path="/manage-profile" element={<ManageProfilePage />} />

          {/* Route for Employer Home Page */}
          <Route path="/employer-home" element={<EmployerHomePage />} />

          {/* Route for the Post Jobs */}
          <Route path="/posting-jobs" element={<PostJobsPage />} />
        </Routes>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;
