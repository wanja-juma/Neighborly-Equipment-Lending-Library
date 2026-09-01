const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";

export async function getTools() {
  const response = await fetch(
    `${API_URL}/items`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch tools"
    );
  }

  return response.json();
}

 
