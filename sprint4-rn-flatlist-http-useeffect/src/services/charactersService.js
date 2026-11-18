import { API_BASE_URL } from '../config/constants';

export async function getCharacters({ page = 1, name = '' } = {}) {
  const trimmedName = name.trim();

  let url = `${API_BASE_URL}/character?page=${page}`;
  if (trimmedName) {
    url += `&name=${encodeURIComponent(trimmedName)}`;
  }

  const response = await fetch(url);

  if (response.status === 404 && trimmedName) {
    return { results: [], hasNextPage: false };
  }

  if (!response.ok) {
    throw new Error(`No se pudieron cargar los personajes (código ${response.status})`);
  }

  const data = await response.json();

  return {
    results: data.results,
    hasNextPage: data.info.next !== null,
  };
}
