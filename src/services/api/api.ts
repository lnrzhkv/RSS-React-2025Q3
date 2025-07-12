import axios from 'axios';
import type { ApiResponse, PokemonType } from './types';

const API_URL = 'https://pokeapi.co/api/v2';

export const fetchCharacters = async (
  searchRequest = '',
  page = 1
): Promise<ApiResponse> => {
  const limit = 10;
  const offset = (page - 1) * limit;

  if (searchRequest) {
    try {
      const response = await axios.get(
        `${API_URL}/pokemon/${searchRequest.toLowerCase()}`
      );
      return {
        results: response.data,
        count: 1,
      };
    } catch {
      return { results: [], count: 0 };
    }
  }

  const response = await axios.get(`${API_URL}/pokemon`, {
    params: { limit, offset },
  });

  const detailedRequests = response.data.results.map((pokemon: PokemonType) =>
    axios.get(pokemon.url)
  );

  const detailedResponses = await Promise.all(detailedRequests);

  return {
    results: detailedResponses.map((res) => res.data),
    count: response.data.count,
  };
};
