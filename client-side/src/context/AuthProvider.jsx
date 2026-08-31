import {
  useEffect,
  useState,
} from "react";

import AuthContext from "./AuthContext.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

const getSavedUser = () => {
  const savedUser =
    localStorage.getItem(
      "neighborlyUser"
    );

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(
      "neighborlyUser"
    );

    return null;
  }
};

function AuthProvider({ children }) {
  const [
    currentUser,
    setCurrentUser,
  ] = useState(getSavedUser);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const login = (
    user,
    token = null
  ) => {
    setCurrentUser(user);
    setAuthLoading(false);

    localStorage.setItem(
      "neighborlyUser",
      JSON.stringify(user)
    );

    if (token) {
      localStorage.setItem(
        "neighborlyToken",
        token
      );
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthLoading(false);

    localStorage.removeItem(
      "neighborlyUser"
    );

    localStorage.removeItem(
      "neighborlyToken"
    );

    localStorage.removeItem(
      "neighborlyRefreshToken"
    );

    localStorage.removeItem(
      "access_token"
    );
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token =
        localStorage.getItem(
          "neighborlyToken"
        ) ||
        localStorage.getItem(
          "access_token"
        );

      if (!token) {
        logout();
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/current-user`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Unable to restore session."
          );
        }

        const restoredUser =
          data.user;

        if (!restoredUser) {
          throw new Error(
            "The current-user response does not contain a user."
          );
        }

        setCurrentUser(
          restoredUser
        );

        localStorage.setItem(
          "neighborlyUser",
          JSON.stringify(
            restoredUser
          )
        );
      } catch (error) {
        console.error(
          "Unable to restore session:",
          error
        );
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const value = {
    currentUser,
    isAuthenticated:
      Boolean(currentUser),
    authLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;