import AuthPage from './components/AuthPage.jsx';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css';


const App = () => {
  return (
  
    <div>    
    <>
      <Home />
      <HowItWorks />
      <Navbar />
      <HowItWorks />
      <AuthPage />
      <Dashboard /> 
      <Footer />
  


    </>
      </div>
  
  
  );
}

export default App

