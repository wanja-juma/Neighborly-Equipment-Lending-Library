import {
  Navigate,
  useLocation,
} from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

function ProtectedRoute({ children }) {
  const {
    isAuthenticated,
    authLoading,
  } = useAuth();

  const location = useLocation();

  if (authLoading) {
    return (
      <div className="auth-loading">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
