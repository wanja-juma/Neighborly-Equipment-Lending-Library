import AuthPage from './components/AuthPage.jsx';
import LandingPage from './components/LandingPage';
import HowItWorks from './components/HowItWorks';
import BrowseTools from './components/BrowseTools'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <LandingPage />
      <HowItWorks />
      <BrowseTools />
      <AuthPage />
      <Footer />
    </div>
  );
}

export default App;
