import AuthPage from './components/AuthPage.jsx';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Home />

      <HowItWorks />
      <AuthPage />
      
      
      
      <Footer />
    </>
  );
}
export default App;