import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OceanLayout from './components/layout/OceanLayout/OceanLayout';
import LandingPage from './features/auth/pages/LandingPage';
import Dashboard from './features/primary/dashboard/Dashboard';
import Courses from './features/primary/courses/Courses';
import Modules from './features/primary/modules/Modules';
import Notes from './features/primary/notes/Notes';
import ActivityMap from './features/primary/activity-map/ActivityMap';
import ActivityPlayer from './features/primary/activity-player/ActivityPlayer';


import { AudioProvider } from './context/AudioContext';

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
          </Route>
        </Routes>
      </Router>
    </AudioProvider>
  );
}

export default App;
