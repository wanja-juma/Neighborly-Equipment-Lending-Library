import AuthPage from './components/AuthPage.jsx';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <AuthPage />
      <Footer />
    </>
  );
}
export default App;