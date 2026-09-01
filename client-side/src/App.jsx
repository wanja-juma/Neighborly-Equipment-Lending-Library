import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import AuthPage from "./components/AuthPage.jsx";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import BrowseTools from "./components/BrowseTools";
import ItemDetail from "./components/ItemDetail";
import PaymentBar from "./components/PaymentBar";

import BrowseItems from "./Pages/BrowseItems";
import DamageReports from "./Pages/DamageReports";
import Loans from "./Pages/Loans";
import MyListings from "./Pages/MyListings";
import Requests from "./Pages/Requests";
import AddItem from "./Pages/AddItem";
import EditItem from "./Pages/EditItem";
import ChangeAvailability from "./Pages/ChangeAvailability";

import AuthProvider from "./context/AuthProvider.jsx";
import ItemsProvider from "./context/ItemsProvider";
import RequestsProvider from "./context/RequestsProvider";
import LoansProvider from "./context/LoansProvider.jsx";
import DamageReportsProvider from "./context/DamageReportsProvider.jsx";

import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const element =
      document.getElementById(
        location.hash.substring(1)
      );

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
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

  const isDashboardRoute =
    dashboardRoutePrefixes.some(
      (routePrefix) =>
        location.pathname ===
          routePrefix ||
        location.pathname.startsWith(
          `${routePrefix}/`
        )
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

                  <Route
                    path="/"
                    element={
                      <>
                        <Home />
                        <About />
                      </>
                    }
                  />

                  <Route
                    path="/about"
                    element={<Navigate to="/#about" replace />}
                  />

                  <Route
                    path="/browse-tools"
                    element={<BrowseTools />}
                  />

                  <Route
                    path="/tools/:id"
                    element={<ItemDetail />}
                  />

                  <Route
                    path="/payment/:id"
                    element={<PaymentBar />}
                  />

                  <Route
                    path="/auth"
                    element={<AuthPage />}
                  />

                  {/* =========================
                      PROTECTED ROUTES
                  ========================== */}

                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      path="/dashboard"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/items"
                      element={<BrowseItems />}
                    />

                    <Route
                      path="/items/new"
                      element={<AddItem />}
                    />

                    <Route
                      path="/listings"
                      element={<MyListings />}
                    />

                    <Route
                      path="/listings/:itemId/edit"
                      element={<EditItem />}
                    />

                    <Route
                      path="/listings/:itemId/availability"
                      element={
                        <ChangeAvailability />
                      }
                    />

                    <Route
                      path="/requests"
                      element={<Requests />}
                    />

                    <Route
                      path="/loans"
                      element={<Loans />}
                    />

                    <Route
                      path="/damage-reports"
                      element={
                        <DamageReports />
                      }
                    />
                  </Route>

                  {/* =========================
                      UNKNOWN ROUTES
                  ========================== */}

                  <Route
                    path="*"
                    element={
                      <Navigate
                        to="/"
                        replace
                      />
                    }
                  />
                </Routes>
              </div>

              {!isDashboardRoute && (
                <Footer />
              )}
            </DamageReportsProvider>
          </LoansProvider>
        </RequestsProvider>
      </ItemsProvider>
    </AuthProvider>
  );
}

export default App;
