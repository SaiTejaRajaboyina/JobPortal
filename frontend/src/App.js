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
import SkillAssessmentDashboard from './components/SkillAssessmentDashboard';
import SkillAssessment from './components/SkillAssessment';
import SkillAssessmentResults from './components/SkillAssessmentResults';
import LearningResources from './components/LearningResources';
import EmployerLearningResourceDashboard from './components/EmployerLearningResourceDashboard';
import AddResource from './components/AddResource';
import EmployerSkillAssessmentDashboard from './components/EmployerSkillAssessmentDashboard';
import ManageQuestions from './components/ManageQuestions';
import EmployerManageProfilePage from './components/EmployerManageProfilePage';
import ManageApplicationsPage from './components/ManageApplicationsPage';
import ShortlistedCandidates from './components/ShortlistedCandidates';

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

          {/* Route for the Skill Assessment Dashboard */}
          <Route path="/skills-assessments" element={<SkillAssessmentDashboard />}/>

          {/* Route for the Skill Assessment */}
          <Route path="/skills-assessments-list" element={<SkillAssessment />}/>

          {/* Route for the Skill Assessment */}
          <Route path="/skills-assessments-result" element={<SkillAssessmentResults  />}/>

          {/* Route for the Learning Resources */}
          <Route path="/learning-resources" element={<LearningResources />}/> 

          {/* Route for the Employer Learning Resources Dashboard */}
          <Route path="/employer-learning-resources" element={<EmployerLearningResourceDashboard />}/>

          {/* Route for the AddResources */}
          <Route path="/add-resources" element={<AddResource />}/>    

          {/* Route for the Employer Skill Assessment Dashboard */}
          <Route path="/employer-skill-assessment" element={<EmployerSkillAssessmentDashboard />}/> 

          {/* Route for the Manage Questions */}
          <Route path="/manage-questions" element={<ManageQuestions />} />

          {/* Route for the Employer Manage Profile */}
          <Route path="/employer-manage-profile" element={<EmployerManageProfilePage />} /> 

          {/* Route for the Employer Manage Application */}
          <Route path="/manage-applications" element={<ManageApplicationsPage />} />

          {/* Route for the Shortlisted Candidates */}
          <Route path="/shortlisted-candidates" element={<ShortlistedCandidates />} />    

        </Routes>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;
