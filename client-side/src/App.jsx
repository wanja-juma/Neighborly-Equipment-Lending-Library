import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
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
import HowItWorks from "./Pages/HowItWorks";
import FAQ from "./Pages/FAQ";
import Contact from "./Pages/Contact";
import Guidelines from "./Pages/Guidelines";
import Report from "./Pages/Report";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import Liability from "./Pages/Liability";
import ItemsProvider from "./context/ItemsProvider";
import RequestsProvider from "./context/RequestsProvider";
import LoansProvider from "./context/LoansProvider";
import DamageReportsProvider from "./context/DamageReportsProvider";
import AuthProvider from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }
    }
  }, [location]);

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
                  {/* Landing page */}
                  <Route path="/" element={<><Home /><About /></>} />

                  {/* About page */}
                  <Route path="/about" element={<><Home /><About /></>} />

                  {/* Browse tools */}
                  <Route path="/browse-tools" element={<BrowseTools />} />

                  {/* How It Works */}
                  <Route path="/how-it-works" element={<HowItWorks />} />

                  {/* FAQ */}
                  <Route path="/faq" element={<FAQ />} />

                  {/* Contact */}
                  <Route path="/contact" element={<Contact />} />

                  {/* Community Guidelines */}
                  <Route path="/guidelines" element={<Guidelines />} />

                  {/* Report an Issue */}
                  <Route path="/report" element={<Report />} />

                  {/* Terms of Service */}
                  <Route path="/terms" element={<Terms />} />

                  {/* Privacy Policy */}
                  <Route path="/privacy" element={<Privacy />} />

                  {/* Liability Policy */}
                  <Route path="/liability" element={<Liability />} />

                  {/* Authentication */}
                  <Route path="/auth" element={<AuthPage />} />

                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
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

              {!isDashboardRoute && <Footer />}
            </DamageReportsProvider>
          </LoansProvider>
        </RequestsProvider>
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App;
