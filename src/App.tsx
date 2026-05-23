import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { RecruiterJobsCreate } from './pages/recruiter/RecruiterJobsCreate';
import { RecruiterJobPipeline } from './pages/recruiter/RecruiterJobPipeline';
import { RecruiterOnboarding } from './pages/recruiter/RecruiterOnboarding';
import { RecruiterProfile } from './pages/recruiter/RecruiterProfile';
import { InterviewRoom } from './pages/InterviewRoom';
import { SocialHub } from './pages/SocialHub';
import { Jobs } from './pages/Jobs';
import { NetworkChat } from './pages/NetworkChat';
import { Roadmaps } from './pages/Roadmaps';
import { Auth } from './pages/Auth';
import { TagExplorer } from './pages/TagExplorer';
import { RoadmapBuilder } from './pages/RoadmapBuilder';
// JobDetails removed in favor of RecruiterJobPipeline
import { PublicProfile } from './pages/PublicProfile';
import { PaymentGateway } from './pages/PaymentGateway';
import { LearningCenter } from './pages/LearningCenter';
import { GlobalNetwork } from './pages/GlobalNetwork';
import { Services } from './pages/Services';
import { CompanyPage } from './pages/CompanyPage';
import { CompaniesSearch } from './pages/CompaniesSearch';
import { SalaryInsights } from './pages/SalaryInsights';
import { EmployeeDirectory } from './pages/EmployeeDirectory';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { About } from './pages/About';
import { Policy } from './pages/Policy';
import { Terms } from './pages/Terms';
import { Contact } from './pages/Contact';
import { Notifications } from './pages/Notifications';
import { CurrencyProvider } from './context/CurrencyContext';
import { RoadmapProvider } from './context/RoadmapContext';
import { ThemeProvider } from './context/ThemeContext';

import { Settings } from './pages/Settings';

function AppRoutes() {
  const location = useLocation();
  const isIsolated = ['/register', '/login', '/interview'].some(path => location.pathname.startsWith(path));
  const rootKey = isIsolated ? location.pathname : 'main-layout';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={rootKey}>
        {/* Full Screen Isolated Routes */}
        <Route path="/register" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/interview/:interviewId" element={<InterviewRoom />} />

        {/* Routes under Main Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="companies" element={<CompaniesSearch />} />
          <Route path="jobs/tags/:tagId" element={<TagExplorer />} />
          <Route path="news" element={<SocialHub />} />
          <Route path="roadmaps" element={<Roadmaps />} />
          <Route path="about" element={<About />} />
          <Route path="policy" element={<Policy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="contact" element={<Contact />} />
          <Route path="settings" element={<Navigate to="/settings/account" replace />} />
          <Route path="settings/:tabId" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          
          <Route path="onboarding/parameters" element={<Onboarding />} />
          <Route path="onboarding/roadmap-builder" element={<RoadmapBuilder />} />
          
          <Route path="recruiter/onboarding" element={<RecruiterOnboarding />} />
          <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="recruiter/jobs/create" element={<RecruiterJobsCreate />} />
          <Route path="recruiter/jobs/:jobId" element={<RecruiterJobPipeline />} />
          <Route path="recruiter/profile" element={<RecruiterProfile />} />
          
          <Route path="seeker/dashboard" element={<SeekerDashboard />} />
          
          <Route path="network" element={<GlobalNetwork />} />
          <Route path="network/connections" element={<NetworkChat />} />
          <Route path="network/messages" element={<NetworkChat />} />
          <Route path="profile/:username" element={<PublicProfile />} />
          
          {/* Wallet hidden — redirect to home */}
          <Route path="wallet" element={<Navigate to="/" replace />} />
          <Route 
            path="wallet/checkout/:candidateId" 
            element={
              <ProtectedRoute>
                <PaymentGateway />
              </ProtectedRoute>
            } 
          />
          
          <Route path="services" element={<Services />} />
          <Route path="learning-center/:courseId" element={<LearningCenter />} />
          <Route path="company/:companyId" element={<CompanyPage />} />
          <Route path="salary-insights" element={<SalaryInsights />} />
          <Route path="employees/:companyId" element={<EmployeeDirectory />} />

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  console.log("App.tsx: rendering");
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <RoadmapProvider>
            <Router>
              <AppRoutes />
            </Router>
          </RoadmapProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
