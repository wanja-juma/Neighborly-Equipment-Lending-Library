const API_BASE_URL = 'http://localhost:3001';

export async function getTools({ page = 1, limit = 10 } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/items?_page=${page}&_limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tools');
  }

  const data = await response.json();
  const totalCount = Number(response.headers.get('X-Total-Count')) || data.length;
  const totalPages = Math.ceil(totalCount / limit);

  return { tools: data, totalCount, totalPages };
}