import AuthPage from './components/AuthPage.jsx';
import LandingPage from './components/LandingPage';
import BrowseTools from './components/BrowseTools'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import LandingPage from "./components/LandingPage";
import BrowseItems from "./pages/BrowseItems";
import DamageReports from "./pages/DamageReports";
import Loans from "./pages/Loans";
import MyListings from "./pages/MyListings";
import Requests from "./pages/Requests";
import ItemsProvider from "./context/ItemsProvider";
import AddItem from "./pages/AddItem";
import RequestsProvider from "./context/RequestsProvider";
import DamageReportsProvider from "./context/DamageReportsProvider.jsx";
import EditItem from "./pages/EditItem";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <LandingPage />
      <BrowseTools />
      <AuthPage />
      <Footer />
    </div>
    <ItemsProvider>
      <RequestsProvider>
        <DamageReportsProvider>
          <Navbar />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/items" element={<BrowseItems />} />
                <Route path="/items/new" element={<AddItem />} />
                <Route path="/listings" element={<MyListings />} />
                <Route path="/listings/:itemId/edit" element={<EditItem />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/damage-reports" element={<DamageReports />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </DamageReportsProvider>
      </RequestsProvider>
    </ItemsProvider>
  );
}

export default App;
