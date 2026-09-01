const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

export async function getTools() {
  const token = localStorage.getItem(
    "neighborlyToken"
  );

  const response = await fetch(
    `${API_URL}/items`,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch tools"
    );
  }

  const data = await response.json();

  return Array.isArray(data)
    ? data
    : data?.items || [];
}

 
