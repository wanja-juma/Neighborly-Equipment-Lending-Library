import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthPage from "./components/AuthPage.jsx";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./components/Home";
import BrowseItems from "./pages/BrowseItems";
import DamageReports from "./pages/DamageReports";
import Loans from "./pages/Loans";
import MyListings from "./pages/MyListings";
import Requests from "./pages/Requests";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";

import ItemsProvider from "./context/ItemsProvider";
<<<<<<< Updated upstream
import RequestProvider from "./context/RequestsProvider";
import LoansProvider from "./context/LoansProvider.jsx";
import DamageReportsProvider from "./context/DamageReportsProvider.jsx";

=======
import RequestsProvider from "./context/RequestsProvider";
import LoansProvider from "./context/LoansProvider";
import DamageReportsProvider from "./context/DamageReportsProvider";
import AuthProvider from "./context/AuthProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChangeAvailability from "./Pages/ChangeAvailability";
>>>>>>> Stashed changes
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
      <RequestProvider>
        <LoansProvider>
          <DamageReportsProvider>
            <Navbar />
            <div className="app-content">
              <Routes>
                {/* Landing page */}
                <Route path="/" element={<Home />} />
                
                {/* About page */}
                <Route path="/about" element={<About />} />
                
                {/* Authentication */}
                <Route path="/auth" element={<AuthPage />} />

                {/* Dashboard pages */}
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

<<<<<<< Updated upstream
                {/* 404 - Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            {!isDashboardRoute && <Footer />}
          </DamageReportsProvider>
        </LoansProvider>
      </RequestProvider>
    </ItemsProvider>
=======
                  {/* About page */}
                  <Route path="/about" element={<><Home /><About /></>} />

                  {/* Browse tools */}
                  <Route path="/browse-tools" element={<BrowseTools />} />
                  <Route path="/tools/:id" element={<ItemDetail />} />
                  <Route path="/payment/:id" element={<PaymentBar />} />
                  <Route
  path="/listings/:itemId/availability"
  element={<ChangeAvailability />}
/>

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
>>>>>>> Stashed changes
  );
}

export default App;