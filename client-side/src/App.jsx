import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import LandingPage from "./components/LandingPage";
import BrowseItems from "./Pages/BrowseItems";
import AddItem from "./Pages/AddItem";
import EditItem from "./Pages/EditItem";
import MyListings from "./Pages/MyListings";
import Requests from "./Pages/Requests";
import Loans from "./Pages/Loans";
import DamageReports from "./Pages/DamageReports";
import AuthPage from "./components/AuthPage";
import ItemsProvider from "./context/ItemsProvider";
import RequestsProvider from "./context/RequestsProvider";
import DamageReportsProvider from "./context/DamageReportsProvider";
import "./App.css";

function App() {
  return (
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