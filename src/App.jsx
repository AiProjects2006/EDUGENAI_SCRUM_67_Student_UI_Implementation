import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OceanLayout from './components/layout/OceanLayout/OceanLayout';
import LandingPage from './features/auth/pages/LandingPage';
import Dashboard from './features/primary/dashboard/Dashboard';
import Courses from './features/primary/courses/Courses';
import Modules from './features/primary/modules/Modules';
import Notes from './features/primary/notes/Notes';
import ActivityMap from './features/primary/activity-map/ActivityMap';
import ActivityPlayer from './features/primary/activity-player/ActivityPlayer';
import ActivityGenerator from './features/primary/activity-generator/ActivityGenerator';
import GenerateActivityActivity from './features/primary/generate-activity-activity/GenerateActivityActivity';
import ScoreFeedback from './features/primary/score-feedback/ScoreFeedback';
import Recommendations from './features/primary/recommendations/Recommendations';


import { AudioProvider } from './context/AudioContext';
import GenerateActivityScore from "./features/primary/generate-activity-score/GenerateActivityScore.jsx";

function App() {
  return (
    <AudioProvider>
      <Router>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Protected routes wrapped in OceanLayout */}
          <Route path="/" element={<OceanLayout />}>
            <Route index element={<Navigate to="/landing" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="modules" element={<Modules />} />
            <Route path="notes" element={<Notes />} />
            <Route path="activity-map" element={<ActivityMap />} />
            <Route path="activity" element={<ActivityPlayer />} />
            <Route path="generate-activity" element={<ActivityGenerator />} />
            <Route path="generate-activity-activity" element={<GenerateActivityActivity />} />
            <Route path="score" element={<ScoreFeedback />} />
            <Route path="generate-activity-score" element={<GenerateActivityScore />} />
            <Route path="recommendations" element={<Recommendations />} />

          </Route>
        </Routes>
      </Router>
    </AudioProvider>
  );
}

export default App;
