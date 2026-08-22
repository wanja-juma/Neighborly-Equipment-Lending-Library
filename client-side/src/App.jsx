import AuthPage from './components/AuthPage.jsx';
import LandingPage from './components/LandingPage';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <LandingPage />
      <HowItWorks />
      <AuthPage />
      <Footer />
    </div>
  );
}

export default App;
