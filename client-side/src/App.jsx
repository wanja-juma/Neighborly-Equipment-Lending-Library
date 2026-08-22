import AuthPage from './components/AuthPage.jsx';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PaymentBar from './components/PaymentBar';
import './App.css';

function App() {
  return (
    <>
      <HowItWorks />
      <Navbar />
      <AuthPage />
      <PaymentBar itemName="Cordless Drill" dailyRate={5} />
      <Footer />
    </>
  );
}

export default App;