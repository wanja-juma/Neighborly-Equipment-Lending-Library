import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  changePassword,
  deleteAccount,
} from "../services/api.js";

import useAuth from "../hooks/useAuth";

import "./Settings.css";


function Settings() {
  const navigate = useNavigate();

  const { logout } = useAuth();


  const [
    passwordForm,
    setPasswordForm,
  ] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const [
    deletePassword,
    setDeletePassword,
  ] = useState("");


  const [
    passwordMessage,
    setPasswordMessage,
  ] = useState("");


  const [
    passwordError,
    setPasswordError,
  ] = useState("");


  const [
    deleteError,
    setDeleteError,
  ] = useState("");


  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);


  const [
    deletingAccount,
    setDeletingAccount,
  ] = useState(false);


  const handlePasswordChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setPasswordForm(
        (currentForm) => ({
          ...currentForm,
          [name]: value,
        })
      );
    };


  const handleChangePassword =
    async (event) => {
      event.preventDefault();

      setPasswordError("");
      setPasswordMessage("");


      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = passwordForm;


      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setPasswordError(
          "Please complete all password fields."
        );

        return;
      }


      if (
        newPassword.length < 8
      ) {
        setPasswordError(
          "The new password must contain at least 8 characters."
        );

        return;
      }


      if (
        newPassword !==
        confirmPassword
      ) {
        setPasswordError(
          "The new passwords do not match."
        );

        return;
      }


      setChangingPassword(true);

      try {
        const response =
          await changePassword({
            current_password:
              currentPassword,

            new_password:
              newPassword,

            confirm_password:
              confirmPassword,
          });


        setPasswordMessage(
          response?.message ||
            "Password changed successfully."
        );


        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        setPasswordError(
          error.message ||
            "Unable to change your password."
        );
      } finally {
        setChangingPassword(false);
      }
    };


  const handleDeleteAccount =
    async (event) => {
      event.preventDefault();

      setDeleteError("");


      if (!deletePassword) {
        setDeleteError(
          "Please enter your password to confirm account deletion."
        );

        return;
      }


      const confirmed =
        window.confirm(
          "Are you sure you want to permanently delete your account? This action cannot be undone."
        );


      if (!confirmed) {
        return;
      }


      setDeletingAccount(true);

      try {
        await deleteAccount(
          deletePassword
        );


        logout();


        navigate(
          "/auth?mode=register",
          {
            replace: true,
          }
        );
      } catch (error) {
        setDeleteError(
          error.message ||
            "Unable to delete your account."
        );
      } finally {
        setDeletingAccount(false);
      }
    };


  return (
    <main className="settings-page">

      <header className="settings-heading">
        <h1>Account Settings</h1>

        <p>
          Manage your password and
          account.
        </p>
      </header>


      <section className="settings-card">

        <div className="settings-card-heading">
          <h2>Change Password</h2>

          <p>
            Update the password you
            use to sign in to
            Neighborly.
          </p>
        </div>


        <form
          className="settings-form"
          onSubmit={
            handleChangePassword
          }
          noValidate
        >

          <label>
            <span>
              Current Password
            </span>

            <input
              type="password"
              name="currentPassword"
              value={
                passwordForm.currentPassword
              }
              onChange={
                handlePasswordChange
              }
              autoComplete="current-password"
            />
          </label>


          <label>
            <span>
              New Password
            </span>

            <input
              type="password"
              name="newPassword"
              value={
                passwordForm.newPassword
              }
              onChange={
                handlePasswordChange
              }
              autoComplete="new-password"
            />
          </label>


          <label>
            <span>
              Confirm New Password
            </span>

            <input
              type="password"
              name="confirmPassword"
              value={
                passwordForm.confirmPassword
              }
              onChange={
                handlePasswordChange
              }
              autoComplete="new-password"
            />
          </label>


          {passwordError && (
            <p
              className="settings-message error"
              role="alert"
            >
              {passwordError}
            </p>
          )}


          {passwordMessage && (
            <p
              className="settings-message success"
              role="status"
            >
              {passwordMessage}
            </p>
          )}


          <button
            type="submit"
            className="settings-primary-button"
            disabled={
              changingPassword
            }
          >
            {changingPassword
              ? "Changing Password..."
              : "Change Password"}
          </button>

        </form>

      </section>


      <section className="settings-card danger-zone">

        <div className="settings-card-heading">
          <h2>Delete Account</h2>

          <p>
            Permanently delete your
            Neighborly account.
          </p>
        </div>


        <div className="danger-warning">
          This action cannot be
          undone.
        </div>


        <form
          className="settings-form"
          onSubmit={
            handleDeleteAccount
          }
          noValidate
        >

          <label>
            <span>
              Enter your password
              to confirm
            </span>

            <input
              type="password"
              value={
                deletePassword
              }
              onChange={(event) =>
                setDeletePassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
            />
          </label>


          {deleteError && (
            <p
              className="settings-message error"
              role="alert"
            >
              {deleteError}
            </p>
          )}


          <button
            type="submit"
            className="delete-account-button"
            disabled={
              deletingAccount
            }
          >
            {deletingAccount
              ? "Deleting Account..."
              : "Delete Account"}
          </button>

        </form>

      </section>

    </main>
  );
}


export default Settings;