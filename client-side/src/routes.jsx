import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AuthPage from './components/AuthPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
    </Routes>
  );
}

export default AppRoutes;