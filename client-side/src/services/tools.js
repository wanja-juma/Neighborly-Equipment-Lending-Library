const API_BASE_URL = 'http://localhost:3001';

export async function getTools() {
  const response = await fetch(`${API_BASE_URL}/tools`);

  if (!response.ok) {
    throw new Error('Failed to fetch tools');
  }

  return response.json();
}