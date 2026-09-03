import {
  useEffect,
  useState,
} from "react";

import useAuth from "../hooks/useAuth";
import {
  getProfile,
  updateMyProfile,
} from "../services/api";

import "./Profile.css";


function Profile() {
  const {
    currentUser,
    updateCurrentUser,
  } = useAuth();

  const [profile, setProfile] =
    useState(null);

  const [form, setForm] =
    useState({
      first_name: "",
      last_name: "",
      phone_number: "",
      address: "",
      avatar_url: "",
      bio: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [editing, setEditing] =
    useState(false);


  const profileId =
    currentUser?.profile?.id;


  useEffect(() => {
    const loadProfile =
      async () => {
        if (!profileId) {
          setError(
            "Your profile information could not be found."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const profileData =
            await getProfile(
              profileId
            );

          setProfile(
            profileData
          );

          setForm({
            first_name:
              profileData?.first_name ||
              "",

            last_name:
              profileData?.last_name ||
              "",

            phone_number:
              profileData?.phone_number ||
              "",

            address:
              profileData?.address ||
              "",

            avatar_url:
              profileData?.avatar_url ||
              "",

            bio:
              profileData?.bio ||
              "",
          });
        } catch (requestError) {
          setError(
            requestError.message ||
              "Unable to load your profile."
          );
        } finally {
          setLoading(false);
        }
      };

    loadProfile();
  }, [profileId]);


  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setForm(
        (currentForm) => ({
          ...currentForm,

          [name]: value,
        })
      );
    };


  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setForm({
      first_name:
        profile.first_name ||
        "",

      last_name:
        profile.last_name ||
        "",

      phone_number:
        profile.phone_number ||
        "",

      address:
        profile.address ||
        "",

      avatar_url:
        profile.avatar_url ||
        "",

      bio:
        profile.bio ||
        "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };


  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        !form.first_name.trim()
      ) {
        setError(
          "First name is required."
        );

        return;
      }

      if (
        !form.last_name.trim()
      ) {
        setError(
          "Last name is required."
        );

        return;
      }

      const profileData = {
        first_name:
          form.first_name.trim(),

        last_name:
          form.last_name.trim(),

        phone_number:
          form.phone_number.trim() ||
          null,

        address:
          form.address.trim() ||
          null,

        avatar_url:
          form.avatar_url.trim() ||
          null,

        bio:
          form.bio.trim() ||
          null,
      };

      try {
        setSaving(true);

        const updatedProfile =
          await updateMyProfile(
            profileData
          );

        setProfile(
          updatedProfile
        );

        setForm({
          first_name:
            updatedProfile
              ?.first_name ||
            "",

          last_name:
            updatedProfile
              ?.last_name ||
            "",

          phone_number:
            updatedProfile
              ?.phone_number ||
            "",

          address:
            updatedProfile
              ?.address ||
            "",

          avatar_url:
            updatedProfile
              ?.avatar_url ||
            "",

          bio:
            updatedProfile
              ?.bio ||
            "",
        });

        if (
          updateCurrentUser
        ) {
          updateCurrentUser({
            ...currentUser,

            firstName:
              updatedProfile
                .first_name,

            lastName:
              updatedProfile
                .last_name,

            name: [
              updatedProfile
                .first_name,

              updatedProfile
                .last_name,
            ]
              .filter(Boolean)
              .join(" "),

            profile:
              updatedProfile,
          });
        }

        setSuccess(
          "Profile updated successfully."
        );

        setEditing(false);
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to update your profile."
        );
      } finally {
        setSaving(false);
      }
    };


  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <p>
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }


  if (
    error &&
    !profile
  ) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-message error">
            {error}
          </div>
        </div>
      </main>
    );
  }


  const fullName = [
    profile?.first_name,
    profile?.last_name,
  ]
    .filter(Boolean)
    .join(" ");


  const initials = [
    profile?.first_name?.[0],
    profile?.last_name?.[0],
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();


  return (
    <main className="profile-page">
      <div className="profile-container">

        <header className="profile-page-header">
          <div>
            <p className="profile-label">
              MY ACCOUNT
            </p>

            <h1>
              Profile
            </h1>

            <p>
              View and manage your
              personal information.
            </p>
          </div>
        </header>


        {success && (
          <div
            className="profile-message success"
            role="status"
          >
            {success}
          </div>
        )}


        {error && (
          <div
            className="profile-message error"
            role="alert"
          >
            {error}
          </div>
        )}


        <section className="profile-card">

          <div className="profile-summary">

            {profile?.avatar_url ? (
              <img
                className="profile-avatar"
                src={
                  profile.avatar_url
                }
                alt={fullName}
              />
            ) : (
              <div className="profile-avatar-fallback">
                {initials ||
                  "N"}
              </div>
            )}


            <div className="profile-summary-details">

              <h2>
                {fullName ||
                  "Neighbour"}
              </h2>

              <p>
                {currentUser?.email}
              </p>

              <span className="profile-role">
                {currentUser?.role ||
                  "Member"}
              </span>

            </div>


            {!editing && (
              <button
                type="button"
                className="edit-profile-button"
                onClick={() => {
                  setEditing(true);
                  setSuccess("");
                  setError("");
                }}
              >
                Edit Profile
              </button>
            )}

          </div>


          {!editing ? (
            <div className="profile-information">

              <div className="profile-info-item">
                <span>
                  First name
                </span>

                <strong>
                  {profile
                    ?.first_name ||
                    "Not provided"}
                </strong>
              </div>


              <div className="profile-info-item">
                <span>
                  Last name
                </span>

                <strong>
                  {profile
                    ?.last_name ||
                    "Not provided"}
                </strong>
              </div>


              <div className="profile-info-item">
                <span>
                  Email
                </span>

                <strong>
                  {currentUser
                    ?.email ||
                    "Not provided"}
                </strong>
              </div>


              <div className="profile-info-item">
                <span>
                  Phone number
                </span>

                <strong>
                  {profile
                    ?.phone_number ||
                    "Not provided"}
                </strong>
              </div>


              <div className="profile-info-item">
                <span>
                  Address
                </span>

                <strong>
                  {profile
                    ?.address ||
                    "Not provided"}
                </strong>
              </div>


              <div className="profile-info-item profile-info-wide">
                <span>
                  Bio
                </span>

                <p>
                  {profile?.bio ||
                    "No bio added yet."}
                </p>
              </div>

            </div>
          ) : (
            <form
              className="profile-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="profile-form-grid">

                <label>
                  <span>
                    First name
                  </span>

                  <input
                    type="text"
                    name="first_name"
                    value={
                      form.first_name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>


                <label>
                  <span>
                    Last name
                  </span>

                  <input
                    type="text"
                    name="last_name"
                    value={
                      form.last_name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </label>


                <label>
                  <span>
                    Phone number
                  </span>

                  <input
                    type="tel"
                    name="phone_number"
                    value={
                      form.phone_number
                    }
                    onChange={
                      handleChange
                    }
                  />
                </label>


                <label>
                  <span>
                    Address
                  </span>

                  <input
                    type="text"
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                  />
                </label>


                <label className="profile-form-wide">
                  <span>
                    Avatar URL
                  </span>

                  <input
                    type="url"
                    name="avatar_url"
                    value={
                      form.avatar_url
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://..."
                  />
                </label>


                <label className="profile-form-wide">
                  <span>
                    Bio
                  </span>

                  <textarea
                    name="bio"
                    value={
                      form.bio
                    }
                    onChange={
                      handleChange
                    }
                    rows="5"
                    placeholder="Tell your neighbours a little about yourself..."
                  />
                </label>

              </div>


              <div className="profile-form-actions">

                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={
                    handleCancel
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          )}

        </section>

      </div>
    </main>
  );
}


export default Profile;