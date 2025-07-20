import axios from 'axios';
import type { ApiResponse, PokemonType } from './types';

const API_BASE = 'https://pokeapi.co/api/v2';

export const fetchCharacters = async (
  searchTerm = '',
  page = 1
): Promise<ApiResponse> => {
  const limit = 10;
  const offset = (page - 1) * limit;

  if (searchTerm) {
    try {
      const response = await axios.get(
        `${API_BASE}/pokemon/${searchTerm.toLowerCase()}`
      );
      return {
        results: [
          {
            id: response.data.id,
            name: response.data.name,
            height: response.data.height,
            weight: response.data.weight,
            types: response.data.types,
          },
        ],
        count: 1,
      };
    } catch {
      return { results: [], count: 0 };
    }
  }

  const response = await axios.get(`${API_BASE}/pokemon`, {
    params: { limit, offset },
  });

  const detailedRequests = response.data.results.map((pokemon: PokemonType) =>
    axios.get(pokemon.url)
  );

  const detailedResponses = await Promise.all(detailedRequests);
  return {
    results: detailedResponses.map((res) => ({
      id: res.data.id,
      name: res.data.name,
      height: res.data.height,
      weight: res.data.weight,
      types: res.data.types,
    })),
    count: response.data.count,
  };
};
