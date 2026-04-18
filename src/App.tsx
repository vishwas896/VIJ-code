import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { PublicLanding } from './pages/PublicLanding';
import { Onboarding } from './pages/Onboarding';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { RecruiterPostJob } from './pages/RecruiterPostJob';
import { InterviewRoom } from './pages/InterviewRoom';
import { SocialHub } from './pages/SocialHub';
import { Explore } from './pages/Explore';
import { NetworkChat } from './pages/NetworkChat';
import { Roadmaps } from './pages/Roadmaps';
import { Wallet } from './pages/Wallet';
import { Marketplace } from './pages/Marketplace';
import { Auth } from './pages/Auth';
import { Placeholder } from './components/Placeholder';

function App() {
  return (
    <Router>
      <Routes>
        {/* Full Screen Isolated Routes */}
        <Route path="/register" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/interview/:interviewId" element={<InterviewRoom />} />

        {/* Routes under Main Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PublicLanding />} />
          <Route path="explore" element={<Explore />} />
          <Route path="explore/tags/:tagId" element={<Placeholder title="Tag Explorer" />} />
          <Route path="news" element={<SocialHub />} />
          <Route path="roadmaps" element={<Roadmaps />} />
          
          <Route path="onboarding/parameters" element={<Onboarding />} />
          <Route path="onboarding/roadmap-builder" element={<Placeholder title="Roadmap Builder" />} />
          
          <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="recruiter/post-job" element={<RecruiterPostJob />} />
          <Route path="recruiter/jobs/:jobId" element={<Placeholder title="Job Details" />} />
          
          <Route path="network/connections" element={<NetworkChat />} />
          <Route path="network/messages" element={<NetworkChat />} />
          <Route path="profile/:username" element={<Placeholder title="Public Profile" />} />
          
          <Route path="wallet" element={<Wallet />} />
          <Route path="wallet/checkout/:candidateId" element={<Placeholder title="Payment Gateway" />} />
          
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="learning-center/:courseId" element={<Placeholder title="Learning Center" />} />

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
