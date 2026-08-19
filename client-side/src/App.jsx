import AuthPage from './components/AuthPage.jsx';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css';

import Dashboard from './components/Dashboard'

const App = () => {
  return (
    <div>
      <Navbar />
      <HowItWorks />
      <AuthPage />
      <Dashboard /> 
      <Footer />
    </div>

  
  );
}

export default App

