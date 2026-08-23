import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./App.css";
import "./index.css";

function App() {
  return (
    <>
      <Navbar />
      <LandingPage.jsx />
      <AuthPage />
      <Dashboard />
      <Footer />
    </>
  );
}

export default App;