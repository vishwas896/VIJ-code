import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { PublicLanding } from './pages/PublicLanding';
import { Onboarding } from './pages/Onboarding';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { InterviewRoom } from './pages/InterviewRoom';
import { SocialHub } from './pages/SocialHub';
import { Networking } from './pages/Networking';
import { WalletMarketplace } from './pages/WalletMarketplace';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PublicLanding />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="recruiter" element={<RecruiterDashboard />} />
          <Route path="interview" element={<InterviewRoom />} />
          <Route path="social" element={<SocialHub />} />
          <Route path="networking" element={<Networking />} />
          <Route path="wallet" element={<WalletMarketplace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
