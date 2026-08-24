import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import BrowseTools from "./components/BrowseTools";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import BrowseItems from "./Pages/BrowseItems";
import AddItem from "./Pages/AddItem";
import EditItem from "./Pages/EditItem";
import MyListings from "./Pages/MyListings";
import Requests from "./Pages/Requests";
import Loans from "./Pages/Loans";
import DamageReports from "./Pages/DamageReports";
import ItemsProvider from "./context/ItemsProvider";
import RequestsProvider from "./context/RequestsProvider";
import LoansProvider from "./context/LoansProvider";
import DamageReportsProvider from "./context/DamageReportsProvider";
import "./App.css";

function App() {
  const location = useLocation();

  const dashboardRoutePrefixes = [
    "/dashboard",
    "/items",
    "/listings",
    "/requests",
    "/loans",
    "/damage-reports",
  ];

  const isDashboardRoute = dashboardRoutePrefixes.some(
    (routePrefix) =>
      location.pathname === routePrefix ||
      location.pathname.startsWith(`${routePrefix}/`)
  );

  return (
    <ItemsProvider>
      <RequestsProvider>
        <LoansProvider>
          <DamageReportsProvider>
            <Navbar />

            <div className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/about" element={<About />} />

                <Route path="/browse-tools" element={<BrowseTools />} />

                <Route path="/auth" element={<AuthPage />} />

                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/items" element={<BrowseItems />} />
                  <Route path="/items/new" element={<AddItem />} />
                  <Route path="/listings" element={<MyListings />} />
                  <Route
                    path="/listings/:itemId/edit"
                    element={<EditItem />}
                  />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/loans" element={<Loans />} />
                  <Route
                    path="/damage-reports"
                    element={<DamageReports />}
                  />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {!isDashboardRoute && <Footer />}
          </DamageReportsProvider>
        </LoansProvider>
      </RequestsProvider>
    </ItemsProvider>
  );
}

export default App;