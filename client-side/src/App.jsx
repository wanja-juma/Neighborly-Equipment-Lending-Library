import { Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage.jsx';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BrowseTools from './components/BrowseTools';
import ItemDetail from './components/ItemDetail';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<><HowItWorks /><AuthPage /></>} />
        <Route path="/tools" element={<BrowseTools />} />
        <Route path="/tools/:id" element={<ItemDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;