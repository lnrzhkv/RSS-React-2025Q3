import axios, { type AxiosResponse } from 'axios';
import type {
  CharactersResponse,
  PokemonsTypesReponseData,
  PokemonType,
  Character,
} from '../../services/api/types';
import { API_BASE } from './constants';

const fallback = {
  results: [],
  count: 0,
  previous: null,
  next: null,
};

const normalizeResponses = (
  pokemonTypesResponse: AxiosResponse<PokemonsTypesReponseData>,
  detailedResponses: AxiosResponse<Character>[]
): CharactersResponse => {
  return {
    results: detailedResponses.map((res) => ({
      id: res.data.id,
      name: res.data.name,
      height: res.data.height,
      weight: res.data.weight,
      types: res.data.types,
      image: String(Object.values(res?.data?.sprites)?.filter(Boolean)?.[0]),
    })),
    count: pokemonTypesResponse.data.count,
    next: pokemonTypesResponse.data.next,
    previous: pokemonTypesResponse.data.previous,
  } satisfies CharactersResponse;
};

export const fetchCharacters = async (
  page = 1
): Promise<CharactersResponse> => {
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const response: AxiosResponse<PokemonsTypesReponseData> = await axios.get(
      `${API_BASE}/pokemon`,
      {
        params: { limit, offset },
      }
    );

    const detailedRequests = response.data.results.map((pokemon: PokemonType) =>
      axios.get(pokemon.url)
    );

    const detailedResponses: AxiosResponse<Character>[] =
      await Promise.all(detailedRequests);

    return normalizeResponses(response, detailedResponses);
  } catch {
    return fallback;
  }
};
