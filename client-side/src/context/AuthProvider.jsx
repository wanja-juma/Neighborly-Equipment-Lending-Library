import { useState } from "react";
import AuthContext from "./AuthContext.js";

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] =
    useState(() => {
      const savedUser = localStorage.getItem(
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
    });

  const login = (user, token = null) => {
    setCurrentUser(user);

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

    localStorage.removeItem(
      "neighborlyUser"
    );

    localStorage.removeItem(
      "neighborlyToken"
    );

    localStorage.removeItem(
      "neighborlyRefreshToken"
    );
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;