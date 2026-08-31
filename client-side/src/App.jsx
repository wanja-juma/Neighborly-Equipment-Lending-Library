import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AuthPage from "./components/AuthPage.jsx";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import BrowseItems from "./pages/BrowseItems";
import DamageReports from "./pages/DamageReports";
import Loans from "./pages/Loans";
import MyListings from "./pages/MyListings";
import Requests from "./pages/Requests";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import ChangeAvailability from "./pages/ChangeAvailability";

// Add these only if these files exist in your project
import BrowseTools from "./pages/BrowseTools";
import ItemDetail from "./pages/ItemDetail";
import PaymentBar from "./pages/PaymentBar";

// Context Providers
import AuthProvider from "./context/AuthProvider.jsx";
import ItemsProvider from "./context/ItemsProvider";
import RequestsProvider from "./context/RequestsProvider";
import LoansProvider from "./context/LoansProvider.jsx";
import DamageReportsProvider from "./context/DamageReportsProvider.jsx";

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
    <AuthProvider>
      <ItemsProvider>
        <RequestsProvider>
          <LoansProvider>
            <DamageReportsProvider>
              <Navbar />

              <div className="app-content">
                <Routes>
                  {/* =========================
                      PUBLIC ROUTES
                  ========================== */}

                  {/* Landing page */}
                  <Route path="/" element={<Home />} />

                  {/* About page */}
                  <Route path="/about" element={<About />} />

                  {/* Browse tools */}
                  <Route path="/browse-tools" element={<BrowseTools />} />

                  {/* Individual item */}
                  <Route path="/tools/:id" element={<ItemDetail />} />

                  {/* Payment */}
                  <Route path="/payment/:id" element={<PaymentBar />} />

                  {/* Authentication */}
                  <Route path="/auth" element={<AuthPage />} />

                  {/* =========================
                      PROTECTED DASHBOARD ROUTES
                  ========================== */}

                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Items */}
                    <Route path="/items" element={<BrowseItems />} />

                    {/* Add item */}
                    <Route path="/items/new" element={<AddItem />} />

                    {/* My listings */}
                    <Route path="/listings" element={<MyListings />} />

                    {/* Edit listing */}
                    <Route
                      path="/listings/:itemId/edit"
                      element={<EditItem />}
                    />

                    {/* Change availability */}
                    <Route
                      path="/listings/:itemId/availability"
                      element={<ChangeAvailability />}
                    />

                    {/* Requests */}
                    <Route path="/requests" element={<Requests />} />

                    {/* Loans */}
                    <Route path="/loans" element={<Loans />} />

                    {/* Damage reports */}
                    <Route
                      path="/damage-reports"
                      element={<DamageReports />}
                    />
                  </Route>

                  {/* =========================
                      404 / UNKNOWN ROUTES
                  ========================== */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Hide footer on dashboard pages */}
              {!isDashboardRoute && <Footer />}
            </DamageReportsProvider>
          </LoansProvider>
        </RequestsProvider>
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App;