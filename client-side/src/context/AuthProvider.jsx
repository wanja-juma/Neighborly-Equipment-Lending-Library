import {
  useCallback,
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

const clearStoredAuthentication = () => {
  localStorage.removeItem(
    USER_STORAGE_KEY
  );

  localStorage.removeItem(
    TOKEN_STORAGE_KEY
  );

  // Remove older storage keys that may
  // still exist in the browser.
  localStorage.removeItem(
    "neighborlyRefreshToken"
  );

  localStorage.removeItem(
    "access_token"
  );
};

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  const profile = user.profile || {};

  const firstName =
    user.firstName ||
    user.first_name ||
    profile.firstName ||
    profile.first_name ||
    "";

  const lastName =
    user.lastName ||
    user.last_name ||
    profile.lastName ||
    profile.last_name ||
    "";

  const fullName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    ...user,
    id:
      user.id !== undefined &&
      user.id !== null
        ? String(user.id)
        : "",
    firstName,
    lastName,
    name:
      user.name ||
      fullName ||
      user.email ||
      "Neighbour",
    role:
      user.role ||
      profile.role ||
      "Member",
  };
};

const getSavedUser = () => {
  const savedUser =
    localStorage.getItem(
      USER_STORAGE_KEY
    );

  if (!savedUser) {
    return null;
  }

  try {
    const parsedUser =
      JSON.parse(savedUser);

    return normalizeUser(parsedUser);
  } catch {
    localStorage.removeItem(
      USER_STORAGE_KEY
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

  const login = useCallback(
    (user, token = null) => {
      const normalizedUser =
        normalizeUser(user);

      setCurrentUser(
        normalizedUser
      );

      setAuthLoading(false);

      if (normalizedUser) {
        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(
            normalizedUser
          )
        );
      }

      if (token) {
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          token
        );

        // Remove the old token key so the
        // application uses one consistent key.
        localStorage.removeItem(
          "access_token"
        );
      }
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthLoading(false);

    clearStoredAuthentication();
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token =
        localStorage.getItem(
          TOKEN_STORAGE_KEY
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
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
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

        if (!data.user) {
          throw new Error(
            "The current-user response does not contain a user."
          );
        }

        const restoredUser =
          normalizeUser(data.user);

        setCurrentUser(
          restoredUser
        );

        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(
            restoredUser
          )
        );

        // If an old token was found, move it
        // to the current storage key.
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
         * Clear invalid or unusable session
         * data so the navbar and dashboard do
         * not display conflicting auth states.
         */
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [logout]);

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