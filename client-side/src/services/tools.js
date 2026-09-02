const API_URL =
  import.meta.env.VITE_TOOLS_API_URL ||
  "http://localhost:3000";

export async function getTools({ page = 1, limit = 6 } = {}) {
  const response = await fetch(
    `${API_URL}/items?_page=${page}&_limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tools");
  }

  const tools = await response.json();

  const totalCount = Number(
    response.headers.get("X-Total-Count") || tools.length
  );

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / limit)
  );

  return {
    tools,
    totalPages,
  };
}
