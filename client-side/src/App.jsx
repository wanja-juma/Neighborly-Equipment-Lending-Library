import AuthPage from './components/AuthPage.jsx';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Home />

      <LandingPage />
      <AuthPage />
      
      
      
      <Footer />
    </>
  );
}
export default App;