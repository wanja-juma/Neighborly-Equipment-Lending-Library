const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5555/api";


export async function getTools({
  page = 1,
  limit = 6,
} = {}) {
  const response = await fetch(
    `${API_URL}/items`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch tools"
    );
  }

  const data = await response.json();

  const allTools = Array.isArray(data)
    ? data
    : data?.items || [];

  const startIndex =
    (page - 1) * limit;

  const endIndex =
    startIndex + limit;

  const tools =
    allTools.slice(
      startIndex,
      endIndex
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        allTools.length /
          limit
      )
    );

  return {
    tools,
    totalPages,
  };
}


export async function getToolById(
  toolId
) {
  const response = await fetch(
    `${API_URL}/items/${toolId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch tool"
    );
  }

  const data =
    await response.json();

  return data?.item || data;
}
