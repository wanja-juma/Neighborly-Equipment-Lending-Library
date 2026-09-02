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

  const profile =
    user.profile || {};

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

    return normalizeUser(
      parsedUser
    );
  } catch {
    localStorage.removeItem(
      USER_STORAGE_KEY
    );

    return null;
  }
};

const getStoredToken = () => {
  return (
    localStorage.getItem("neighborlyToken"
    ) ||
    localStorage.getItem(
      "access_token"
    )
  );
};

function AuthProvider({
  children,
}) {
  const [
    currentUser,
    setCurrentUser,
  ] = useState(getSavedUser);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const saveUser =
    useCallback((user) => {
      const normalizedUser =
        normalizeUser(user);

      setCurrentUser(
        normalizedUser
      );

      if (normalizedUser) {
        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(
            normalizedUser
          )
        );
      } else {
        localStorage.removeItem(
          USER_STORAGE_KEY
        );
      }

      return normalizedUser;
    }, []);

  const login = useCallback(
    (user, token) => {
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

      localStorage.setItem("neighborlyToken"
        ,
        token
      );

      localStorage.removeItem(
        "access_token"
      );

      setAuthLoading(false);
    },
    [saveUser]
  );

  const logout =
    useCallback(() => {
      setCurrentUser(null);

      clearStoredAuthentication();

      setAuthLoading(false);
    }, []);

  useEffect(() => {
    const restoreSession =
      async () => {
        const token =
          getStoredToken();

        if (!token) {
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        try {
          const response =
            await fetch(
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
            response.status ===
              401 ||
            response.status ===
              403
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
              "The current-user response does not contain a user."
            );
          }

          saveUser(
            restoredUser
          );

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

          logout();
        } finally {
          setAuthLoading(false);
        }
      };

    restoreSession();
  }, [
    logout,
    saveUser,
  ]);

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