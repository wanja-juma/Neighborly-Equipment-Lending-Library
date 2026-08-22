import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./components/Navbar";
import BrowseItems from "./pages/BrowseItems";
import DamageReports from "./pages/DamageReports";
import Loans from "./pages/Loans";
import MyListings from "./pages/MyListings";
import Requests from "./pages/Requests";
import ItemsProvider from "./context/ItemsProvider";
import AddItem from "./pages/AddItem";
import RequestsProvider from "./context/RequestsProvider";
import "./App.css";

function App() {
  return (
    
    <ItemsProvider>
      <RequestsProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<HowItWorks />} />

        <Route path="/auth" element={<AuthPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<BrowseItems />} />
          <Route path="/items/new" element={<AddItem />} />
          <Route path="/listings" element={<MyListings />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/loans" element={<Loans />} />

          <Route
            path="/damage-reports"
            element={<DamageReports />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
      </RequestsProvider>
    </ItemsProvider>
  );
}

export default App;

