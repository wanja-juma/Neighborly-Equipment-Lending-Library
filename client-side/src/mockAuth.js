const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        "Authentication request failed."
    );
  }

  return data;
}

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
}) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    }
  );

  return handleResponse(response);
}

export async function loginUser({
  email,
  password,
}) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return handleResponse(response);
}

export async function logoutUser() {
  const token = localStorage.getItem(
    "access_token"
  );

  if (token) {
    const response = await fetch(
      `${API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await handleResponse(response);
  }
<<<<<<< Updated upstream
  return { firstName: user.firstName, lastName: user.lastName, email: user.email }
}
=======

  localStorage.removeItem("access_token");
  localStorage.removeItem("neighborlyUser");
}
>>>>>>> Stashed changes
