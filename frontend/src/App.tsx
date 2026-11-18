/**
 * Application root: Sets up ToastProvider, ProjectDiscoveryProvider, and React Router.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { ProjectDiscoveryProvider } from './context/ProjectDiscoveryContext';
import { LandingPage } from './pages/LandingPage';
import { WizardPage } from './pages/WizardPage';
import { ResultsPage } from './pages/ResultsPage';

export default function App() {
  return (
    <ToastProvider>
      <ProjectDiscoveryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/wizard" element={<WizardPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectDiscoveryProvider>
    </ToastProvider>
  );
}
