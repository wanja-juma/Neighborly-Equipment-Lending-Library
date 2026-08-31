import {
  useEffect,
  useState,
} from "react";

import AuthContext from "./AuthContext.js";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

const USER_STORAGE_KEY =
  "neighborlyUser";

const TOKEN_STORAGE_KEY =
  "neighborlyToken";

const getStoredUser = () => {
  const savedUser =
    localStorage.getItem(
      USER_STORAGE_KEY
    );

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(
      USER_STORAGE_KEY
    );

    return null;
  }
};

const getStoredToken = () => {
  return (
    localStorage.getItem(
      TOKEN_STORAGE_KEY
    ) ||
    localStorage.getItem(
      "access_token"
    )
  );
};

function AuthProvider({ children }) {
  const [
    currentUser,
    setCurrentUser,
  ] = useState(getStoredUser);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const saveUser = (user) => {
    setCurrentUser(user);

    if (user) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(
        USER_STORAGE_KEY
      );
    }
  };

  const login = (
    user,
    token
  ) => {
    if (!user) {
      throw new Error(
        "User information is required."
      );
    }

    if (!token) {
      throw new Error(
        "An access token was not returned by the server."
      );
    }

    saveUser(user);

    localStorage.setItem(
      TOKEN_STORAGE_KEY,
      token
    );

    // Remove the older token key so the app
    // uses one consistent storage key.
    localStorage.removeItem(
      "access_token"
    );

    setAuthLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthLoading(false);

    localStorage.removeItem(
      USER_STORAGE_KEY
    );

    localStorage.removeItem(
      TOKEN_STORAGE_KEY
    );

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "neighborlyRefreshToken"
    );
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token =
        getStoredToken();

      if (!token) {
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/current-user`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

        const contentType =
          response.headers.get(
            "content-type"
          );

        const responseBody =
          contentType?.includes(
            "application/json"
          )
            ? await response.json()
            : null;

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          logout();
          return;
        }

        if (!response.ok) {
          throw new Error(
            responseBody?.error ||
              responseBody?.message ||
              "Unable to restore the session."
          );
        }

        const restoredUser =
          responseBody?.user;

        if (!restoredUser) {
          throw new Error(
            "The server response did not contain user information."
          );
        }

        saveUser(restoredUser);

        // Move an older token key to the
        // current token storage key.
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          token
        );

        localStorage.removeItem(
          "access_token"
        );
      } catch (error) {
        console.error(
          "Unable to restore session:",
          error
        );

        /*
         * Do not remove the locally stored
         * user for a temporary network error.
         */
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