import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import ToolsPanel from "./ToolsPanel.jsx";
import useAuth from "../hooks/useAuth.js";

import "./AuthPage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const isRegister =
    searchParams.get("mode") !== "login";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const update =
    (field) => (event) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const updateName =
    (field) => (event) => {
      const lettersOnly =
        event.target.value.replace(
          /[^A-Za-z\s'-]/g,
          ""
        );

      setForm((currentForm) => ({
        ...currentForm,
        [field]: lettersOnly,
      }));
    };

  const validateForm = () => {
    const email =
      form.email.trim();

    if (
      isRegister &&
      (
        !form.firstName.trim() ||
        !form.lastName.trim()
      )
    ) {
      return (
        "Please enter your first " +
        "and last name."
      );
    }

    const namePattern =
      /^[A-Za-z\s'-]+$/;

    if (
      isRegister &&
      (
        !namePattern.test(
          form.firstName.trim()
        ) ||
        !namePattern.test(
          form.lastName.trim()
        )
      )
    ) {
      return (
        "Names can only contain " +
        "letters."
      );
    }

    if (
      !email ||
      !email.includes("@")
    ) {
      return (
        "Please enter a valid " +
        "email address."
      );
    }

    if (!form.password) {
      return (
        "Please enter your password."
      );
    }

    if (
      isRegister &&
      form.password.length < 8
    ) {
      return (
        "Password must be at least " +
        "8 characters."
      );
    }

    return "";
  };

  const sendAuthRequest =
    async () => {
      const endpoint =
        isRegister
          ? "/auth/register"
          : "/auth/login";

      const requestBody =
        isRegister
          ? {
              firstName:
                form.firstName.trim(),

              lastName:
                form.lastName.trim(),

              email:
                form.email
                  .trim()
                  .toLowerCase(),

              password:
                form.password,
            }
          : {
              email:
                form.email
                  .trim()
                  .toLowerCase(),

              password:
                form.password,
            };

      let response;

      try {
        response = await fetch(
          `${API_BASE_URL}${endpoint}`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              requestBody
            ),
          }
        );
      } catch {
        throw new Error(
          "Unable to connect to the server. Make sure Flask is running."
        );
      }

      const contentType =
        response.headers.get(
          "content-type"
        );

      let responseBody = null;

      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        responseBody =
          await response.json();
      }

      if (!response.ok) {
        throw new Error(
          responseBody?.error ||
            responseBody?.message ||
            "Authentication failed."
        );
      }

      return responseBody;
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const validationError =
        validateForm();

      if (validationError) {
        setError(
          validationError
        );
        return;
      }

      setError("");
      setSuccess("");
      setSubmitting(true);

      try {
        const responseBody =
          await sendAuthRequest();

        const serverUser =
          responseBody?.user;

        const token =
          responseBody?.access_token ||
          responseBody?.accessToken;

        if (!serverUser) {
          throw new Error(
            "The server did not return user information."
          );
        }

        if (!token) {
          throw new Error(
            "The server did not return an access token."
          );
        }

        const profile =
          serverUser.profile || {};

        const firstName =
          profile.first_name ||
          profile.firstName ||
          serverUser.first_name ||
          serverUser.firstName ||
          form.firstName.trim();

        const lastName =
          profile.last_name ||
          profile.lastName ||
          serverUser.last_name ||
          serverUser.lastName ||
          form.lastName.trim();

        const fullName = [
          firstName,
          lastName,
        ]
          .filter(Boolean)
          .join(" ");

        const authenticatedUser = {
          ...serverUser,

          id: String(
            serverUser.id
          ),

          firstName,
          lastName,

          name:
            serverUser.name ||
            fullName ||
            serverUser.email,

          email:
            serverUser.email ||
            form.email
              .trim()
              .toLowerCase(),

          role:
            serverUser.role ||
            "Member",

          profile:
            serverUser.profile ||
            null,
        };

        login(
          authenticatedUser,
          token
        );

        setSuccess(
          isRegister
            ? `Account created! Welcome, ${
                firstName ||
                authenticatedUser.name
              }.`
            : `Welcome back, ${
                firstName ||
                authenticatedUser.name
              }.`
        );

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );
      } catch (requestError) {
        setError(
          requestError.message ||
            "Authentication failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

  const handleModeChange =
    () => {
      const nextMode =
        isRegister
          ? "login"
          : "register";

      setError("");
      setSuccess("");
      setShowPassword(false);

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      navigate(
        `/auth?mode=${nextMode}`,
        {
          replace: true,
        }
      );
    };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <section className="auth-form-panel">
          <span className="brand-badge">Neighborly</span>

          <div className="auth-heading">
            <h1>{isRegister ? 'Create an account' : 'Welcome back'}</h1>
            <p>
              {isRegister
                ? 'Sign up to borrow and lend equipment with your neighbors.'
                : 'Sign in to manage your borrowed and lent items.'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <div className="field-row">
                <label className="field">
                  <span>
                    First name
                  </span>

                  <input
                    type="text"
                    value={
                      form.firstName
                    }
                    onChange={updateName(
                      "firstName"
                    )}
                    autoComplete="given-name"
                    required
                  />
                </label>

                <label className="field">
                  <span>
                    Last name
                  </span>

                  <input
                    type="text"
                    value={
                      form.lastName
                    }
                    onChange={updateName(
                      "lastName"
                    )}
                    autoComplete="family-name"
                    required
                  />
                </label>
              </div>
            )}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={update(
                  "email"
                )}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <div className="password-input">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    form.password
                  }
                  onChange={update(
                    "password"
                  )}
                  placeholder="••••••••"
                  autoComplete={
                    isRegister
                      ? "new-password"
                      : "current-password"
                  }
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>
              </div>
            </label>

            {error && (
              <p className="server-error" role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className="server-success" role="status">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={
                submitting
              }
            >
              {submitting
                ? "Please wait…"
                : isRegister
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="switch-mode">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}

            <button
              type="button"
              onClick={
                handleModeChange
              }
            >
              {isRegister
                ? "Sign in"
                : "Sign up"}
            </button>
          </p>
        </section>

        <section className="auth-illustration-panel">
          <ToolsPanel />
        </section>
      </div>
    </div>
  )
}

export default AuthPage;

